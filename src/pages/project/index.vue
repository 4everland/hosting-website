<template>
  <div>
    <div class="bg-white shadow-1 pos-s z-100" style="top: 0">
      <div class="con-1">
        <v-tabs :color="$color1" v-model="curPath">
          <v-tab
            replace
            :to="`/project/${id}/${it.path}`"
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
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      info: (s) => s.projectInfo,
      noticeMsg: (s) => s.noticeMsg,
      buildInfo: (s) => s.buildInfo,
    }),
    curTab() {
      return (
        this.tabs.filter((it) => {
          return it.path == this.curPath.replace(/\/.+\//, "");
        })[0] || {}
      );
    },
    navItems() {
      const { name, projectId } = this.info.config || {};
      if (!name) return [];
      const list = [
        {
          text: "Projects",
          to: "/dashboard/projects",
        },
        {
          text: name,
          to: `/project/${projectId}/overview`,
        },
      ];
      if (this.curTab.path != "overview") {
        list.push({
          text: this.curTab.title,
          disabled: true,
        });
      }
      return list;
    },
  },
  data() {
    const { id } = this.$route.params;
    return {
      id,
      curPath: "",
      tabs: [
        {
          title: "Overview",
          path: "overview",
        },
        {
          title: "Deployments",
          path: "deployments",
        },
        {
          title: "Commits",
          path: "commits",
        },
        {
          title: "Settings",
          path: "settings",
        },
      ],
    };
  },
  watch: {
    noticeMsg({ name }) {
      if (name == "updateProject") this.getInfo();
    },
    buildInfo({ data }) {
      console.log("project", data.state);
      const { taskId } = this.info.latest || {};
      if (data.state != this.lastState && data.taskId == taskId) {
        this.lastState = data.state;
        this.getInfo();
      }
    },
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    async getInfo() {
      try {
        if (this.info.id != this.id) this.$loading();
        await this.$store.dispatch("getProjectInfo", this.id);
        // console.log(this.info);
      } catch (error) {
        this.$confirm(error.message, "", {
          confirmText: "Retry",
        }).then(() => {
          this.getInfo();
        });
      }
      this.$loading.close();
    },
  },
};
</script>