<template>
  <div>
    <div class="mt-10 d-flex al-c">
      <h3 class="pd-20 pr-2">My Invites</h3>
      <v-btn plain color="white" small :loading="loading" @click="getList">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </div>
    <div class="ov-a bdrs-10 bd-1b ov-h">
      <table class="w100p ta-c" style="min-width: 260px">
        <thead>
          <tr>
            <td>#</td>
            <td>E-mail</td>
            <td>Created</td>
            <td>Deployed</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(it, i) in list" :key="i">
            <td>{{ 1 + i }}</td>
            <td>{{ it.email }}</td>
            <td>test</td>
            <td>test</td>
          </tr>
        </tbody>
      </table>
      <div class="pt-15 pb-15 ta-c" v-if="!list.length">
        <v-img
          src="img/empty/act-invite.png"
          height="60"
          width="60"
          class="d-ib"
        />
        <div class="op-5 fz-14 mt-8">No developer has been invited</div>
        <v-btn
          color="primary"
          rounded
          :loading="!inviteUrl"
          class="pl-6 pr-6 mt-5"
          v-clipboard="inviteUrl"
          @success="onCopied"
        >
          <v-icon size="18" class="mr-2">mdi-account-plus-outline</v-icon>
          <span>Invite Developers now</span>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inviteUrl: "",
      list: [],
      loading: false,
    };
  },
  created() {
    this.getInviteUrl();
    this.getList();
  },
  methods: {
    onCopied() {
      this.$toast("Invite Link copied.");
    },
    async getInviteUrl() {
      const { data } = await this.$http.get("/invite/code");
      this.inviteUrl = location.origin + "/#/?invite=" + data;
    },
    async getList() {
      try {
        this.loading = true;
        const { data } = await this.$http.get("/activity/invites");
        console.log(data);
        this.list = data.page || [];
      } catch (error) {
        //
      }
      this.loading = false;
    },
  },
};
</script>