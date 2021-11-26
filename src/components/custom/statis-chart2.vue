<template>
  <div class="pos-r">
    <div class="pos-a top-0 z-10 w100p d-flex al-c">
      <h4>{{ title }}</h4>
    </div>
    <div class="pos-r">
      <div ref="chart" style="height: 240px"></div>
      <div class="pos-center z-10" v-if="loading">
        <v-progress-circular
          :size="40"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: {
    title: String,
    type: String,
    appId: String,
    reloadAt: null,
    lazy: Boolean,
  },
  data() {
    return {
      list: [],
      loading: false,
    };
  },
  watch: {
    reloadAt(val) {
      if (val) this.getData();
    },
  },
  mounted() {
    if (!this.lazy) {
      this.getData();
    }
  },
  methods: {
    async getData() {
      try {
        this.loading = true;
        const { data } = await this.$http.get("/request/source/list", {
          params: {
            projectId: this.appId,
            sourceType: this.type,
          },
        });
        // const data = {
        //   content: [
        //     {
        //       sourceName: "test",
        //       sourceNum: 10,
        //     },
        //   ],
        // };
        const arr = data.content.map((it) => {
          return {
            name: it.sourceName,
            value: it.sourceNum,
          };
        });
        this.$nextTick(() => {
          this.setData(arr);
        });
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    setData(data) {
      const el = this.$refs.chart;
      if (!this.chart) {
        this.chart = echarts.init(el);
      }
      const option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "right",
        },
        series: [
          {
            name: this.title,
            type: "pie",
            radius: ["40%", "70%"],
            data, // [{name, value}]
            emphasis: {
              itemStyle: {
                shadowBlur: 0,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      this.chart.setOption(option);
    },
  },
};
</script>