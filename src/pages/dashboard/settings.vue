<template>
  <div>
    <v-card outlined>
      <e-card-head-1 title="Settings">
        <div>Personal Account Settings</div>
      </e-card-head-1>
      <e-side-menus :list="menus" :info="info"></e-side-menus>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {
        id: 1,
      },
    };
  },
  computed: {
    menus() {
      const arr = [
        {
          text: "General",
          comp: "ds-general",
        },
        {
          text: "Billing",
          comp: "ds-bill2",
        },
        {
          text: "Tokens",
          comp: "ds-token",
        },
      ];
      return arr;
    },
  },
};
</script>