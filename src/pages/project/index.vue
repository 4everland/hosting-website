<template>
  <div>
    <div class="bg-white shadow-1 pos-s z-100" style="top: 0">
      <div class="con-1">
        <v-tabs :color="$color1" v-model="tabIdx">
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
    }),
  },
  data() {
    const { id } = this.$route.params;
    return {
      id,
      tabIdx: null,
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
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    async getInfo() {
      try {
        if (this.info.id != this.id) this.$loading();
        await this.$store.dispatch("getProjectInfo", this.id);
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