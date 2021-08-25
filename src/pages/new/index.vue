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
      <new-deploy
        :value="showSelect"
        :clone="!!isClone"
        :importItem="importItem"
        @close="showSelect = false"
      />
    </v-dialog>

    <div class="con-1">
      <v-row>
        <v-col cols="12" md="6">
          <v-card outlined :min-height="minHeight">
            <div class="pd-20">
              <div class="fz-20 fw-b mr-10">
                {{ $t(`${locales}ImportGitRepository`) }}
              </div>
              <div class="d-flex al-c mb-3 mt-1">
                <v-btn small :loading="loading" @click="getList" class="mr-3">
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
                <v-menu
                  offset-y
                  :open-on-hover="!isTouch"
                  v-model="popAccounts"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      class="mr-3"
                      @click="addNew"
                      small
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon size="18" class="mr-1">mdi-github</v-icon>
                      <span>{{ selectLabel }}</span>
                    </v-btn>
                  </template>
                  <v-list dense v-if="accountList.length > 0">
                    <v-list-item
                      @click="onChooseAccount(it)"
                      link
                      v-for="it in accountList"
                      :key="it.githubId"
                    >
                      <v-list-item-title class="d-flex al-c">
                        <v-icon
                          size="18"
                          class="mr-1"
                          :color="
                            it.githubId == chooseGithubId ? '#4A96FA' : null
                          "
                        >
                          mdi-{{
                            it.ownerType == "Organization"
                              ? "account-group-outline"
                              : "account-outline"
                          }}
                        </v-icon>
                        <span
                          :class="{
                            'fw-b color-1': it.githubId == chooseGithubId,
                          }"
                          >{{ it.name }}</span
                        >
                      </v-list-item-title>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item link @click="addNew">
                      <v-list-item-title class="d-flex al-c">
                        <v-icon size="18" class="mr-1">mdi-plus</v-icon>
                        <span>Add account</span>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>

                <v-text-field
                  v-model="keyword"
                  clearable
                  @blur="onKeyword"
                  @keyup.enter="onKeyword"
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
                <div class="ta-c mt-8" v-if="keyword">
                  <h3>{{ $t(`${locales}NoResultsFound`) }}</h3>
                </div>
                <div v-else>
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
              <div v-else>
                <div class="bd-1 bdrs-5 ov-a" style="max-height: 355px">
                  <div v-for="(it, i) in list" :key="it.id">
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
                    <v-divider v-if="i < list.length - 1"></v-divider>
                  </div>
                </div>
                <div class="mt-3">
                  <v-pagination
                    @input="onPage"
                    v-model="page"
                    :length="pageLen"
                    prev-icon="mdi-menu-left"
                    next-icon="mdi-menu-right"
                    :total-visible="7"
                  ></v-pagination>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <new-tpl :minHeight="minHeight" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    const { c } = this.$route.query;
    return {
      locales: "new.index.",
      minHeight: 546,
      cloneDir: c,
      isClone: false,
      list: null,
      loading: false,
      showSelect: false,
      importItem: null,
      keyword: "",
      timing: null, // after select git, auto refresh
      accountList: [],
      chooseGithubId: !c ? localStorage.chooseGithubId || "" : "",
      popAccounts: false,
      page: 1,
      pageLen: 1,
    };
  },
  computed: {
    ...mapState({
      isFocus: (s) => s.isFocus,
      isTouch: (s) => s.isTouch,
    }),
    chooseAccount() {
      return this.accountList.filter(
        (it) => it.githubId == this.chooseGithubId
      )[0];
    },
    selectLabel() {
      if (this.chooseAccount) return this.chooseAccount.name;
      return "Connect To Git";
    },
  },
  watch: {
    isFocus(val) {
      if (val && this.isAddClick) {
        this.isAddClick = false;
        this.getAccounts();
        let times = 0;
        this.clearTiming();
        this.timing = setInterval(() => {
          if (!this.accountList.length) {
            this.getAccounts();
            times += 1;
            if (times > 4) this.clearTiming();
          }
        }, 5e3);
      }
    },
    showSelect(val) {
      if (!val) this.getList();
    },
    keyword(val) {
      if (!val) this.getList();
    },
  },
  mounted() {
    this.getAccounts();
  },
  methods: {
    clearTiming() {
      if (this.timing) {
        clearInterval(this.timing);
        this.timing = null;
      }
    },
    onImport(it) {
      this.importItem = it;
      this.showSelect = true;
    },
    async addNew() {
      if (this.isTouch && !this.popAccounts) {
        this.popAccounts = true;
        return;
      }
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
    onKeyword() {
      if (this.keyword == this.usedKeyword) return;
      this.page = 1;
      this.list = null;
      this.getList();
    },
    onPage() {
      this.getList();
    },
    onChooseAccount(it) {
      this.chooseGithubId = it.githubId;
      localStorage.chooseGithubId = this.chooseGithubId;
      this.list = null;
      this.page = 1;
      this.getList();
    },
    async getAccounts() {
      try {
        this.loading = true;
        const { data } = await this.$http.get("/user/git-namespaces");
        if (data.length) {
          data.sort((a, b) => {
            if (a.ownerType == "User" && b) return -1;
            return 0;
          });
          if (
            this.isAddClick === false &&
            data.length == this.accountList.length + 1
          ) {
            this.isAddClick = 0;
            const newItem = data.filter((it) => {
              return (
                this.accountList.filter((row) => row.githubId == it.githubId)
                  .length == 0
              );
            })[0];
            if (newItem) this.chooseGithubId = newItem.githubId;
          }
          this.accountList = data;
          if (!this.chooseAccount) {
            this.chooseGithubId = data[0].githubId;
          }
        }
        this.page = 1;
        this.getList();
      } catch (error) {
        //
      }
      this.loading = false;
    },
    async getList() {
      if (!this.chooseAccount) {
        this.list = [];
        return;
      }
      try {
        this.loading = true;
        const params = {
          githubId: this.chooseGithubId,
          page: this.page - 1,
        };
        if (this.keyword) params.word = this.keyword;
        const { data } = await this.$http.get("/repo/refresh/list", {
          params,
        });
        this.usedKeyword = this.keyword;
        this.pageLen = Math.max(1, Math.ceil(data.totalCount / 5));
        this.list = (data.repoList || []).map((it) => {
          it.fwImg = this.$getFramework(it.frameWorkAdvice).logo;
          return it;
        });
        if (this.cloneDir) {
          const item = this.list.filter((it) => it.name == this.cloneDir)[0];
          if (item) {
            this.isClone = true;
            this.onImport(item);
          }
          this.cloneDir = "";
        }
      } catch (error) {
        //
      }
      this.loading = false;
    },
  },
};
</script>
