<style lang="scss">
.logs-wrap {
  div {
    padding: 6px 20px;
    &.log-error,
    &.log-warning {
      background: #ffefd1;
      &:hover {
        background: #ffe4b2;
      }
    }
    &:hover {
      background: #eee;
    }
  }
  .time {
    min-width: 76px;
  }
}
@media screen and (min-width: 960px) {
  .v-application .build-btn-wrap {
    position: absolute;
    display: block !important;
    width: 150px;
    top: 0;
    right: 0;
    padding: 15px;
    .v-btn {
      width: 100%;
      margin-bottom: 20px;
    }
  }
}
</style>
<template>
  <div>
    <v-card outlined>
      <div class="pd-20">
        <v-row class="pos-r">
          <v-col cols="12" md="4">
            <div class="bd-1 bdrs-5 ov-h pos-r">
              <e-link :href="visitUrl">
                <v-img
                  :src="$getImgSrc(info.screenshotPath)"
                  lazy-src="img/proj-bg-def.png"
                  height="220px"
                ></v-img>
              </e-link>
              <v-progress-circular
                class="pos-center"
                v-if="isRunning"
                :size="50"
                color="#f3a536"
                indeterminate
              ></v-progress-circular>
            </div>

            <div class="mt-5">
              <div class="d-flex build-btn-wrap">
                <!-- :disabled="isRunning" -->
                <v-btn
                  color="error"
                  class="flex-1 mr-5"
                  :loading="deploying"
                  @click="onDeploy"
                >
                  Redeploy
                </v-btn>
                <v-btn
                  :disabled="!isSuccess || !visitUrl"
                  color="primary"
                  class="flex-1"
                  :href="visitUrl"
                  target="_blank"
                >
                  Visit
                </v-btn>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="pd-20" v-if="!info.taskId">
              <v-skeleton-loader type="article" />
            </div>
            <div class="fz-14" v-else>
              <div class="d-flex">
                <div class="flex-1">
                  <div class="label-1">Status</div>
                  <e-status :val="state"></e-status>
                </div>
                <div class="flex-1">
                  <div class="label-1">Environment</div>
                  <div>Production</div>
                </div>
                <div class="flex-1">
                  <div class="label-1">
                    <v-tooltip max-width="300" left>
                      <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">
                          <span>Duration</span>
                          <v-icon size="14" class="ml-1">
                            mdi-help-circle-outline
                          </v-icon>
                        </span>
                      </template>
                      <span>
                        The total time it took to create and build your
                        deployment before it was accessible through our edge
                        network.
                      </span>
                    </v-tooltip>
                  </div>
                  <div>
                    <e-time :endAt="info.endAt || nowDate">{{
                      info.createAt
                    }}</e-time>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="label-1">Created</div>
                  <div>
                    <e-time>{{ info.createAt }}</e-time>
                  </div>
                </div>
              </div>

              <div class="label-1 mt-6">Domains</div>
              <div>
                <e-domain :val="info.domain" :disabled="!isSuccess"></e-domain>
              </div>

              <div class="label-1 mt-6">Branch</div>
              <e-branch :info="info"></e-branch>

              <div class="mt-2">
                <e-commit :info="info.commits"></e-commit>
              </div>
            </div>
          </v-col>
        </v-row>

        <v-divider class="mt-5 mb-5"></v-divider>
        <div class="d-flex al-c">
          <span class="fz-20">Build Logs</span>
          <v-btn
            class="ml-auto"
            outlined
            color="#888"
            v-if="logs.length"
            v-clipboard="logText"
            @success="onCopied"
          >
            <v-icon size="14" class="mr-2">mdi-content-copy</v-icon>
            <span class="fz-13">Copy to Clipboard</span>
          </v-btn>
        </div>

        <div class="pd-20" v-if="!logs.length">
          <v-skeleton-loader type="card" />
        </div>
        <div
          v-else
          class="bd-1 bdrs-5 bg-f5 mt-5 fz-13 gray-6 ov-a"
          ref="con"
          style="max-height: 72vh"
        >
          <div class="mt-5 mb-5 logs-wrap">
            <div
              class="d-flex"
              :class="'log-' + it.type"
              v-for="(it, i) in logs"
              :key="i"
            >
              <span class="mr-6 gray time" v-if="it.timestamp">{{
                new Date(it.timestamp).format("HH:ii:ss.S")
              }}</span>
              <span>{{ it.content }}</span>
            </div>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      projInfo: (s) => s.projectInfo,
      buildInfo: (s) => s.buildInfo,
      nowDate: (s) => s.nowDate,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    projName() {
      return this.$route.params.projName;
    },
    taskId() {
      return this.$route.params.taskId;
    },
    isRunning() {
      return this.state == "running";
    },
    isSuccess() {
      return this.state == "success";
    },
    visitUrl() {
      const { domain } = this.info;
      if (domain) return "//" + domain;
      return "";
    },
    logText() {
      return this.logs
        .map((it) => {
          return `${new Date(it.timestamp).format("HH:ii:ss.S")} ${it.content}`;
        })
        .join("\n");
    },
  },
  data() {
    return {
      info: {},
      logs: [],
      deploying: false,
      state: "",
    };
  },
  watch: {
    taskId() {
      this.info = {};
      this.logs = [];
      this.initData();
    },
    buildInfo({ name, data }) {
      if (data.taskId == this.taskId) {
        console.log(this.taskId, name);
        this.state = data.state.toLowerCase();
        const last = this.logs[this.logs.length - 1];
        if (name != "log") {
          if (data.state == "SUCCESS") {
            this.onBuildSuc();
          }
          this.initData();
        } else if (last && last.content != data.content) {
          this.logs.push(data);
          this.goLogEnd();
        }
      }
    },
  },
  mounted() {
    this.initData();
  },
  methods: {
    async onBuildSuc() {
      const { data } = await this.$http.get(
        `/project/task/${this.info.projectId}/all`
      );
      if (data.length > 1) return;
      let html =
        "You just deployed a new Project to 4everland." +
        `<div class="mt-5 ta-c"><img src="img/build-suc.svg" style="height: 200px;" /></div>`;
      this.$alert(html, "Congratulations!", {
        type: "success",
      });
    },
    async initData() {
      try {
        const { data } = await this.$http.get(
          `/project/task/object/${this.taskId}`
        );
        this.info = data.task;
        this.state = data.task.state.toLowerCase();
        this.logs = data.log;
        this.goLogEnd();
        // if(this.info.projectId != this.projInfo.id) {
        //   await this.$store.dispatch('getProjectInfo', this.info.projectId)
        // }
      } catch (error) {
        console.log(error);
      }
    },
    onCopied() {
      this.$notice("copied");
    },
    async onDeploy() {
      try {
        let html =
          "You are about to create a new Deployment with the same source code as your current Deployment, but with the newest configuration from your Project Settings.";
        // html += '<p class="mt-3">The following Domains will point to your new Deployment:</p>'
        await this.$confirm(html, "Redeploy to Production", {
          confirmText: "Redeploy",
        });
        this.deploying = true;
        const { data } = await this.$http.post(
          `/project/${this.taskId}/redeploy`
        );
        this.$router.replace(`/build/${this.projName}/${data.taskId}/overview`);
      } catch (error) {
        console.log(error, "build err");
      }
      this.deploying = false;
    },

    goLogEnd() {
      this.$nextTick(() => {
        const el = this.$refs.con;
        if (el) el.scrollTo(0, el.scrollHeight);
      });
    },
    scrollToLog() {
      const el = this.$refs.con;
      if (el) window.scrollTo(0, el.offsetTop);
      this.goLogEnd();
    },
  },
};
</script>