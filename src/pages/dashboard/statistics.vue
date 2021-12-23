
<template>
  <v-card outlined>
    <e-card-head-1 title="Statistics">
      <div>Statistics for your projects</div>
    </e-card-head-1>
    <div class="pa-6">
      <v-data-table
        class="elevation-1"
        :loading="loading"
        :headers="headers"
        :items="list"
        hide-default-footer
      >
        <template v-slot:item.projectName="{ item }">
          <v-btn
            text
            color="primary"
            :to="`/statistics/${item.projectName}/${item.projectId}`"
          >
            {{ item.projectName }}
          </v-btn>
        </template>
      </v-data-table>

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
      ].map((it) => {
        it.align = "center";
        return it;
      }),
      list: [],
      page: 1,
      pageLen: 1,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    onPage() {
      this.getList();
    },
    async getList() {
      try {
        this.loading = true;
        const params = {
          page: this.page - 1,
          size: 10,
        };
        let { data } = await this.$http.get(
          "/analytics/user/project/page/list",
          {
            params,
          }
        );
        this.list = data.content;
        this.pageLen = Math.max(1, Math.ceil(data.totalElements / params.size));
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
  },
};
</script>