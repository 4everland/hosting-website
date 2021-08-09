<template>
  <div class="wrap-1">
    <div class="con-1">
      <div class="ta-c pt-5">
        <h1 class="mt-10">{{ $t(`${locales}LoginToHosting`) }}</h1>
        <div class="mt-8">
          <v-btn color="#24292e" large :loading="inLogin" @click="onLogin">
            <v-icon color="white">mdi-github</v-icon>
            <span class="white-0 ml-1">{{
              $t(`${locales}ContinuewithGithub`)
            }}</span>
          </v-btn>
        </div>
      </div>
      <!-- <v-btn to="/dashboard/projects">dashbaord</v-btn>
    <v-btn to="/project/overview" class="ml-5">project</v-btn> -->
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      locales: "home.",
      inLogin: false,
    };
  },
  computed: {
    ...mapState({
      isTouch: (s) => s.isTouch,
      isFocus: (s) => s.isFocus,
      token: (s) => s.token,
      noticeMsg: (s) => s.noticeMsg,
    }),
  },
  watch: {
    isFocus(val) {
      if (val && this.isOpen) {
        this.isOpen = false;
        console.log("on focus");
        this.onInit();
      }
    },
    noticeMsg({ name }) {
      if (name == "login") {
        this.onLogin();
      }
    },
  },
  mounted() {
    this.onInit();
    if (/installation_id/.test(location.href) && !this.isTouch) {
      window.close();
    }
  },
  methods: {
    async onInit() {
      const { token, is_new } = this.$route.query;
      if (token) {
        localStorage.token = token;
        localStorage.refreshAt = Date.now();
        if (!this.isTouch) {
          // window.close();
          location.href = "index.html";
          return;
        }
      }
      if (localStorage.token) {
        if (this.token != localStorage.token) {
          const data = {
            token: localStorage.token,
          };
          // if (is_new) {}
          console.log(is_new);
          this.$setState(data);
        }
        this.$router.replace("/dashboard/projects");
      }
    },
    async onLogin() {
      try {
        this.$loading();
        const { data } = await this.$http.get("/githubapp/url");
        // console.log(data)
        this.isOpen = true;
        // this.$openWindow(data.url);
        location.href = data.url;
      } catch (error) {
        console.log(error);
        this.$loading.close();
      }
    },
  },
};
</script>
