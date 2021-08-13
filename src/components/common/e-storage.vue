<template>
  <div>
    <v-dialog v-model="showPop" max-width="800">
      <div class="pos-r">
        <h2 class="ta-c pd-15 fz-18">
          {{ steps[curStep].title }}
        </h2>
        <div
          class="pos-a top-0 right-0 pd-15 z-100 hover-1"
          @click="showPop = false"
        >
          <v-icon>mdi-close</v-icon>
        </div>
      </div>
      <div class="pd-10-20">
        <v-window v-model="curStep">
          <v-window-item :value="i" v-for="(it, i) in steps" :key="i">
            <div
              :ref="'con' + i"
              style="max-height: 50vh"
              class="ov-a bd-1 pd-20 fz-14"
            >
              <div v-html="getHtml(it.con)"></div>
            </div>
          </v-window-item>
        </v-window>
        <div class="mt-1 ml-2">
          <v-tooltip v-model="showTip" top>
            <template v-slot:activator="{ on, attrs }">
              <v-checkbox
                v-bind="attrs"
                v-on="on"
                v-model="isAgree"
                :label="$t('common.ReadAndAgree')"
              ></v-checkbox>
            </template>
            <span>Please check the box and click confirm</span>
          </v-tooltip>
        </div>
        <div class="mt-2 ta-c pd-15">
          <v-btn
            color="primary"
            :disabled="downSec > 0"
            :loading="loading"
            @click="onConfirm"
          >
            <span v-html="btnTxt"></span>
          </v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showPop: false,
      isAgree: false,
      curStep: 0,
      steps: [
        {
          title: this.$t("common.TermOfService"),
          con: this.$t("common.TermTxt"),
        },
        {
          title: this.$t("common.PrivacyPolicy"),
          con: this.$t("common.PrivacyTxt"),
        },
      ],
      loading: false,
      downSec: 0,
      showTip: false,
    };
  },
  computed: {
    noticeMsg() {
      return this.$store.state.noticeMsg;
    },
    userInfo() {
      return this.$store.state.userInfo;
    },
    btnTxt() {
      if (this.downSec > 0) {
        return `Confirm after <b class="red-1">${this.downSec}</b> seconds`;
      }
      return "Confirm";
    },
  },
  watch: {
    isAgree(val) {
      if (val) this.showTip = false;
    },
    showPop(val) {
      if (val) this.downSec = 5;
      else {
        this.curStep = 0;
        this.downSec = 0;
      }
    },
    downSec(val, oldVal) {
      if (val > oldVal) {
        clearInterval(this.timing);
        this.timing = setInterval(() => {
          if (this.downSec > 0) this.downSec -= 1;
          else clearInterval(this.timing);
        }, 1e3);
      }
    },
    // noticeMsg({ name }) {
    //   if (name == "onInit") {
    //     this.checkStorage();
    //   }
    // },
  },
  methods: {
    onConfirm() {
      if (!this.isAgree) {
        this.showTip = true;
        return;
      }
      if (this.curStep == 0) {
        this.curStep = 1;
        this.downSec = 5;
        this.isAgree = false;
        const el = this.$refs.con1;
        if (el) el.scrollTo(0, 0);
      } else {
        this.addStorage();
      }
    },
    getHtml(con) {
      return con
        .split(/\n/)
        .map((txt) => {
          return `<p class="mt-2">${txt}</p>`;
        })
        .join("");
    },
    async addStorage() {
      try {
        this.loading = true;
        await this.$http.post("/bill/pay", {
          storage: 40,
          amount: 50,
          pay: 0,
        });
        await this.$sleep();
        this.loading = false;
        this.showPop = false;
        let html =
          "In the ALPHA version, you can get a few free resources for depolyment .If you need more storage space, please contact us for feedback. ";
        html +=
          '<ul class="mt-4"><li>1. 40G storage for free</li><li>2. Network for free</li></ul>';
        html += '<div class="red-1 mt-5 fz-14">Expiry date: 12/31/2021</div>';
        this.$alert(html, "Welcome to 4EVERLAND HOSTING.", {
          type: "success",
        }).then(() => {
          this.$router.push("/new");
        });
      } catch (error) {
        //
      }
      this.loading = false;
    },
    async checkStorage() {
      console.log("check stoarge");
      // if (Date.now) return (this.showPop = true);
      const skey = "got_storage_" + localStorage.token.substr(-5);
      if (localStorage[skey]) {
        return;
      }
      try {
        this.$loading();
        const { data } = await this.$http.get("/bill/history");
        this.$loading.close();
        if (data.content.length) {
          localStorage[skey] = 1;
          return;
        }
        this.showPop = true;
        return true;
      } catch (error) {
        console.log(error);
      }
      return false;
    },
  },
};
</script>