<template>
  <div class="pos-r">
    <div class="pos-a top-0 w100p z-1">
      <h4>
        <a :href="domain" target="_blank">{{ info.name }}</a>
      </h4>
      <p class="gray fz-12">uid:{{ info.uid }}</p>
    </div>
    <div ref="chart" style="height: 200px"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: {
    info: Object,
    date: String,
  },
  computed: {
    domain() {
      return "https://" + [...this.info.Domains].pop();
    },
  },
  data() {
    return {};
  },
  watch: {
    date() {
      this.setData();
    },
  },
  mounted() {
    this.setData();
  },
  methods: {
    setData() {
      const list = this.info[this.date];
      if (!list) return console.log(this.date, list);
      const xArr = [];
      const yArr = [];
      for (const it of list) {
        const fmt = "HH:mm";
        const time = new Date(it.createAt * 1e3);
        xArr.push(time.format(fmt));
        yArr.push(it.newUserCount);
      }
      if (!this.chart) {
        const el = this.$refs.chart;
        // console.log(el, echarts)
        this.chart = echarts.init(el);
      }
      const option = {
        // title: {
        //   text: this.title,
        // },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xArr,
        },
        yAxis: {
          type: "value",
          minInterval: 1,
          splitLine: {
            show: false,
          },
        },
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            const { dataIndex: idx } = params[0];
            const obj = list[idx];
            const time = new Date(obj.createAt * 1e3);
            return `${time.format().replace(/:00$/, "")}<br><b>${
              obj.newUserCount
            }</b>`;
          },
        },
        series: [
          {
            data: yArr,
            type: "line",
            symbol: "none",
            areaStyle: {
              color: "rgba(52, 169, 255, 0.2)",
            },
            itemStyle: {
              color: "rgba(52, 169, 255, 0.2)",
            },
          },
        ],
      };
      this.chart.setOption(option);
    },
  },
};
</script>