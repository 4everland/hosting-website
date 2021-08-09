<template>
  <div class="d-flex al-c">
    <b style="min-width: 90px" class="mr-2">{{ title }}</b>
    <div class="d-flex al-c ml-">
      <v-btn color="primary">
        <!-- {{ it.text }} -->
        {{ btnTxt }}
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    btnTxt: String,
  },
};
</script>