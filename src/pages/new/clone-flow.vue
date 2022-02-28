<template>
  <div class="wrap-1">
    <div class="con-3" style="max-width: 700px">
      <v-card outlined>
        <div class="pd-30">
          <h2>{{ $t(`${locales}CreateGitRepository`) }}</h2>
          <template v-if="loading">
            <v-skeleton-loader type="article" />
          </template>
          <div class="ta-c" v-else-if="errMsg">
            <img src="img/empty/bill.svg" style="height: 180px" />
            <div class="mt-3 red-1">
              {{ errMsg }}
            </div>
          </div>
          <template v-else>
            <div class="gray mt-5 fz-14">
              {{ $t(`${locales}CreateGitRepositoryTips`) }}
            </div>

            <div class="d-flex mt-6 flex-wrap">
              <div
                class="d-flex al-c fz-15 mr-8 mt-2"
                v-for="(it, i) in metaList"
                :key="i"
              >
                <v-icon size="20">{{ it.icon }}</v-icon>
                <a :href="it.link" target="_blank" class="b u ml-1">
                  {{ it.title }}
                </a>
              </div>
            </div>

            <div class="mt-8 d-flex al-c">
              <v-text-field
                style="max-width: 350px"
                :label="$t(`${locales}RepositoryName`)"
                v-model="name"
                hide-details
                dense
                persistent-placeholder
                autofocus
                autocomplete="off"
              ></v-text-field>
              <v-checkbox
                class="ml-5"
                v-model="isPrivate"
                :label="$t(`${locales}Private`)"
              ></v-checkbox>
            </div>
            <v-btn
              class="mt-5"
              color="primary"
              @click="onCreate"
              :loading="creating"
            >
              {{ $t(`${locales}Create`) }}
            </v-btn>
          </template>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    const { s, b } = this.$route.query;
    return {
      locales: "new.index.",
      source: s,
      branch: b,
      name: "",
      isPrivate: false,
      loading: false,
      info: {},
      errMsg: null,
      creating: false,
    };
  },
  computed: {
    ...mapState({
      isFocus: (s) => s.isFocus,
    }),
    metaList() {
      const info = this.info;
      return [
        {
          icon: "mdi-github",
          title: `${info.namespace}/${info.name}`,
          link: info.url,
        },
        {
          icon: "mdi-source-branch",
          title: info.defaultBranch,
          link: `${info.url}/tree/${info.defaultBranch}`,
          span: 2,
        },
        {
          icon: "mdi-folder-outline",
          title: `${info.dir}`,
          link: `${info.url}/tree/${info.defaultBranch}${info.dir}`,
          span: 5,
        },
      ];
    },
  },
  watch: {
    isFocus(val) {
      if (val && this.isAddClick) {
        this.isAddClick = false;
        this.onCreate();
      }
    },
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    async onCreate() {
      try {
        if (!this.name) {
          return this.$toast("Invalid Name");
        }
        this.creating = true;
        const { data: pushUrl } = await this.$http.get("/repo/create/new", {
          params: {
            name: this.name,
            isPrivate: this.isPrivate,
          },
          noTip: true,
        });
        const { data } = await this.$http.post("/template/clone-push", {
          pushUrl,
          ...this.info,
        });
        let link = "/new?c=" + data;
        const { e } = this.$route.query;
        if (e) link += `&e=${encodeURIComponent(e)}`;
        console.log(link);
        this.$router.replace(link);
      } catch (error) {
        if (error.code == 10026) {
          this.$confirm(error.message).then(() => {
            this.setGithub();
          });
        } else {
          this.$alert(error.message);
        }
      }
      this.creating = false;
    },
    async setGithub() {
      this.isAddClick = true;
      try {
        this.$loading();
        const { data } = await this.$http.get("/githubapp/install");
        this.$openWindow(data.installUrl);
      } catch (error) {
        //
      }
      this.$loading.close();
    },
    async getInfo() {
      try {
        this.loading = true;
        this.errMsg = null;
        const { data } = await this.$http.get("/template/git-repo", {
          params: {
            url: this.source,
          },
          // noTip: false,
        });
        this.info = data;
        let name = data.name.replace(/\./g, "-");
        if (data.dir != "/") {
          name = /\/([^/]*)$/.exec(data.dir)[1] + "-project";
        }
        this.name = name;
      } catch (error) {
        console.log(error);
        this.errMsg = error.message;
      }
      this.loading = false;
    },
  },
};
</script>
