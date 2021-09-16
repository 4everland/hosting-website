<template>
  <div>
    <v-dialog v-model="popInvite" max-width="450" v-if="code">
      <div class="pd-20">
        <div>
          <span>{{ sharePre }}</span>
          <a :href="shareUrl" target="_blank">{{ shareUrl }}</a>
          <!-- <v-icon
            size="14"
            class="pa-1 hover-1 ml-2"
            >mdi-content-copy</v-icon
          > -->
        </div>
        <!-- <div class="pos-r mt-3" ref="imgWrap">
          <img src="img/bg/act-invite.png" style="width: 240px" class="bd-1" />
        </div> -->

        <div class="mt-10 ta-c" v-if="copyTxt">
          <v-btn color="primary" @click="onCopy">Copy</v-btn>
        </div>
      </div>
    </v-dialog>
    <div class="mt-10 d-flex al-c">
      <h3 class="pd-20 pr-2">My Invites</h3>
      <!-- <v-btn plain small color="white" :loading="loading" @click="getList">
        <v-icon>mdi-refresh</v-icon>
      </v-btn> -->
    </div>
    <div class="ov-a bdrs-10 bd-1b ov-h">
      <table class="w100p ta-c" style="min-width: 260px">
        <thead>
          <tr>
            <td>#</td>
            <td>E-mail</td>
            <td>CreatedAt</td>
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
        <div class="op-5 fz-14 mt-8">No developer is invited</div>
        <v-btn
          v-if="actStatus == 1"
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
import { mapState } from "vuex";
import * as clipboard from "clipboard-polyfill/text";
// import html2canvas from "html2canvas";

export default {
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      actStatus: (s) => s.actStatus,
    }),
    shareUrl() {
      return location.origin + "/#/?invite=" + this.code;
    },
  },
  data() {
    return {
      code: null,
      list: [],
      loading: false,
      popInvite: false,
      sharePre:
        "I am participating in 4EVERLAND  First Landing event. Deploying projects to win your share of 50 million 4EVER, come and join here: ",
      copyTxt: "",
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
    code() {
      this.copyTxt = this.sharePre + this.shareUrl;
    },
  },
  methods: {
    async onCopy() {
      try {
        await clipboard.writeText(this.copyTxt);
        this.$toast("Copied to clipboard !");
        this.popInvite = false;
      } catch (error) {
        this.$toast("Copied fail");
      }
    },
    onCopied() {
      this.$toast("Copied to clipboard !");
      this.popInvite = false;
    },
    async onSaveImg() {
      // window.open("img/bg/act-invite.png");
      try {
        const canvas = ""; //await html2canvas(this.$refs.imgWrap);
        console.log(canvas);
        // this.$refs.imgWrap.appendChild(canvas);
        const uri = canvas.toDataURL();
        window.open(uri);
      } catch (error) {
        this.$toast("fail to generate share image");
      }
    },
    async onInvite() {
      if (!this.code) return;
      this.popInvite = true;
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
        const { data } = await this.$http.get("/activity/invites?size=300");
        // console.log(data);
        this.list = data.page || [];
      } catch (error) {
        //
      }
      this.loading = false;
    },
  },
};
</script>