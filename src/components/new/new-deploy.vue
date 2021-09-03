<style>
.e-deploy-card .theme--light.v-messages {
  display: none;
  /* v-treeview底部 无内容 */
}
</style>
<template>
  <v-card v-if="importItem" class="e-deploy-card">
    <v-card-title> {{ $t(`${locales}SelectScope`) }} </v-card-title>
    <v-card-text>
      <div class="d-flex al-c">
        <span>{{ $t(`${locales}importing`) }}</span>
        <v-icon size="16" class="ml-5">mdi-github</v-icon>
        <a class="ml-2 b u" :href="importItem.cloneUrl" target="_blank">{{
          importItem.name
        }}</a>
        <template v-if="form.currentBranch">
          <v-icon size="16" class="ml-5">mdi-source-branch</v-icon>
          <a
            class="ml-2 b u"
            :href="
              importItem.cloneUrl.replace('.git', '/tree/' + form.currentBranch)
            "
            target="_blank"
          >
            {{ form.currentBranch }}
          </a>
        </template>
      </div>
    </v-card-text>
    <div class="pd-20 ov-a bdt-1" style="max-height: 55vh">
      <v-window v-model="curStep">
        <v-window-item :value="0">
          <div class="pd-20 pt-0">
            <div class="gray-6 fz-15">You can deploy by branch</div>
            <v-radio-group v-model="form.currentBranch" v-if="branchList">
              <div
                class="d-flex al-c mb-2"
                v-for="branch in branchList"
                :key="branch"
              >
                <v-radio :label="branch" :value="branch">
                  <template #label>
                    <v-icon size="16">mdi-source-branch</v-icon>
                  </template>
                </v-radio>
                <a
                  class="ml-2 b u fz-15 mb-2"
                  :href="importItem.cloneUrl.replace('.git', '/tree/' + branch)"
                  target="_blank"
                  >{{ branch }}</a
                >
              </div>
            </v-radio-group>
            <v-skeleton-loader v-else type="article" />
          </div>
        </v-window-item>

        <v-window-item :value="1">
          <div class="fz-14 gray">
            {{ $t(`${locales}SelectTips`) }}
          </div>
          <v-radio-group v-model="srcDir">
            <v-treeview
              dense
              :open="[initSrcDir]"
              :load-children="getRepoDir"
              :items="dirList"
            >
              <template v-slot:prepend="{ item }">
                <v-radio v-if="item.radio" :value="item.id"></v-radio>
              </template>
            </v-treeview>
          </v-radio-group>
        </v-window-item>

        <v-window-item :value="2">
          <v-form class="mt-5 ml-3 mr-3 mb-4">
            <v-text-field label="Project Name" v-model="form.name" />
            <div class="d-flex al-c">
              <v-text-field label="Root Directory" :value="srcDir" disabled />
              <v-btn
                color="primary"
                class="ml-5"
                small
                :disabled="creating"
                @click="curStep = 1"
                >{{ $t(`${locales}Edit`) }}</v-btn
              >
            </div>
            <v-select
              v-model="form.framework"
              @input="onFramework"
              :items="frameworks"
              item-text="name"
              item-value="slug"
              :label="$t(`${locales}FrameworkPreset`)"
            >
              <template #prepend v-if="chooseFramework">
                <img :src="chooseFramework.logo" style="width: 20px" />
              </template>
            </v-select>
            <v-expansion-panels v-model="pan0Idx">
              <v-expansion-panel>
                <v-expansion-panel-header>
                  {{ $t(`${locales}BuildOutputSettings`) }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <e-build-cmd
                    ref="buildCmd"
                    v-model="form.buildCommand"
                    :placeholder="buildCommandHint"
                    :scripts="scripts"
                  ></e-build-cmd>

                  <div class="d-flex al-c">
                    <v-text-field
                      persistent-placeholder
                      v-model="form.outputDirectory"
                      :label="$t(`${locales}OutputDirectory`)"
                      placeholder="`dist` if it exists, or `. `"
                    />
                    <e-tooltip bottom max-width="300">
                      <template #ref>
                        <v-icon size="15" class="ml-2">
                          mdi-help-circle-outline
                        </v-icon>
                      </template>
                      <p>
                        The directory in which your compiled frontend will be
                        located.
                      </p>
                      <p>
                        If you want to serve everything instead of a sub
                        directory, leave this field empty.
                      </p>
                    </e-tooltip>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

            <v-expansion-panels class="mt-5">
              <v-expansion-panel>
                <v-expansion-panel-header>
                  {{ $t(`${locales}EnvironmentVariables`) }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <div class="d-flex al-c">
                    <v-text-field
                      persistent-placeholder
                      v-model="envForm.key"
                      :label="$t(`${locales}Name`)"
                      placeholder="Variable_Name"
                    />
                    <v-text-field
                      persistent-placeholder
                      v-model="envForm.value"
                      :label="$t(`${locales}Value`)"
                      placeholder="Variable_Value"
                      class="ml-5"
                    />
                    <v-btn small color="primary" class="ml-5" @click="addEnv">{{
                      $t(`${locales}Add`)
                    }}</v-btn>
                  </div>
                  <v-data-table
                    :headers="envHeaders"
                    :items="envList2"
                    hide-default-footer
                    v-show="envList.length"
                  ></v-data-table>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-form>
        </v-window-item>
      </v-window>
    </div>

    <div class="pd-20 bdt-1 d-flex al-c">
      <v-btn small @click="onBack">
        {{ $t(`${locales}Back`) }}
      </v-btn>
      <v-btn
        small
        color="primary"
        class="ml-auto"
        v-if="branchList"
        :loading="creating || selecting"
        @click="onDeploy"
      >
        {{ $t(`${locales}Deploy`) }}
      </v-btn>
    </div>
  </v-card>
</template>

<script>
import frameworks from "../../assets/frameworks.json";
const srcDir = "./";

export default {
  props: {
    importItem: Object,
    value: Boolean,
    clone: Boolean,
  },
  data() {
    return {
      locales: "new.index.",
      selecting: false,
      curStep: 0,
      dirList: [],
      srcDir,
      initSrcDir: srcDir,
      frameworks,
      pan0Idx: 0,
      buildCommandHint: "",
      form: {
        name: "",
        framework: "",
        buildCommand: "",
        outputDirectory: "",
        currentBranch: "",
      },
      branchList: null,
      scripts: null,
      envHeaders: [
        { text: "Name", value: "key" },
        { text: "Value", value: "value" },
      ],
      envList: [],
      envForm: {
        key: "",
        value: "",
      },
      creating: false,
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    envList2() {
      return this.envList.map((it) => {
        return {
          ...it,
          enc: "Encrypt",
        };
      });
    },
    chooseFramework() {
      return this.frameworks.filter((it) => it.slug == this.form.framework)[0];
    },
  },
  mounted() {
    if (this.clone) {
      this.onSelect();
    }
  },
  watch: {
    value() {
      this.curStep = 0;
      this.getBranchList();
    },
  },
  methods: {
    async getBranchList() {
      this.form.currentBranch = "";
      this.branchList = null;
      try {
        const { data } = await this.$http.get(
          "/project/branch/repo/" + this.importItem.id
        );
        this.branchList = data;
        this.form.currentBranch = data[0];
      } catch (error) {
        //
      }
    },
    onFramework(val) {
      const item = this.frameworks.filter((it) => it.slug == val)[0] || {};
      const { buildCommand = {}, outputDirectory = {} } = item.settings || {};
      this.form.buildCommand = buildCommand.value || "";
      this.buildCommandHint = buildCommand.placeholder || "";
      this.form.outputDirectory = outputDirectory.value || "";
    },
    addEnv() {
      const { key } = this.envForm;
      if (!key) return this.$toast("Invalid Name");
      this.envList.push(this.envForm);
      this.envForm = {
        key: "",
        value: "",
      };
    },
    async getFramework() {
      try {
        this.scripts = null;
        this.form.buildCommand = "";
        const { data } = await this.$http.get(
          "/project/detect-framework/" + this.importItem.id
        );
        let { scripts, framework } = data;
        this.form.framework = framework || null;
        this.onFramework(this.form.framework);
        if (scripts) {
          this.scripts = JSON.parse(scripts);
          const { build } = this.scripts;
          if (build && framework != "nextjs") {
            this.form.buildCommand = "npm run build";
            this.$set(this.form, "buildCommand", "npm run build");
          }
          console.log(this.form);
        } else {
          if (!framework) this.form.outputDirectory = "./";
        }
      } catch (error) {
        console.log(error);
      }
    },
    async onDeploy() {
      if (this.curStep == 0) {
        return this.onBranch();
      } else if (this.curStep == 1) {
        this.curStep = 2;
        return;
      }
      const { id: repoId } = this.importItem;
      const body = {
        repoId,
        rootDirectory: this.srcDir,
        ...this.form,
        env: this.envList,
      };
      if (!body.buildCommand) {
        if (body.framework || this.scripts) {
          this.$alert("Build Command must not be empty");
          return;
        } else if (!body.framework) {
          body.buildCommand = " ";
        }
      }
      if (!body.outputDirectory) {
        body.outputDirectory = "dist";
      }
      console.log(body);
      let { devNum = 1 } = this.$route.query;
      const isDev = devNum > 1;
      try {
        this.creating = true;
        let i = 0;
        while (i < devNum) {
          i++;
          if (isDev) {
            body.name = this.form.name + "-dev" + i;
          }
          const { data } = await this.$http.post("/project", body);
          const projId = data.projectId;
          const {
            data: { taskId },
          } = await this.$http.post(`/project/${projId}/build`);
          // await this.$alert('Project created successfully')
          const path = `/build/${projId}/${taskId}/overview`;
          if (!isDev) {
            this.$router.replace(path);
          } else {
            const link = "index.html#" + path;
            console.log(body.name, location.origin + "/" + link);
            this.$confirm("go to build " + i).then(() => {
              window.open(link);
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
      this.creating = false;
    },
    async onBranch() {
      if (!this.form.currentBranch) {
        return this.$toast("Branch must be choosen.");
      }
      this.envList = [];
      this.form.name = this.importItem.name;
      let framework = this.importItem.frameWorkAdvice || null;
      if (framework == "other") framework = null;
      this.form.framework = framework;
      this.onFramework(framework);
      this.getFramework();
      try {
        this.selecting = true;
        await this.getRepoDir();
        this.curStep = 1;
      } catch (error) {
        console.log(error);
        // this.curStep = 2;
      }
      this.selecting = false;
    },
    async getRepoDir(item) {
      const params = {};
      if (item) {
        params.rootPath = item.id;
      }
      let { data } = await this.$http.get(
        `/repo/${this.importItem.namespace}/dir/${this.importItem.name}/${this.form.currentBranch}`,
        {
          params,
        }
      );
      data = data
        .map((it) => {
          it.id = it.fullPath;
          if (it.type == "dir") {
            it.children = [];
            if (!item) it.radio = true;
          }
          return it;
        })
        .sort((a) => {
          return a.type == "dir" ? -1 : 1;
        });
      if (item) {
        item.children = data;
      } else {
        this.dirList = [
          {
            name: this.importItem.name,
            id: srcDir,
            type: "dir",
            radio: true,
            children: data,
          },
        ];
      }
    },
    onBack() {
      if (this.curStep > 0) this.curStep -= 1;
      else this.$emit("close");
    },
  },
};
</script>
