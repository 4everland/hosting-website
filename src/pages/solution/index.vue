<template>
  <div class="wrap-1">
    <e-storage ref="stor"></e-storage>
    <div
      class="con-3 bg-white bd-1 bdrs-5 d-flex f-center al-c pos-r"
      style="min-height: 480px; height: 55vh"
      :style="{
        background: `-webkit-linear-gradient(-55deg, ${info.bg1}, #fff 60%)`,
      }"
    >
      <div class="ta-c" v-if="info">
        <h1 class="fz-25">{{ info.name }}</h1>
        <div class="fz-16 gray mt-5">
          {{ info.solution }}
        </div>
        <div class="mt-8">
          <v-btn color="primary" large @click="onDeploy">
            <v-icon>mdi-play-outline</v-icon>
            <span class="ml-1">Deploy Free</span>
          </v-btn>
        </div>
      </div>

      <img
        :src="info.logo"
        class="pos-a btm-0 right-0 pa-10"
        style="height: 140px"
      />
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
  methods: {
    async onDeploy() {
      const needCheck = await this.$refs.stor.checkStorage();
      if (needCheck) return;
      this.$router.push(this.link);
    },
  },
};
</script>