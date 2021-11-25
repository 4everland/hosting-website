<template>
  <div>
    <statis-chart
      :reloadAt="reloadAt"
      :appId="appId"
      title="Total Data Transfer"
      type="DATA_TRANSFER"
    ></statis-chart>

    <!-- <div class="mt-10">
      <v-row>
        <v-col cols="12" md="6" v-for="(it, i) in reqList" :key="i">
          <statis-chart2
            :appId="appId"
            :title="it.title"
            :type="it.type"
            :reloadAt="reloadAt"
          ></statis-chart2>
        </v-col>
      </v-row>
    </div> -->
  </div>
</template>

<script>
export default {
  props: {
    appId: String,
    reloadAt: null,
  },
  data() {
    return {
      reqList: [
        {
          title: "Referers",
          type: "Referer",
        },
        {
          title: "Browsers",
          type: "Browsers",
        },
        {
          title: "Device",
          type: "Device",
        },
        {
          title: "Operating Systems",
          type: "OS",
        },
        {
          title: "Path",
          type: "Path",
        },
      ],
    };
  },
  watch: {
    appId() {
      this.getData();
    },
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      try {
        //
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>