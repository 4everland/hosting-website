<template>
  <div class="pos-r">
    <div class="pos-a top-0 z-1 w100p d-flex al-c">
      <v-chip color="primary" small>{{ title }}</v-chip>
    </div>
    <div class="pos-r">
      <div class="d-flex pt-6">
        <div ref="chart" style="height: 260px" class="flex-1 pa-2"></div>
        <div style="width: 40%">
          <ul class="mt-3">
            <li
              class="fz-14 d-flex al-c mb-2"
              v-for="(it, i) in items"
              :key="i"
            >
              <span class="line-1 gray-6 mr-3">{{ it.name }}</span>
              <b class="ml-auto">{{ it.value }}</b>
            </li>
          </ul>
          <v-btn
            v-if="hasMore"
            @click="showAll = true"
            color="primary"
            text
            small
            class="ml-3"
            >View All</v-btn
          >
        </div>
      </div>
      <div class="pos-center z-10" v-if="loading && !showAll">
        <v-progress-circular
          :size="40"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>
    </div>

    <v-dialog v-model="showAll" max-width="500">
      <div class="pd-30">
        <h3>{{ title }}</h3>
        <ul class="mt-3">
          <li class="fz-14 d-flex al-c mb-2" v-for="(it, i) in list" :key="i">
            <span class="line-1 gray-6 mr-3">{{ it.name }}</span>
            <b class="ml-auto">{{ it.value }}</b>
          </li>
        </ul>
        <div class="pa-3 ta-c" v-if="loading && showAll">
          <v-progress-circular
            :size="40"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </div>
        <div class="mt-6" v-if="pageLen > 1">
          <v-pagination
            @input="onPage"
            v-model="page"
            :length="pageLen"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
            :total-visible="7"
          ></v-pagination>
        </div>
      </div>
    </v-dialog>
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
      items: [],
      list: [],
      loading: false,
      page: 1,
      pageLen: 1,
      hasMore: false,
      showAll: false,
    };
  },
  watch: {
    reloadAt(val) {
      if (val) this.getData();
    },
    showAll(val) {
      if (val) {
        this.page = 1;
        this.pageLen = 1;
        this.onPage();
      } else {
        this.loading = false;
      }
    },
  },
  mounted() {
    if (!this.lazy) {
      this.getData();
    }
  },
  methods: {
    onPage() {
      this.getList(this.page, 10);
    },
    async getList(page = 1, size = 5) {
      const params = {
        projectId: this.appId,
        sourceType: this.type,
        page: page - 1,
        size,
      };
      try {
        this.loading = true;
        const { data } = await this.$http.get("/request/source/list", {
          params,
        });
        this.list = data.content.map((it) => {
          return {
            name: it.sourceName.replace("https://", ""),
            value: it.sourceNum,
          };
        });
        if (size == 5) {
          this.hasMore = data.totalPages > 1;
        } else {
          this.pageLen = data.totalPages;
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    async getData() {
      await this.getList();
      this.items = [...this.list];
      this.$nextTick(() => {
        this.setData(this.items);
      });
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
        // legend: {
        //   orient: "vertical",
        //   left: "right",
        //   formatter(name) {
        //     return name.cutStr(5, 3);
        //   },
        // },
        series: [
          {
            name: this.title,
            type: "pie",
            radius: ["40%", "60%"],
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