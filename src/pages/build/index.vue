<template>
  <div>
    <div class="bg-white shadow-1 pos-s z-100 top-0">
      <div class="con-1">
        <v-tabs :color="$color1" v-model="curPath">
          <v-tab
            replace
            :to="`/build/${projName}/${taskId}/${it.path}`"
            v-for="(it, i) in tabs"
            :key="i"
          >
            {{ it.title }}
          </v-tab>
        </v-tabs>
      </div>
    </div>
    <div class="wrap-1">
      <div class="con-2">
        <v-breadcrumbs :items="navItems" class="pl-0 pt-0"></v-breadcrumbs>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    projInfo() {
      return this.$store.state.projectInfo;
    },
    curTab() {
      return (
        this.tabs.filter((it) => {
          return it.path == this.curPath.replace(/\/.+\//, "");
        })[0] || {}
      );
    },
    navItems() {
      const { projName, taskId } = this.$route.params;
      const { name, projectId } = this.projInfo.config || {};
      if (name != projName) return [];
      const list = [
        {
          text: "Projects",
          to: "/dashboard/projects",
        },
        {
          text: name,
          to: `/project/${name}/${projectId}/overview`,
        },
        {
          text: `Build-${taskId.slice(-6)}`,
          to: `/build/${name}/${taskId}/overview`,
        },
      ];
      if (this.curTab.path != "overview") {
        list.push({
          text: this.curTab.title,
          disabled: true,
        });
      }
      if (this.ftab) {
        list.splice(2, -1, {
          text: this.ftab.capitalize(),
          to: `/project/${name}/${projectId}/${this.ftab}`,
        });
      }
      return list;
    },
  },
  data() {
    const { projName, taskId } = this.$route.params;
    const { ftab } = this.$route.query;
    return {
      projName,
      taskId,
      ftab,
      curPath: "",
      tabs: [
        {
          title: "Overview",
          path: "overview",
        },
        {
          title: "Source",
          path: "source",
        },
      ],
    };
  },
};
</script>