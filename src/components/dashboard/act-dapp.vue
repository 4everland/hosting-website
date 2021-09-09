<template>
  <div>
    <div class="mt-10 d-flex al-c">
      <h3 class="pd-20 pr-2">My Dapps</h3>
      <v-btn plain color="white" small :loading="loading" @click="getList">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </div>
    <div class="ov-a bdrs-10 bd-1b ov-h">
      <table class="w100p ta-c" style="min-width: 560px">
        <thead>
          <tr>
            <td>#</td>
            <td>DApp</td>
            <td>Domains</td>
            <td>Total Users</td>
            <td>Percentage</td>
            <td>Created</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(it, i) in list" :key="it.projectId">
            <td>{{ 1 + i }}</td>
            <td>{{ it.projectName }}</td>
            <td class="ta-l">
              <a class="u" :href="it.domain">{{ it.domain }}</a>
            </td>
            <td>{{ it.totalUsers }}</td>
            <td>{{ it.percentage }}%</td>
            <td>{{ new Date(it.createAt * 1000).format() }}</td>
          </tr>
        </tbody>
      </table>
      <div class="pt-15 pb-15 ta-c" v-if="!list.length">
        <span class="fz-14 op-9">No Statistics</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      loading: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.loading = true;
      try {
        await this.$sleep(300);
        const { data } = await this.$http.get("/project/bigbang/projects");
        console.log(data);
        this.list = data;
      } catch (error) {
        //
      }
      this.loading = false;
    },
  },
};
</script>