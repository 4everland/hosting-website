<style lang="scss">
.billing2 {
  .circular-0 {
    .v-progress-circular__underlay {
      stroke: #d8ecf7;
    }
  }
  .circular-1 {
    .v-progress-circular__underlay {
      stroke: #93dbb5;
    }
  }
  .circular-2 {
    .v-progress-circular__underlay {
      stroke: #e0c6e9;
    }
  }
}
</style>

<template>
  <div class="billing2">
    <v-card outlined>
      <div class="pd-20">
        <h3>Usage</h3>
      </div>
      <div class="bdt-1 pd-20 ta-c">
        <v-skeleton-loader type="article" v-if="loadingInfo" />
        <v-row v-else>
          <v-col v-for="(it, i) in usageList" :key="i">
            <h4 class="mb-3">{{ it.title }}</h4>
            <v-progress-circular
              :class="'circular-' + i"
              :rotate="-90"
              :size="110"
              :width="12"
              :value="it.value"
              :color="it.color"
            >
              <b class="fz-25">{{ it.used }}</b>
              <sub class="gray ml-1">{{ it.unit }}</sub>
            </v-progress-circular>
            <div class="mt-3">{{ it.total }} {{ it.unit }}</div>
          </v-col>
        </v-row>
      </div>
      <div class="bdt-1 pd-15-20 d-flex al-c" v-if="info.plan">
        <div class="mr-auto">
          <p>
            <span class="label-1">Plan:</span>
            <b class="ml-2">{{ info.plan }}</b>
          </p>
          <p class="gray fz-14" v-if="info.startTime">
            Current billing period starts from
            {{ new Date(info.startTime).format("date") }} to
            {{ new Date(info.endTime).format("date") }}.
          </p>
        </div>
        <v-btn color="primary" small to="/pricing">Change Plan</v-btn>
      </div>
    </v-card>

    <v-card outlined class="mt-5">
      <div class="pd-20">
        <h3>Activity History</h3>

        <v-data-table
          class="elevation-1 mt-4"
          :loading="loadingList"
          :headers="headers"
          :items="list"
          hide-default-footer
        >
          <template v-slot:item.txHash="{ item }">
            <v-chip
              small
              :href="`https://goerli.etherscan.io/tx/${item.txHash}`"
              target="_blank"
            >
              {{ item.txHash.cutStr(5, 5) }}
            </v-chip>
          </template>
        </v-data-table>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: 10,
      info: {},
      loadingInfo: false,
      loadingList: false,
      headers: [
        { text: "Pay", value: "pay" },
        { text: "Hash", value: "txHash" },
        { text: "createAt", value: "createAt" },
        { text: "status", value: "status" },
      ],
      list: [],
    };
  },
  computed: {
    usageList() {
      const info = this.info;
      return [
        {
          title: "Bandwidth",
          total: info.totalBandwidth,
          used: info.usedBandwidth,
          value: parseInt((info.usedBandwidth * 100) / info.totalBandwidth),
          unit: "GB",
          color: "primary",
        },
        {
          title: "Storage",
          total: info.totalStorage,
          used: info.usedStorage,
          value: parseInt((info.usedStorage * 100) / info.totalStorage),
          unit: "GB",
          color: "success",
        },
        {
          title: "Build Minutes",
          total: info.totalBuildMinutes,
          used: info.usedBuildMinutes,
          value: parseInt(
            (info.usedBuildMinutes * 100) / info.totalBuildMinutes
          ),
          unit: "Min",
          color: "#BA79D2",
        },
      ];
    },
  },
  created() {
    this.getData();
  },
  methods: {
    async getList() {
      try {
        this.loadingList = true;
        let { data } = await this.$http.get("/payment/activity/history");
        this.list = data;
      } catch (error) {
        console.log(error);
      }
      this.loadingList = false;
    },
    async getData() {
      try {
        this.loadingInfo = true;
        const { data } = await this.$http.get("/consumption/info");
        this.info = data;
        this.loadingInfo = false;
        console.log(data);
      } catch (error) {
        console.log(error);
      }
      this.getList();
    },
  },
};
</script>