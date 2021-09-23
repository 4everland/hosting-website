<style lang="scss">
.act-countdown {
  background: #1e2226;
  min-height: 100px;
  .act-gift1 {
    right: -20px;
    top: -130px;
    width: 300px;
  }
  .bg-pane {
    background: -webkit-linear-gradient(top, #353748, #20242c);
    padding: 20px 0;
    .unit {
      color: #8287ac;
    }
  }
}
</style>

<template>
  <div class="act-countdown pos-r bdrs-10 mb-8" v-if="timeList.length">
    <img
      src="img/bg/act-gift.png"
      class="pos-a act-gift1"
      :style="asMobile ? 'width: 240px;top:-100px;' : ''"
    />
    <v-row>
      <v-col md="6" cols="12">
        <div class="d-flex f-center al-c h100p">
          <h2 class="lh-1" style="font-size: 40px">EVENT ENDS IN</h2>
          <e-tooltip right max-width="300">
            <v-icon
              slot="ref"
              color="#ddd"
              size="20"
              class="pa-1 d-ib mt-1 ml-2"
              >mdi-help-circle-outline</v-icon
            >
            <span
              >The event ends randomized between October 7th and 14th UTC,
              please participate in advance.</span
            >
          </e-tooltip>
        </div>
      </v-col>
      <v-col md="6" cols="12">
        <v-row>
          <v-col cols="3" v-for="(it, i) in timeList" :key="i">
            <div class="bg-pane ta-c bdrs-10 lh-1">
              <h2 class="fz-35 mb-2">{{ it.val }}</h2>
              <div class="unit fz-17">{{ it.unit }}</div>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    timeList() {
      const msec = 1634169600000 - this.$store.state.nowDate;
      if (msec < 0) {
        return [];
      }
      const sec = (msec / 1000) | 0;
      const days = (sec / 86400) | 0;
      const hours = ((sec % 86400) / 3600) | 0;
      const mins = ((sec % 3600) / 60) | 0;
      const seconds = sec % 60;
      const list = [
        {
          val: days,
          unit: "DAYS",
        },
        {
          val: hours,
          unit: "HOURS",
        },
        {
          val: mins,
          unit: "MINUTES",
        },
        {
          val: seconds,
          unit: "SECONDS",
        },
      ];
      for (const it of list) {
        if (it.val < 10) it.val = "0" + it.val;
      }
      return list;
    },
  },
};
</script>