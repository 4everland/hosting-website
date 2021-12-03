<template>
  <div>
    <v-select
      v-model="date"
      :items="dateList"
      item-text="text"
      item-value="value"
      single-line
      dense
      :menu-props="{
        offsetY: true,
      }"
    >
    </v-select>

    <v-dialog v-model="showPop" max-width="500">
      <v-date-picker v-model="dates" range></v-date-picker>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: null,
      showPop: false,
      dates: [],
    };
  },
  computed: {
    dateList() {
      return [
        {
          text: "24 H",
          value: "24h",
        },
        {
          text: "7 Day",
          value: "7d",
        },
        {
          text: "30 Day",
          value: "30d",
        },
        {
          text: "Custom Time",
          value: "custom",
        },
      ];
    },
  },
  watch: {
    date(val) {
      if (val == "custom") {
        this.showPop = true;
        this.date = null;
      }
    },
  },
};
</script>