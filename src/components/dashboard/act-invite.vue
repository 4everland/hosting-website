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
        @click="onInvite"
        v-if="code && list.length > 0"
      >
        <v-icon>mdi-account-plus-outline</v-icon>
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
                v-if="it.domain"
                style="color: white"
                class="u"
                :href="it.domain"
                target="_blank"
                >{{ it.domain.replace("https://", "") }}</a
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
          :loading="!code"
          class="pl-6 pr-6 mt-5"
          @click="onInvite"
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
  },
  data() {
    return {
      code: null,
      list: [],
      loading: false,
      popInvite: false,
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
    async onInvite() {
      if (!this.code) return;
      const url = location.origin + "/#/?invite=" + this.code;
      const txt = `I am participating in 4EVERLAND the BIG BANG campaign. Successfully deploying projects to win your share of 50 million 4EVER, come and join here: `;
      await this.$alert(
        txt + `<a href="${url}" target="_blank">${url}</a>`,
        "Invite",
        {
          copyText: txt + url,
          hideConfirm: true,
          hideTitle: true,
        }
      );
      this.$toast("Copied to clipboard !");
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