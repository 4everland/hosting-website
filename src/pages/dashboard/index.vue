<template>
  <div>
    <div class="bg-white shadow-1 pos-s z-100" style="top: 0">
      <div class="con-1">
        <v-tabs :color="$color1">
          <v-tab
            replace
            :to="'/dashboard/' + it.path"
            v-show="!it.hide"
            v-for="(it, i) in tabs"
            :key="i"
          >
            {{ it.title }}
          </v-tab>
        </v-tabs>
      </div>
    </div>
    <div class="wrap-1">
      <div class="con-2" style="min-height: 50vh">
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
      tabs: [
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
        {
          title: this.$t(`dashboard.index.Billing`),
          path: "billing",
        },
        {
          title: this.$t(`dashboard.index.Settings`),
          path: "settings",
          hide: true,
        },
      ],
    };
  },
};
</script>