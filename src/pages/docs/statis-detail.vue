<style>
.bg-s0 {
  background: #75a6e7;
}
.bg-s1 {
  background: #84d199;
}
.bg-s2 {
  background: #be80e0;
}
</style>

<template>
  <div class="wrap-1">
    <div class="con-3">
      <v-breadcrumbs :items="navItems" class="pl-0 pt-0"></v-breadcrumbs>

      <v-card class="pd-20" outlined>
        <div>
          <v-row class="mb-6">
            <v-col cols="12" md="4" v-for="(row, i) in cardList" :key="i">
              <div class="pd-20 bdrs-5 white-0" :class="'bg-s' + i">
                <div class="d-flex al-c">
                  <span>{{ row.title }}</span>
                  <e-tooltip right max-width="300" v-if="row.tip">
                    <v-icon slot="ref" color="#fff" size="14" class="pa-1 d-ib"
                      >mdi-help-circle-outline</v-icon
                    >
                    <span>{{ row.tip }}</span>
                  </e-tooltip>
                </div>
                <div class="fz-14 mt-5">
                  <div>
                    <span class="op-7">{{ $t(`${locales}Today`) }}</span>
                    <span class="fl-r">{{ row.today }}</span>
                  </div>
                  <div class="mt-2">
                    <span class="op-7">{{ $t(`${locales}Yesterday`) }}</span>
                    <span class="fl-r">{{ row.yesterday }}</span>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>

          <v-row class="mb-6 ta-c">
            <v-col cols="4" v-for="(it, i) in summaryList" :key="i">
              <div class="el-label-1">{{ it.title }}</div>
              <div class="fz-25 mt-1">{{ it.value }}</div>
            </v-col>
          </v-row>

          <v-tabs
            v-model="tabIdx"
            background-color="transparent"
            color="primary"
          >
            <v-tab v-for="(it, i) in tabList" :key="i">
              {{ it.label }}
            </v-tab>
          </v-tabs>
          <div class="mt-10" style="min-height: 300px">
            <component
              :is="it.comp"
              :appId="appId"
              :active="i == tabIdx"
              :reloadAt="reloadAt"
              v-show="i == tabIdx"
              v-for="(it, i) in activeTabList"
              :key="i"
            ></component>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const { id, projName } = this.$route.params;
    return {
      locales: "dashboard.statistics.",
      appId: id,
      projName,
      info: null,
      loading: false,
      reloadAt: 0,
      tabList: [
        {
          label: "User Analysis",
          comp: "statis-analysis",
        },
        {
          label: "Request",
          comp: "statis-request",
        },
        {
          label: "Data Transfer",
          comp: "statis-data",
        },
      ],
      tabIdx: 0,
      activeIdxList: [0],
    };
  },
  computed: {
    summaryList() {
      if (!this.info) return [];
      return [
        {
          title: this.$tc(`dashboard.statistics.TotalUser`),
          value: this.info.totalUsers,
        },
        {
          title: "Total UV",
          value: this.info.totalUv || 0,
        },
        {
          title: "Total PV",
          value: this.info.totalPv || 0,
        },
      ];
    },
    cardList() {
      const info = this.info;
      if (!info) return [];
      return [
        {
          title: this.$t(`dashboard.statistics.NewUsers`),
          today: "+" + info.todayNewUser,
          yesterday: "+" + info.yesterdayNewUser,
        },
        {
          title: "Unique Visitor",
          today: info.todayUv,
          yesterday: info.yesterdayUv,
          tip: `A computer client that visits the site as a
                  Visitor. The same client is counted only once between 00:00
                  and 24:00 (UTC).`,
        },
        {
          title: "Page Views",
          today: info.todayPv,
          yesterday: info.yesterdayPv,
          tip: `Page views or clicks are counted once per user visit.`,
        },
      ];
    },
    activeTabList() {
      return this.tabList.filter((_, i) => {
        return this.activeIdxList.includes(i);
      });
    },
    navItems() {
      const { id, projName } = this.$route.params;
      return [
        {
          text: "Statistics",
          to: "/dashboard/statistics",
        },
        {
          text: projName,
          to: `/statistics/${projName}/${id}`,
        },
      ];
    },
  },
  watch: {
    tabIdx(tab) {
      if (!this.activeIdxList.includes(tab)) {
        this.activeIdxList.push(tab);
      }
    },
    appId() {
      this.getData();
    },
    "$route.query.appId"(val) {
      if (val) {
        this.appId = val;
      }
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      try {
        this.loading = true;
        const { data } = await this.$http.get(
          "/analytics/user/data/project/" + this.appId
        );
        this.info = data;
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
      this.reloadAt = Date.now();
    },
  },
};
</script>