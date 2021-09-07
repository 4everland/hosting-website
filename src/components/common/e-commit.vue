<template>
  <a v-if="info && href" :href="href" target="_blank" class="b u">
    {{ (info.hash || info.sha).substr(0, 6) }} — {{ info.message }}
  </a>
</template>

<script>
export default {
  props: {
    info: Object,
  },
  computed: {
    projInfo() {
      return this.$store.state.projectInfo;
    },
    href() {
      let { htmlUrl, url, prefix, hash } = this.info || {};
      if (htmlUrl) return htmlUrl;
      if (url) return url;
      if (prefix) return prefix + "commit/" + hash;
      const { namespace, name } = this.projInfo.repo || {};
      if (!name) return null;
      return `https://github.com/${namespace}/${name}/commit/${hash}`;
    },
  },
};
</script>