<template>
  <div>
    <div class="mt-10 d-flex al-c">
      <h3 class="pd-20 pr-2">My Invites</h3>
      <v-btn plain small color="white" :loading="loading" @click="getList">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
      <v-btn
        plain
        small
        color="white"
        v-clipboard="inviteUrl"
        @success="onCopied"
        v-if="inviteUrl && list.length > 0"
      >
        <v-icon>mdi-plus</v-icon>
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
        <tbody class="op-9">
          <tr v-for="(it, i) in list" :key="i">
            <td>{{ 1 + i }}</td>
            <td>{{ it.email }}</td>
            <td>{{ new Date(it.inviteAt).format() }}</td>
            <td>
              <a
                style="color: white"
                class="u"
                :href="'https://' + it.domain"
                >{{ it.domain }}</a
              >
            </td>
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
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    inviteUrl() {
      if (!this.code) return "";
      return location.origin + "/#/?invite=" + this.code;
    },
  },
  data() {
    return {
      code: null,
      list: [],
      loading: false,
    };
  },
  created() {
    this.getCode();
    this.getList();
  },
  watch: {
    userInfo() {
      this.getCode();
    },
  },
  methods: {
    onCopied() {
      this.$toast("Invite Link copied.");
    },
    async getCode() {
      this.code = this.userInfo.inviteCode;
      if (this.code) return;
      const { data } = await this.$http.get("/invite/code");
      this.code = data;
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