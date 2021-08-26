import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { mapState } from "vuex";
import vuetify from "./plugins/vuetify";
import "./setup";
import locales from "./locales";
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  i18n: locales,
  render: (h) => h(App),
  computed: {
    ...mapState({
      token: (s) => s.token,
      noticeMsg: (s) => s.noticeMsg,
    }),
  },
  mounted() {
    this.onInit();
  },
  watch: {
    "$route.path"(val) {
      window.scrollTo(0, 0);
      if (!/^\/build\//.test(val)) {
        this.$setIcon();
        this.$setState({
          noticeMsg: { name: "setTitle" },
        });
      }
      this.$loading.close();
    },
    token(val) {
      if (val) {
        this.onInit();
      }
    },
    noticeMsg({ name }) {
      // console.log(name)
      if (name == "updateUser") {
        this.getUesrInfo();
      }
    },
  },
  methods: {
    async onInit() {
      const now = Date.now();
      if (this.token) {
        this.initSocket();
        await this.getUesrInfo();
        this.$setState({
          noticeMsg: {
            name: "onInit",
          },
        });
        try {
          if (now - localStorage.refreshAt > 2 * 3600e3) {
            await this.$http.get("/githubapp/refresh");
            localStorage.refreshAt = now;
          }
        } catch (error) {
          console.log(error.response);
        }
      }
    },
    initSocket() {
      const url = /xyz$/.test(process.env.VUE_APP_BASE_URL)
        ? "ws.foreverland.xyz"
        : "ws.4everland.org";
      this.socket = window.io(url, {
        path: "/socket.io",
        query: "token=" + this.token,
        withCredentials: false,
        transports: ["websocket", "polling"],
      });
      this.socket.on("error", (err) => {
        console.log("socket error", err, this.socket);
        this.isSocketOn = false;
        // this.initSocket() // socket.io auto reconnect
      });
      this.socket.on("connect", () => {
        console.log("socket connect");
        this.isSocketOn = true;
      });
      this.socket.on("PROJECT_BUILD", ({ name, data }) => {
        if (!name) return;
        if (name == "log") {
          // data.content = atob(data.content)
          data.state = "RUNNING";
        } else {
          data.state = name.replace("build_", "").toUpperCase();
        }
        this.$setState({
          buildInfo: {
            name,
            data,
          },
        });
        // console.log(name, data)
      });
    },
    async getUesrInfo() {
      const { data } = await this.$http.get("/user");
      localStorage.userInfo = JSON.stringify(data);
      this.$setState({
        userInfo: data,
      });
    },
  },
}).$mount("#app");
