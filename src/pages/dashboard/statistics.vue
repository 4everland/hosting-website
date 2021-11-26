
<template>
  <v-card outlined>
    <div class="pd-20">
      <div class="mb-6">
        <h3>Statistics</h3>
        <div class="gray mt-1 fz-14">Do statistics for your project</div>
      </div>
      <v-data-table :loading="loading" :headers="headers" :items="list">
        <template v-slot:item.projectName="{ item }">
          <v-chip
            color="primary"
            small
            :to="`/statistics/${item.projectName}/${item.projectId}`"
          >
            {{ item.projectName }}
          </v-chip>
        </template>
      </v-data-table>
    </div>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      headers: [
        { text: "Project", value: "projectName" },
        { text: "New Users", value: "newUsers" },
        { text: "Total Users", value: "totalUsers" },
        { text: "Total UV", value: "totalUv" },
        { text: "Total PV", value: "queryCount" },
      ],
      list: [],
    };
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  watch: {
    asMobile() {
      location.reload();
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        let { data } = await this.$http.get(
          "/analytics/user/project/page/list"
        );
        this.list = data.content;
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
  },
};
</script>