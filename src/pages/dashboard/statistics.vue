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
  <v-card class="pd-20" outlined>
    <div v-if="!apps">
      <v-row>
        <v-col cols="12" :md="6" :lg="4" v-for="i in 3" :key="i">
          <v-skeleton-loader max-width="450" type="card"></v-skeleton-loader>
        </v-col>
      </v-row>
      <v-skeleton-loader class="mt-5" type="article" />
    </div>

    <div v-else-if="!apps.length" class="ta-c pd-20 mt-8 mb-8">
      <img src="img/empty/bill.svg" style="height: 200px" />
      <div class="gray mt-4">
        {{ $t(`${locales}NoAppDeployed`) }}
      </div>
    </div>

    <div v-else>
      <div class="mb-6 d-flex al-c">
        <v-btn
          :loading="loading"
          @click="getData"
          small
          class="ml-auto mr-1 mt-5"
          plain
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <!--  -->
        <v-select
          style="max-width: 300px"
          v-model="appId"
          :items="apps"
          item-text="projectName"
          item-value="projectId"
          label="All DApps"
          hide-details
          single-line
          :menu-props="{ offsetY: true }"
        ></v-select>
      </div>
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

      <v-tabs v-model="tabIdx" background-color="transparent" color="primary">
        <v-tab v-for="(it, i) in tabList" :key="i">
          {{ it.label }}
        </v-tab>
      </v-tabs>
      <div class="mt-10">
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
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    const { appId } = this.$route.query;
    return {
      locales: "dashboard.statistics.",
      appId,
      apps: null,
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
    ...mapState({
      isFocus: (s) => s.isFocus,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    inTab() {
      return this.$route.path == "/dashboard/statistics";
    },
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
  },
  watch: {
    asMobile() {
      location.reload();
    },
    tabIdx(tab) {
      if (!this.activeIdxList.includes(tab)) {
        this.activeIdxList.push(tab);
      }
    },
    inTab(val) {
      if (this.appId && val) this.getApps();
    },
    appId(val) {
      this.$router.replace({
        query: {
          appId: val,
        },
      });
      this.getData();
    },
    "$route.query.appId"(val) {
      if (val) {
        this.appId = val;
      }
    },
  },
  mounted() {
    this.getApps();
  },
  methods: {
    async getApps() {
      try {
        const { data } = await this.$http.get("/analytics/user/project/list");
        this.apps = data;
        if (data.length) {
          const unvalid =
            data.filter((it) => it.projectId == this.appId).length == 0;
          if (unvalid) {
            const arr = [...data].sort((a, b) => b.queryCount - a.queryCount);
            this.appId = arr[0].projectId;
            console.log("appid", this.appId);
          } else {
            this.getData();
          }
        }
      } catch (error) {
        //
      }
    },
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