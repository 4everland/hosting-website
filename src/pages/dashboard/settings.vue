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
      menus: [
        {
          text: "General",
          comp: "ds-general",
        },
        // {
        //   text: "Tokens",
        //   comp: "ds-token",
        // },
      ],
    };
  },
  computed: {},
};
</script>