<template>
  <div>
    <v-card outlined>
      <e-side-menus :list="menus" :info="info"></e-side-menus>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {
        id: true,
      },
      menus: [
        {
          text: this.$t(`dashboard.billing.MyResource`),
          comp: "bill-resource",
        },
        {
          text: this.$t(`dashboard.billing.History`),
          comp: "bill-history",
        },
      ],
    };
  },
};
</script>
