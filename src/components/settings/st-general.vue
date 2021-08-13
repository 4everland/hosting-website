<template>
  <div>
    <div class="bd-1 pd-20 pb-0">
      <h3>Project Name</h3>
      <div class="gray mt-1 fz-14">
        Used to identify your Project in the Dashboard, 4everland CLI, and in
        the URL of your Deployments.
      </div>
      <div class="mt-8 d-flex">
        <v-text-field outlined dense v-model="name">
          <template #prepend v-if="!asMobile">
            <!-- <span class="mt-1 fz-14 color-1">
              4everland.com/{{ userInfo.username }}/
            </span> -->
          </template>
        </v-text-field>
        <v-btn
          color="primary"
          :loading="savingName"
          @click="onSaveName"
          :disabled="info.name == name || !name"
          class="ml-4"
          style="margin-top: 2px"
        >
          Save
        </v-btn>
      </div>
    </div>

    <div class="bd-1 pd-20 mt-5">
      <h3>Build & Development Settings</h3>
      <div class="gray mt-1 fz-14">
        When using a framework of a new project, it will be automatically
        detected. As a result, several project settings are automatically
        configured to achieve the best result. You can override them below.
      </div>
      <div class="mt-5">
        <v-select
          v-model="form.framework"
          @input="onFramework"
          :items="frameworks"
          item-text="name"
          item-value="slug"
          label="Framework Preset"
        >
          <template #prepend v-if="chooseFramework">
            <v-tooltip bottom max-width="300">
              <template v-slot:activator="{ on }">
                <img
                  v-on="on"
                  :src="chooseFramework.logo"
                  style="width: 16px"
                />
              </template>
              <p>
                {{ chooseFramework.tagline }}
              </p>
              <!-- <p>
                <a :href="chooseFramework.website" target="_blank">website</a>
              </p> -->
            </v-tooltip>
          </template>
        </v-select>
        <div class="d-flex al-c">
          <v-text-field
            persistent-placeholder
            v-model="form.buildCommand"
            label="Build command"
            :disabled="!overForm.buildCommand"
            :placeholder="buildCommandHint"
          >
            <template v-slot:prepend>
              <v-tooltip bottom max-width="300">
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" size="15"> mdi-help-circle-outline </v-icon>
                </template>
                <p>
                  The command your frontend framework provides for compiling
                  your code.
                </p>
                <p>
                  If your frontend does not require a build, leave this field
                  empty.
                </p>
              </v-tooltip>
            </template>
          </v-text-field>
          <v-switch
            v-model="overForm.buildCommand"
            @change="onSwith('buildCommand')"
            label="Override"
            class="ml-5"
          ></v-switch>
        </div>
        <div class="d-flex al-c">
          <v-text-field
            persistent-placeholder
            v-model="form.outputDirectory"
            label="Output Directory"
            :disabled="!overForm.outputDirectory"
            :placeholder="outputDirHint"
          >
            <template v-slot:prepend>
              <v-tooltip bottom max-width="300">
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" size="15"> mdi-help-circle-outline </v-icon>
                </template>
                <p>
                  The directory in which your compiled frontend will be located.
                </p>
                <p>
                  If you want to serve everything instead of a sub directory,
                  leave this field empty.
                </p>
              </v-tooltip>
            </template>
          </v-text-field>
          <v-switch
            v-model="overForm.outputDirectory"
            @change="onSwith('outputDirectory')"
            label="Override"
            class="ml-5"
          ></v-switch>
        </div>
        <div class="d-flex al-c">
          <v-text-field
            persistent-placeholder
            v-model="form.installCommand"
            label="Install Command"
            :disabled="!overForm.installCommand"
            placeholder="‘yarn install’ or ‘npm install’"
          >
            <template v-slot:prepend>
              <v-tooltip bottom max-width="300">
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" size="15"> mdi-help-circle-outline </v-icon>
                </template>
                <p>
                  The command that is used to install your Project's software
                  dependencies.
                </p>
                <p>
                  If you don't need to install dependencies, override this field
                  and leave it empty.
                </p>
              </v-tooltip>
            </template>
          </v-text-field>
          <v-switch
            v-model="overForm.installCommand"
            @change="onSwith('installCommand')"
            label="Override"
            class="ml-5"
          ></v-switch>
        </div>
        <div class="ta-r mt-3">
          <v-btn
            :disabled="!isCmdChange"
            :loading="savingCmd"
            @click="onSaveCmd"
            color="primary"
            >Save</v-btn
          >
        </div>
      </div>
    </div>

    <div class="bd-1 pd-20 pb-0 mt-5">
      <h3>Root Directory</h3>
      <div class="gray mt-1 fz-14">
        The directory within your project, in which your code is located. Leave
        this field empty if your code is not located in a subdirectory. A new
        Deployment is required for your changes to take effect.
      </div>
      <div class="mt-5 d-flex">
        <v-text-field outlined dense v-model="rootDirectory"> </v-text-field>
        <v-btn
          color="primary"
          :disabled="rootDirectory == info.config.rootDirectory"
          :loading="savingRoot"
          @click="onSaveRoot"
          class="ml-4"
          style="margin-top: 2px"
          >Save</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import frameworks from "../../assets/frameworks.json";

export default {
  props: {
    info: Object,
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    chooseFramework() {
      return this.frameworks.filter((it) => it.slug == this.form.framework)[0];
    },
    isCmdChange() {
      let changed = false;
      for (const key in this.form) {
        let val = this.info.config[key] || "";
        if (this.form[key] != val) changed = true;
      }
      return changed;
    },
  },
  data() {
    const { name, config } = this.info;
    const form = {
      framework: "",
      outputDirectory: "",
      buildCommand: "",
      installCommand: "",
    };
    const overForm = {};
    for (const key in form) {
      const val = (form[key] = config[key] || "");
      overForm[key] = !!val;
    }
    return {
      name,
      rootDirectory: config.rootDirectory,
      form,
      overForm,
      frameworks,
      buildCommandHint: "",
      outputDirHint: "",
      isOverBuild: false,
      isOverOutput: false,
      isOverInstall: false,
      savingName: false,
      savingCmd: false,
      savingRoot: false,
    };
  },
  mounted() {
    this.onFramework(this.form.framework, true);
  },
  methods: {
    onSwith(key) {
      const isOver = this.overForm[key];
      // console.log(key)
      this.form[key] = isOver ? this.info.config[key] || "" : "";
    },
    async saveProject(body) {
      await this.$http.put("/project/config/" + this.info.id, body);
      this.$setState({
        noticeMsg: {
          name: "updateProject",
        },
      });
    },
    async onSaveRoot() {
      try {
        this.savingRoot = true;
        await this.saveProject({
          rootDirectory: this.rootDirectory,
        });
        this.$toast("Project updated successfully");
      } catch (error) {
        //
      }
      this.savingRoot = false;
    },
    async onSaveCmd() {
      try {
        this.savingCmd = true;
        await this.saveProject(this.form);
        this.$toast("Project updated successfully");
      } catch (error) {
        //
      }
      this.savingCmd = false;
    },
    async onSaveName() {
      try {
        await this.$confirm(`Your Project will be renamed to "${this.name}".`);
        this.savingName = true;
        await this.saveProject({
          name: this.name,
        });
        this.$toast("Project renamed successfully");
      } catch (error) {
        //
      }
      this.savingName = false;
    },
    onFramework(val, isInit) {
      const item = this.frameworks.filter((it) => it.slug == val)[0];
      if (!item) return;
      const { buildCommand = {}, outputDirectory = {} } = item.settings || {};
      if (!this.form.buildCommand && !isInit) {
        this.form.buildCommand = buildCommand.value || "";
      }
      this.buildCommandHint = buildCommand.placeholder || "";
      this.outputDirHint =
        outputDirectory.placeholder || "`dist` if it exists, or `.`";
    },
  },
};
</script>