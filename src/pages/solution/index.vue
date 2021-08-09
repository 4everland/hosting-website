<template>
  <div>
    <div class="ta-c mt-10" v-if="info">
      <h1 class="fz-60">{{ info.name }}</h1>
      <div class="fz-25 mt-5">
        {{ info.solution }}
      </div>
      <div class="mt-8">
        <v-btn color="primary" large :to="link">
          <v-icon>mdi-play-outline</v-icon>
          <span class="ml-1">Deploy Free</span>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    name() {
      return this.$route.params.name;
    },
    info() {
      return this.$getFramework(this.name);
    },
    link() {
      const src =
        `https://github.com/4everland/project-templates/tree/main/examples/` +
        this.name;
      return `/new/clone-flow?s=${encodeURIComponent(src)}&t=${this.info.name}`;
    },
  },
};
</script>