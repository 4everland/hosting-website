<template>
  <v-app>
    <e-header></e-header>
    <v-main style="min-height: 70vh">
      <router-view></router-view>
    </v-main>

    <e-alert></e-alert>
    <e-feedback></e-feedback>

    <v-footer dark :color="$bg1">
      <e-footer></e-footer>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>
