<style lang="scss">
.logs-wrap {
  div {
    padding: 6px 20px;
    &.log-error {
      background: #fad4c5;
      &:hover {
        background: #fcc8b3;
      }
    }
    &.log-warn {
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
                  lazy-src="img/empty/cover.jpg"
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
                  @click="onBtn1"
                >
                  {{ btn1Txt }}
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
          <v-col cols="12" md="6" class="pos-r">
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
                    <e-tooltip max-width="300" left>
                      <span slot="ref">
                        <span>Duration</span>
                        <v-icon size="14" class="ml-1">
                          mdi-help-circle-outline
                        </v-icon>
                      </span>
                      <span>
                        The total time it took to create and build your
                        deployment before it was accessible through our edge
                        network.
                      </span>
                    </e-tooltip>
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

            <v-menu v-if="info.taskId" offset-y>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                  class="pos-a right-0 top-0 mt-2 mr-2"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  link
                  v-clipboard="
                    opt.name == 'copy' ? 'https://' + info.domain || '' : ''
                  "
                  @click="onOpt(opt)"
                  v-for="(opt, i) in optList"
                  :key="i"
                >
                  <v-list-item-title :class="opt.cls">
                    <v-icon size="16" :color="opt.iconColor"
                      >mdi-{{ opt.icon }}</v-icon
                    >
                    <span class="fz-15 ml-2">{{ opt.text }}</span>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
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
        <div class="pos-r" v-else>
          <div
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
                <span class="mr-6 gray time shrink-0" v-if="it.timestamp">{{
                  new Date(it.timestamp).format("HH:mm:ss.S")
                }}</span>
                <span class="wb-all">{{ it.content }}</span>
              </div>
            </div>
          </div>
          <div class="pos-a btm-0 right-0 z-10 pa-2" v-if="!isAtEnd">
            <v-chip
              small
              outlined
              :color="newLogNum > 0 ? 'success' : 'primary'"
              style="background: #fff !important"
              @click="goLogEnd(true)"
              >{{
                newLogNum > 0
                  ? `${newLogNum} new log${newLogNum > 1 ? "s" : ""}`
                  : "Go to last line"
              }}</v-chip
            >
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
          return `${new Date(it.timestamp).format("HH:mm:ss.S")} ${it.content}`;
        })
        .join("\n");
    },
    showCancel() {
      return this.isRunning || this.state == "queued";
    },
    btn1Txt() {
      if (this.showCancel) return "Cancel";
      return "Redeploy";
    },
  },
  data() {
    return {
      info: {},
      logs: [],
      isAtEnd: 0,
      endGap: 0,
      newLogNum: 0,
      deploying: false,
      popSuc: false,
      state: "",
      optList: [
        {
          text: "Copy URL",
          name: "copy",
          icon: "link-variant",
        },
        {
          text: "Delete",
          name: "delete",
          icon: "delete",
          cls: "red-1",
          iconColor: "error",
        },
      ],
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
        const last = this.logs[this.logs.length - 1];
        if (name != "log") {
          if (data.state == "SUCCESS" && !this.popSuc) {
            this.popSuc = true;
            this.onBuildSuc();
          }
          this.initData();
        } else if (last && last.content != data.content) {
          this.logs.push(data);
          if (!this.isAtEnd) this.newLogNum++;
          this.goLogEnd();
        }
        this.state = data.state.toLowerCase();
      }
    },
    state(val) {
      let sta = "running";
      if (this.isSuccess) sta = "success";
      else if (["failure", "cancelled"].includes(val)) sta = "error";
      this.$setIcon(`img/icon/favicon-${sta}.png`);
    },
    isAtEnd(val) {
      if (val) this.newLogNum = 0;
    },
  },
  mounted() {
    this.initData();
    // this.onBuildSuc();
  },
  methods: {
    onOpt(opt) {
      let { name } = opt;
      if (name == "copy") {
        this.$toast("Copied to clipboard !");
      } else if (name == "delete") {
        this.onDelete();
      }
    },
    async onCancel() {
      try {
        let html = `Canceling this deployment will immediately stop the build, with no way to resume.<br><br>
Are you sure you want to continue?`;
        await this.$confirm(html, "Cancel Deployment");
        this.$loading();
        await this.$http.post(`/project/${this.taskId}/cancel`);
        this.$toast("Cancelled successfully.");
        this.initData();
      } catch (error) {
        //
      }
      this.$loading.close();
    },
    async onDelete() {
      try {
        let html = `<div class="fz-14 mt-2">
<b>NOTE</b>: Deployments that are not actively receiving any traffic do not generate any costs nor count towards any limits.<br><br>
Deleting this deployment will prevent you from instantly reverting and might break links used in integrations, such as the ones in the pull requests of your Git provider.<br><br>
Are you sure you want to continue?
</div>
`;
        await this.$confirm(html, "Delete Deployment");
        this.$loading();
        await this.$http.delete("/project/task/object/" + this.taskId);
        this.$toast("Deleted successfully.");
        this.$router.back();
      } catch (error) {
        console.log(error);
      }
      this.$loading.close();
    },
    async onBuildSuc() {
      if (this.$store.state.actStatus > 0) {
        this.$replace(this.$route.path.replace("/overview", "/success"));
        return;
      }
      const { data } = await this.$http.get(
        `/project/task/${this.info.projectId}/all`
      );
      let html = "You just deployed a new project to 4EVERLAND.";
      if (data.length > 1) {
        html = "Redeployed successfully.";
      }
      html += `<div class="mt-5 ta-c"><img src="img/bg/party.gif" style="height: 200px;" /></div>`;
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
        const { name, projectId } = this.info.buildConfig;
        this.$setState({
          noticeMsg: {
            name: "setTitle",
            data: {
              title: name,
              link: `#/project/${projectId}/overview`,
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    onCopied() {
      this.$toast("Copied to clipboard !");
    },
    onBtn1() {
      if (this.showCancel) this.onCancel();
      else this.onDeploy();
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
        setTimeout(() => {
          location.reload();
        }, 800);
      } catch (error) {
        console.log(error, "build err");
      }
      this.deploying = false;
    },

    goLogEnd(force) {
      if (this.isAtEnd === false && !force) {
        return;
      }
      this.$nextTick(() => {
        const el = this.$refs.con;
        if (el) {
          if (!el.onscroll) {
            el.onscroll = () => {
              if (this.endGap)
                this.isAtEnd =
                  el.scrollHeight - el.scrollTop <= this.endGap + 5;
            };
          }
          el.scrollTo(0, el.scrollHeight);
          this.isAtEnd = true;
          setTimeout(() => {
            this.endGap = el.scrollHeight - el.scrollTop;
          }, 10);
        }
      });
    },
    scrollToLog() {
      const el = this.$refs.con;
      if (el) {
        window.scrollTo(0, el.offsetTop);
      }
      this.goLogEnd();
    },
  },
};
</script>