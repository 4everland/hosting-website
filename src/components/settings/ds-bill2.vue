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
        <v-row>
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
      <div class="bdt-1 pd-15-20 d-flex al-c">
        <div class="mr-auto">
          <p>
            <span class="label-1">Plan:</span>
            <b class="ml-2">Free</b>
          </p>
          <p class="gray fz-14">Current billing period starts from xx to xx.</p>
        </div>
        <v-btn color="primary" small>Change Plan</v-btn>
      </div>
    </v-card>

    <v-card outlined class="mt-5">
      <div class="pd-20">
        <h3>Activity History</h3>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: 10,
    };
  },
  computed: {
    usageList() {
      return [
        {
          title: "Bandwidth",
          total: 100,
          used: 80,
          value: 80,
          unit: "GB",
          color: "primary",
        },
        {
          title: "Storage",
          total: 4,
          used: 2.9,
          value: 80,
          unit: "GB",
          color: "success",
        },
        {
          title: "Build Minutes",
          total: 250,
          used: 125,
          value: 50,
          unit: "Min",
          color: "#BA79D2",
        },
      ];
    },
  },
};
</script>