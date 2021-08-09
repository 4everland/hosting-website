<template>
  <div>
    <v-card outlined>
      <e-card-head-1 title="Project Settings">
        <div>
          Update the settings of
          <span class="white-0">{{ info.name || "project" }}</span>
        </div>
      </e-card-head-1>
      <e-side-menus :list="menus" :info="info"></e-side-menus>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    const { id } = this.$route.params;
    return {
      menus: [
        {
          text: "General",
          comp: "st-general",
        },
        {
          text: "Domains",
          comp: "st-domains",
        },
        {
          text: "Git",
          comp: "st-git",
        },
        {
          text: "Environment Variables",
          comp: "st-env-var",
        },
        {
          text: "Advanced",
          comp: "st-advanced",
        },
      ],
      id,
    };
  },
  computed: {
    info() {
      return this.$store.state.projectInfo;
    },
  },
};
</script>