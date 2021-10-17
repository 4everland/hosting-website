<template>
  <div class="pd-20 bd-1 bg-white" v-if="projList.length">
    <div class="ta-r mb-5 pos-s pd-5 z-10 bg-white" style="top: 49px">
      <v-select
        class="ml-auto"
        style="max-width: 300px"
        v-model="curDate"
        :items="dateOpts"
        item-text="text"
        item-value="text"
        label="Date"
        hide-details
        single-line
        :menu-props="{ offsetY: true }"
      ></v-select>
    </div>
    <div v-for="j in Math.ceil(projList.length / 10)" :key="j">
      <h3 _class="pos-s pd-5 z-10 bg-white" style="top: 49px">
        {{ j * 10 }}
      </h3>
      <v-row>
        <v-col
          cols="12"
          md="6"
          v-for="(it, i) in projList.slice((j - 1) * 10, j * 10)"
          :key="i"
        >
          <statis-chart-dev :info="it" :date="curDate"></statis-chart-dev>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dateOpts: [],
      projList: [],
      curDate: "9/28/21",
    };
  },
  mounted() {
    this.$loading();
    this.$http.get(location.origin + "/js/ok-projs.json").then(({ data }) => {
      this.$loading.close();
      data.sort((a, b) => {
        return b.TotalUv - a.TotalUv;
      });
      this.projList = data;
    });
    const dateOpts = [];
    let date = "2021-9-14".toDate();
    const end = "2021-10-14".toDate();
    while (date < end) {
      dateOpts.push({
        text: date.format("M/d/21"),
      });
      date = date.getNextDay();
      this.dateOpts = dateOpts;
    }
  },
};
</script>