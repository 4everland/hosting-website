<style>
.theme--light.v-messages {
  display: none;
  /* v-treeview底部 无内容 */
}
</style>
<template>
  <v-card v-if="importItem">
    <v-card-title> {{ $t(`${locales}SelectScope`) }} </v-card-title>
    <v-card-text>
      <div class="d-flex al-c">
        <span>{{ $t(`${locales}importing`) }}</span>
        <v-icon size="16" class="ml-5">mdi-github</v-icon>
        <span class="ml-2">{{ importItem.name }}</span>
        <v-icon size="16" class="ml-5">mdi-source-branch</v-icon>
        <span class="ml-2">{{ importItem.defaultBranch }}</span>
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
                <v-radio v-if="item.type == 'dir'" :value="item.id"></v-radio>
              </template>
            </v-treeview>
          </v-radio-group>
        </v-window-item>

        <v-window-item :value="2">
          <v-form class="mt-5 ml-3 mr-3 mb-4">
            <v-text-field label="Project Name" v-model="form.name" />
            <div class="d-flex al-c">
              <v-text-field label="Root Dorectory" :value="srcDir" disabled />
              <v-btn color="primary" class="ml-5" small @click="curStep = 1">{{
                $t(`${locales}Edit`)
              }}</v-btn>
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
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  {{ $t(`${locales}BuildOutputSettings`) }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <div class="d-flex al-c">
                    <v-text-field
                      persistent-placeholder
                      v-model="form.buildCommand"
                      :label="$t(`${locales}BuildCommand`)"
                      :disabled="!isOverBuild"
                      :placeholder="buildCommandHint"
                    />
                    <v-switch
                      v-model="isOverBuild"
                      :label="$t(`${locales}Override`)"
                      class="ml-5"
                    ></v-switch>
                  </div>
                  <div class="d-flex al-c">
                    <v-text-field
                      persistent-placeholder
                      v-model="form.outputDirectory"
                      :label="$t(`${locales}OutputDirectory`)"
                      :disabled="!isOverOutput"
                      placeholder="`dist` if it exists, or `. `"
                    />
                    <v-switch
                      v-model="isOverOutput"
                      :label="$t(`${locales}Override`)"
                      class="ml-5"
                    ></v-switch>
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
                      v-model="envForm.name"
                      :label="$t(`${locales}Name`)"
                      placeholder="Variable_Name"
                    />
                    <v-text-field
                      persistent-placeholder
                      v-model="envForm.value"
                      :label="$t(`${locales}Value`)"
                      placeholder="i9ju23nf39"
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
      isOverBuild: true,
      isOverOutput: true,
      buildCommandHint: "`npm run build`",
      form: {
        name: "",
        framework: "",
        buildCommand: "",
        outputDirectory: "",
      },
      envHeaders: [
        { text: "Name", value: "name" },
        { text: "Value", value: "enc" },
      ],
      envList: [],
      envForm: {
        name: "",
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
    },
    isOverBuild() {
      this.form.buildCommand = "";
    },
    isOverOutput() {
      this.form.outputDirectory = "";
    },
  },
  methods: {
    onFramework(val) {
      const item = this.frameworks.filter((it) => it.slug == val)[0];
      const { buildCommand = {}, outputDirectory = {} } = item.settings || {};
      this.form.buildCommand = buildCommand.value || "";
      this.buildCommandHint = buildCommand.placeholder || "";
      this.form.outputDirectory = outputDirectory.value || "";
    },
    addEnv() {
      const { name } = this.envForm;
      if (!name) return this.$alert("invalid name");
      this.envList.push(this.envForm);
      this.envForm = {
        name: "",
        value: "",
      };
    },
    async onDeploy() {
      if (this.curStep < 2) {
        this.curStep += 1;
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
        if (this.buildCommandHint) {
          const arr = this.buildCommandHint.split(" or ");
          body.buildCommand =
            arr.length > 1 ? arr[0].trim() : this.buildCommandHint;
        } else body.buildCommand = "npm run build";
      }
      body.buildCommand = body.buildCommand.replace(/`/g, "");
      if (!body.outputDirectory) {
        body.outputDirectory = "dist";
      }
      console.log(body);
      try {
        this.creating = true;
        const { data } = await this.$http.post("/project", body);
        const projId = data.projectId;
        const {
          data: { taskId },
        } = await this.$http.post(`/project/${projId}/build`);
        // await this.$alert('Project created successfully')
        this.$router.replace(`/build/${projId}/${taskId}/overview`);
      } catch (error) {
        //
      }
      this.creating = false;
    },
    async onSelect() {
      this.form.name = this.importItem.name;
      let framework = this.importItem.frameWorkAdvice || null;
      if (framework == "other") framework = null;
      this.form.framework = framework;
      try {
        this.selecting = true;
        await this.getRepoDir();
        this.curStep = 1;
      } catch (error) {
        console.log(error);
        this.curStep = 2;
      }
      this.selecting = false;
    },
    async getRepoDir(item) {
      const params = {};
      if (item) {
        params.rootPath = item.id;
      }
      let { data } = await this.$http.get("/repo/dir/" + this.importItem.name, {
        params,
      });
      data = data
        .map((it) => {
          it.id = it.fullPath;
          if (it.type == "dir") it.children = [];
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
