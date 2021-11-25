<template>
  <div>
    <statis-chart
      :reload="isReload"
      :appId="appId"
      title="Total requests"
      type="PAGE_VIEW"
    ></statis-chart>
  </div>
</template>

<script>
export default {
  props: {
    appId: String,
    isReload: Boolean,
  },
  data() {
    return {};
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