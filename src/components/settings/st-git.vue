<template>
  <div>
    <div class="bd-1">
      <div class="pd-20">
        <h3>Connected Git Repository</h3>
        <div class="gray mt-1 fz-14">
          Seamlessly create Deployments for any commits pushed to your Git
          repository.
        </div>
        <div class="mt-5 bd-1">
          <div class="pd-15-20 d-flex al-c" v-if="repoName">
            <v-icon color="#4A96FA" size="32">mdi-github</v-icon>
            <div class="ml-5">
              <h3 class="color-1">{{ info.repo.pathPre }}</h3>
              <div class="gray fz-13">
                Connected at <e-time :value="info.repo.updateAt"></e-time>
              </div>
              <v-btn
                class="mt-2"
                @click="setConnect()"
                :loading="savingConnect"
                outlined
                color="#888"
                small
                v-if="asMobile"
              >
                Disconnect
              </v-btn>
            </div>
            <v-btn
              class="ml-auto"
              @click="setConnect()"
              :loading="savingConnect"
              outlined
              color="#888"
              small
              v-if="!asMobile"
            >
              Disconnect
            </v-btn>
          </div>
          <template v-else>
            <div class="pd-15-20" v-if="!repoList || !repoList.length">
              <v-btn :loading="listing" @click="getRepoList">
                <v-icon>mdi-github</v-icon>
                <span>Connect Github</span>
              </v-btn>
            </div>
            <div v-else>
              <div class="d-flex al-c bdb-1" v-if="repoList.length">
                <v-icon class="ml-4">mdi-magnify</v-icon>
                <input
                  type="text"
                  v-model="keyword"
                  placeholder="Search"
                  class="flex-1 pd-10"
                  style="height: 54px; outline: none"
                />
              </div>
              <div class="ta-c pd-20" v-if="!repoResList.length">
                No Result Found
              </div>
              <div v-else style="max-height: 60vh" class="ov-a">
                <div
                  class="pd-15 d-flex al-c"
                  :class="{
                    'bdt-1': i > 0,
                  }"
                  v-for="(it, i) in repoResList"
                  :key="i"
                >
                  <span class="fz-17 line-1">{{ it.name }}</span>
                  <!-- <span class="ml-3 mr-3 gray fz-13 shrink-0">
                  {{ it.updateAt }}
                </span> -->
                  <v-btn
                    class="ml-auto"
                    color="primary"
                    small
                    @click="onConnect(it)"
                  >
                    Connect
                  </v-btn>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="pd-15-20 bdt-1 bg-f8">
        <div class="gray fz-12">
          Learn more about
          <a
            href="https://docs.hosting.4everland.org/guide/settings.html"
            target="_blank"
            >4everland for Git</a
          >
        </div>
      </div>
    </div>

    <template v-if="repoName">
      <div class="bd-1 mt-5">
        <div class="pd-20">
          <h3>Production Branch</h3>
          <div class="gray mt-1 fz-14">
            By default,every commit pushed to the
            <span class="color-1">`main`</span> branch will trigger a Production
            Deployment instead of the usual Preview Deployment. You can switch
            to a different branch here.
          </div>
          <div class="mt-3">
            <v-select
              v-model="currentBranch"
              :items="branches"
              label="Select Branch"
            >
            </v-select>
          </div>
        </div>
        <div class="pd-10-20 bdt-1 bg-f8 d-flex al-c">
          <!-- <div class="gray fz-12">
            Learn more about <a href="" target="_blank">Production Branch</a>
          </div> -->
          <v-btn
            :disabled="currentBranch == info.config.currentBranch"
            :loading="savingBranch"
            @click="setBranch"
            color="primary"
            small
            class="ml-auto"
            >Save</v-btn
          >
        </div>
      </div>

      <st-git-hook :info="info" :branches="branches"></st-git-hook>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    info: Object,
  },
  data() {
    const { currentBranch } = this.info.config;
    return {
      savingConnect: false,
      currentBranch,
      branches: [],
      savingBranch: false,
      listing: false,
      repoList: null,
      keyword: "",
    };
  },
  computed: {
    ...mapState({
      isFocus: (s) => s.isFocus,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    repoName() {
      return this.info.repo.name;
    },
    repoResList() {
      return this.repoList.filter((it) => {
        if (!this.keyword.trim()) return true;
        return new RegExp(this.keyword, "i").test(it.name);
      });
    },
  },
  watch: {
    info() {
      this.getBranch();
    },
    isFocus(val) {
      if (val && this.isAddClick) {
        this.isAddClick = false;
        this.getRepoList();
      }
    },
  },
  mounted() {
    this.getBranch();
  },
  methods: {
    onConnect(it) {
      this.setConnect(it.id);
    },
    async getRepoList() {
      try {
        this.listing = true;
        const { data } = await this.$http.get("/repo/list");
        if (!data.length) {
          this.isAddClick = true;
          this.$openWindow(
            "https://github.com/apps/foreverlandxyz/installations/new"
          );
        }
        this.repoList = data;
      } catch (error) {
        //
      }
      this.listing = false;
    },
    onUpdted() {
      this.$setState({
        noticeMsg: {
          name: "updateProject",
        },
      });
    },
    async setConnect(repoId) {
      try {
        const { id } = this.info;
        let url = "/project/repo/" + id;
        let method = "delete";
        if (repoId) {
          url = `/project/repo/${id}/${repoId}`;
          method = "put";
          this.$loading();
        }
        this.savingConnect = true;
        await this.$http[method](url);
        this.onUpdted();
        if (repoId) {
          this.keyword = "";
          this.$toast("Connected Git Repository successfully");
        }
      } catch (error) {
        //
      }
      this.savingConnect = false;
      this.$loading.close();
    },
    async getBranch() {
      if (!this.repoName) return;
      try {
        const { data } = await this.$http.get(
          `/project/branch/${this.info.id}`
        );
        // console.log(data)
        this.branches = [data.current, ...(data.other || [])];
      } catch (error) {
        console.log(error);
      }
    },
    async setBranch() {
      try {
        this.savingBranch = true;
        await this.$http.put("/project/branch/git/" + this.info.id, {
          name: this.currentBranch,
        });
        this.onUpdted();
        this.$toast("Updated Production Branch successfully.");
      } catch (error) {
        //
      }
      this.savingBranch = false;
    },
  },
};
</script>