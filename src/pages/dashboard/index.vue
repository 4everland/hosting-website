<style lang="scss">
.bg-act-1 {
  background: #1f2228 url(/img/bg/act-bg1.jpeg) no-repeat;
  background-size: 100%;
  .con-2 {
    max-width: 920px;
  }
}
</style>
<template>
  <div>
    <div class="bg-white shadow-1 pos-s z-100" style="top: 0">
      <div class="con-1">
        <v-tabs :color="$color1" :value="curPath">
          <!-- <v-tabs-slider :color="curTab.color || 'primary'"></v-tabs-slider> -->
          <v-tab
            replace
            :to="'/dashboard/' + it.path"
            v-for="(it, i) in tabList"
            :key="i"
          >
            <v-icon :color="it.color" v-if="it.icon">mdi-{{ it.icon }}</v-icon>
            <span
              :style="{
                color: it.color,
              }"
              >{{ it.title }}</span
            >
          </v-tab>
        </v-tabs>
      </div>
    </div>
    <div :class="curTab.wrapCls" class="wrap-1">
      <div :class="curTab.conCls" class="con-2" style="min-height: 50vh">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      locales: "dashboard.index.",
      curIdx: null,
    };
  },
  computed: {
    actStatus() {
      return this.$store.state.actStatus;
    },
    curPath() {
      return this.$route.path;
    },
    tabs() {
      return [
        {
          title: this.$t(`dashboard.index.Projects`),
          path: "projects",
        },
        {
          title: this.$t(`dashboard.index.Domains`),
          path: "domains",
        },
        {
          title: this.$t(`dashboard.index.Statistics`),
          path: "statistics",
        },
        // {
        //   title: this.$t(`dashboard.index.Billing`),
        //   path: "billing",
        // },
        {
          title: this.$t(`dashboard.index.Settings`),
          path: "settings",
        },
        {
          title: "FirstLanding",
          path: "first-landing",
          icon: this.actStatus == 1 ? "fire" : null,
          // color: "#ff5252",
          wrapCls: "bg-act-1",
          // conCls: "act-con",
        },
      ];
    },
    tabList() {
      return this.tabs.filter((it) => {
        if (it.path == "first-landing" && this.actStatus == 0) {
          return false;
        }
        return !it.hide;
      });
    },
    curTab() {
      return (
        this.tabs.filter((it) => {
          return it.path == this.curPath.replace(/\/.+\//, "");
        })[0] || {}
      );
    },
  },
  watch: {
    curPath(val) {
      console.log(val);
    },
  },
};
</script>