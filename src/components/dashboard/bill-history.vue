<template>
  <div>
    <v-data-table
      class="elevation-1"
      :headers="headers"
      :items="list"
      hide-default-footer
    ></v-data-table>
  </div>
</template>

<script>
export default {
  props: {
    active: Boolean,
  },
  data() {
    return {
      headers: [
        // { text: this.$t(`dashboard.billing.N`), value: "seq" },
        // { text: 'Account', value: 'account' },
        { text: this.$t(`dashboard.billing.Storage`), value: "storage" },
        { text: this.$t(`dashboard.billing.Amount`), value: "amount" },
        // { text: 'Pay', value: 'pay' },
        { text: this.$t(`dashboard.billing.StartDate`), value: "date" },
        { text: this.$t(`dashboard.billing.ExpireDate`), value: "end" },
      ],
      list: [],
    };
  },
  watch: {
    active(val) {
      if (val) {
        this.getList();
      }
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        // this.$loading()
        const { data } = await this.$http.get("/bill/history");
        this.list = data.content.map((it, i) => {
          it.seq = i + 1;
          it.storage += "GB";
          it.amount = "0 USDT";
          it.date = new Date(it.date).format("yy-mm-dd");
          it.end = "2021-12-31";
          // it.pay += ' USDT'
          return it;
        });
      } catch (error) {
        console.log(error);
      }
      this.$loading.close();
    },
  },
};
</script>
