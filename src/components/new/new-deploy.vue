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
        <v-icon size="16" class="ml-5">mdi-source-branch</v-icon>
        <a
          class="ml-2 b u"
          :href="
            importItem.cloneUrl.replace(
              '.git',
              '/tree/' + importItem.defaultBranch
            )
          "
          target="_blank"
        >
          {{ importItem.defaultBranch }}
        </a>
      </div>
    </v-card-text>
    <div
      class="pd-20 ov-a"
      style="max-height: 55vh"
      :class="{
        'bdt-1': curStep > 0,
      }"
    >
      <v-window v-model="curStep">
        <v-window-item :value="0">
          <div class="mb-8">
            <div class="bd-1 pd-20 d-flex al-c">
              <img
                :src="userInfo.avatar"
                style="width: 40px; height: 40px"
                class="bdrs-100 bg-f8"
              />
              <span class="fz-18 ml-5">{{ importItem.namespace }}</span>
              <v-btn
                color="primary"
                class="ml-auto"
                small
                @click="onSelect"
                :loading="selecting"
                >{{ $t(`${locales}Select`) }}</v-btn
              >
            </div>
            <!-- <div class="fz-14 gray mt-5">
            Now that you've selected a Git repository to import, you can either create a new 4everland Team and deploy theGit repository to it, or deploy it your existing Personal Account.
          </div> -->
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
                  <div class="d-flex al-c">
                    <v-text-field
                      v-if="!cmdItems.length"
                      persistent-placeholder
                      v-model="form.buildCommand"
                      :label="$t(`${locales}BuildCommand`)"
                      :placeholder="buildCommandHint"
                    />
                    <v-select
                      v-else
                      persistent-placeholder
                      :menu-props="{ offsetY: true }"
                      :label="$t(`${locales}BuildCommand`)"
                      :items="cmdItems"
                      item-text="text"
                      item-value="value"
                      v-model="form.buildCommand"
                    >
                      <template #item="{ item }">
                        <span>{{ item.key }}</span>
                        <span class="gray ml-1 mr-2">:</span>
                        <span
                          class="gray fz-13 line-1"
                          style="max-width: 400px"
                          >{{ item.script }}</span
                        >
                      </template>
                    </v-select>
                  </div>
                  <div class="d-flex al-c">
                    <v-text-field
                      persistent-placeholder
                      v-model="form.outputDirectory"
                      :label="$t(`${locales}OutputDirectory`)"
                      placeholder="`dist` if it exists, or `. `"
                    />
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
        v-if="curStep"
        :loading="creating"
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
// console.log(frameworks)

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
      presetList: ["vue", "React"],
      pan0Idx: 0,
      buildCommandHint: "`npm run build`",
      form: {
        name: "",
        framework: "",
        buildCommand: "",
        outputDirectory: "",
      },
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
    cmdItems() {
      let res = [];
      if (this.scripts) {
        for (const key in this.scripts) {
          const method = /build/.test(key) ? "unshift" : "push";
          let value = "npm run " + key;
          const script = this.scripts[key];
          if (script == "next build") value = script;
          res[method]({
            key,
            text: value,
            value,
            script,
          });
        }
      }
      return res;
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
    },
  },
  methods: {
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
      if (this.curStep < 2) {
        this.curStep += 1;
        this.envList = [];
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
        if (body.framework || this.cmdItems.length) {
          this.$toast("Build Command must not be empty");
        } else if (!body.framework) body.buildCommand = " ";
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
    async onSelect() {
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
        `/repo/${this.importItem.namespace}/dir/${this.importItem.name}`,
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
