<template>
  <div class="d-flex al-c">
    <v-icon size="18" :color="color">{{ icon }}</v-icon>
    <a
      v-if="href"
      :href="href"
      class="ml-2 b u"
      target="_blank"
      :style="{
        color,
      }"
    >
      {{ branch }}
    </a>
  </div>
</template>

<script>
export default {
  props: {
    info: Object,
    color: String,
    icon: {
      type: String,
      default: "mdi-github",
    },
  },
  computed: {
    projInfo() {
      return this.$store.state.projectInfo;
    },
    branch() {
      const config = this.info ? this.info.buildConfig : this.projInfo.config;
      return config.currentBranch;
    },
    href() {
      if (this.info) {
        const { prefix } = this.info.commits;
        if (prefix) return prefix + "tree/" + this.branch;
      }
      const { namespace, name } = this.projInfo.repo || {};
      if (!name) return null;
      return `https://github.com/${namespace}/${name}/tree/${this.branch}`;
    },
  },
};
</script>