<template>
  <div class="wrap-1">
    <v-dialog v-model="showSelect" max-width="600">
      <div class="pos-r">
        <div
          class="pos-a top-0 right-0 pd-15 z-100 hover-1"
          @click="showSelect = false"
        >
          <v-icon>mdi-close</v-icon>
        </div>
      </div>
      <e-deploy
        :value="showSelect"
        :clone="!!isClone"
        :importItem="importItem"
        @close="showSelect = false"
      ></e-deploy>
    </v-dialog>

    <div class="con-1">
      <v-row>
        <v-col cols="12" md="6">
          <v-card outlined :min-height="minHeight">
            <div class="pd-20">
              <div class="fz-20 fw-b mr-10">
                {{ $t(`${locales}ImportGitRepositor`) }}
              </div>
              <div class="d-flex al-c mb-5 mt-1">
                <v-btn small :loading="loading" @click="getList" class="mr-3">
                  Refresh
                </v-btn>
                <v-btn color="primary" class="mr-3" @click="addNew" small>
                  {{ $t(`${locales}AddGithub`) }}</v-btn
                >
                <v-text-field
                  v-model="keyword"
                  prepend-icon="mdi-magnify"
                  style="margin-top: 14px"
                  :placeholder="$t(`${locales}Search`)"
                  dense
                ></v-text-field>
              </div>

              <v-skeleton-loader v-if="!list" type="article" />

              <div
                class="bd-1 bg-f5 bdrs-5 pa-10 d-flex flex-center al-c"
                style="min-height: 355px"
                v-else-if="!list.length"
              >
                <div>
                  <div>{{ $t(`${locales}NoGitRepositoriesFound`) }}</div>
                  <div class="gray fz-14 mt-3">
                    <p>{{ $t(`${locales}TrySelectingDifferentGit`) }}</p>
                  </div>
                  <v-skeleton-loader
                    v-if="timing"
                    class="mt-5"
                    type="article"
                  />
                </div>
              </div>
              <div class="ta-c mt-8" v-else-if="!repoList.length">
                <h3>{{ $t(`${locales}NoResultsFound`) }}</h3>
              </div>
              <div class="bd-1 bdrs-5 ov-a" style="max-height: 355px" v-else>
                <div v-for="(it, i) in repoList" :key="i">
                  <div class="pd-20 d-flex al-c">
                    <!-- <v-icon class="mr-5">mdi-wallet</v-icon> -->
                    <img :src="it.fwImg" style="width: 22px" class="mr-2" />
                    <span class="fz-17 line-1 mr-1">{{ it.name }}</span>
                    <v-icon
                      v-if="it.private"
                      color="#999"
                      size="16"
                      class="ml-1"
                      >mdi-lock-outline</v-icon
                    >
                    <span class="ml-2 mr-3 gray fz-13 shrink-0">
                      <e-time>{{ it.updateAt }}</e-time>
                    </span>
                    <v-btn
                      class="ml-auto"
                      color="primary"
                      small
                      @click="onImport(it)"
                      >{{ $t(`${locales}Import`) }}</v-btn
                    >
                  </div>
                  <v-divider v-if="i < repoList.length - 1"></v-divider>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card outlined :min-height="minHeight">
            <div class="pd-20">
              <div class="fz-20 fw-b mr-10">
                {{ $t(`${locales}CloneTemplate`) }}
              </div>
              <div class="mt-6 gray fz-15">
                {{ $t(`${locales}GetStartedwithTemplate`) }}
              </div>
              <v-row class="mt-6">
                <v-col cols="6" v-for="(it, i) in tplList" :key="i">
                  <a class="bd-1 d-b hover-1" :href="getTplLink(it)" v-ripple>
                    <v-img :src="it.img" height="120"></v-img>
                    <div class="pd-10 d-flex al-c">
                      <img :src="it.logo" style="width: 20px" />
                      <div class="ml-2">{{ it.title }}</div>
                    </div>
                  </a>
                </v-col>
              </v-row>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import eDeploy from "./e-deploy.vue";

export default {
  components: {
    eDeploy,
  },
  data() {
    const { c } = this.$route.query;
    return {
      locales: "new.index.",
      cloneDir: c,
      isClone: false,
      minHeight: 520,

      list: null,
      loading: false,
      showSelect: false,
      importItem: null,
      tplList: [
        {
          img: "img/new/nextjs.png",
          logo: "img/logos/next.svg",
          title: "Next.js",
          src: "https://github.com/4everland/project-templates/tree/main/examples/nextjs",
        },
        {
          img: "img/new/vue.png",
          logo: "img/logos/vuejs.png",
          title: "Vue.js",
          src: "https://github.com/4everland/project-templates/tree/main/examples/vue",
        },
        {
          img: "img/new/nuxtjs.png",
          logo: "img/logos/nuxt.svg",
          title: "Nuxt.js",
          src: "https://github.com/4everland/project-templates/tree/main/examples/nuxtjs",
        },
        {
          img: "img/new/gatsbyjs.png",
          logo: "img/logos/gatsby.svg",
          title: "Gatsby.js",
          src: "https://github.com/4everland/project-templates/tree/main/examples/gatsby",
        },
      ],
      keyword: "",
      timing: null, // after select git, auto refresh
    };
  },
  computed: {
    ...mapState({
      isFocus: (s) => s.isFocus,
    }),
    repoList() {
      return this.list.filter((it) => {
        if (!this.keyword.trim()) return true;
        return new RegExp(this.keyword, "i").test(it.name);
      });
    },
  },
  watch: {
    isFocus(val) {
      if (val && this.isAddClick) {
        this.isAddClick = false;
        this.getList();
        let times = 0;
        this.clearTiming();
        this.timing = setInterval(() => {
          this.getList();
          times += this.list.length ? 3 : 1;
          if (times > 4) this.clearTiming();
        }, 5e3);
      }
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    clearTiming() {
      if (this.timing) {
        clearInterval(this.timing);
        this.timing = null;
      }
    },
    getTplLink(it) {
      return `#/new/clone-flow?s=${encodeURIComponent(it.src)}&t=${it.title}`;
    },
    onImport(it) {
      this.importItem = it;
      this.showSelect = true;
    },
    async addNew() {
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
    async getList() {
      try {
        this.loading = true;
        const { data } = await this.$http.get("/repo/list");
        this.list = data.map((it) => {
          it.fwImg = this.$getFramework(it.frameWorkAdvice).logo;
          return it;
        });
        if (this.cloneDir) {
          const item = this.list.filter((it) => it.name == this.cloneDir)[0];
          if (item) {
            this.isClone = true;
            this.onImport(item);
          }
        }
      } catch (error) {
        //
      }
      this.loading = false;
    },
  },
};
</script>
