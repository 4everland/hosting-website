<template>
  <div v-if="!info">
    <v-skeleton-loader type="article" />
  </div>
  <div v-else>
    <div class="mt-6 ta-c" v-if="!info.total">
      <img src="img/empty/bill.svg" style="height: 180px" />
      <div class="mt-3 gray">{{ $t(`${locales}NoResource`) }}</div>

      <div class="pd-20 bd-1 mt-5">
        <e-choose
          :title="$t(`${locales}Storage`)"
          btn-txt="40GB"
          class="mb-5"
        ></e-choose>
        <e-choose
          :title="$t(`${locales}Network`)"
          :btn-txt="$t(`${locales}Free`)"
        ></e-choose>
        <v-divider class="mt-5 mb-5"></v-divider>
        <div class="d-flex">
          <b class="ml-auto mr-3">{{ $t(`${locales}TotalCoast`) }}</b>
          <div class="ta-r mr-8">
            <div class="red-1 fw-b">0 USDT</div>
            <p class="gray fz-12">
              <del>50 USDT</del>
            </p>
          </div>
          <v-btn color="error" width="90" @click="onPay" :loading="paying">
            {{ $t(`${locales}PAY`) }}
          </v-btn>
        </div>
      </div>
    </div>
    <div class="pd-20 bd-1" v-else>
      <div class="d-flex al-c">
        <h3>{{ $t(`${locales}Storage`) }}</h3>
      </div>
      <div class="mt-6">
        <div class="d-flex al-c fz-13">
          <!-- <span class="gray mr-2"></span> -->
          <v-progress-linear :value="restPerc"></v-progress-linear>
          <div class="gray ml-2 shrink-0">
            {{ info.used }}GB / {{ info.total }}GB
          </div>
        </div>
        <v-list>
          <template v-for="(it, i) in storList">
            <v-list-item :key="i">
              <v-list-item-content>
                <v-list-item-title v-text="it.label"></v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <div class="fz-14">
                  <span>{{ it.value }}</span>
                  <span class="gray ml-2">GB</span>
                </div>
              </v-list-item-action>
            </v-list-item>
            <v-divider :key="'d' + i"></v-divider>
          </template>
        </v-list>
      </div>

      <h3 class="mt-8">{{ $t(`${locales}Network`) }}</h3>
      <div class="mt-5">
        <v-chip color="success">{{ $t(`${locales}Free`) }}</v-chip>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    storList() {
      return ["total", "used", "left"].map((key) => {
        return {
          label: key == "left" ? "Rest" : key.capitalize(),
          value: this.info[key] || 0,
        };
      });
    },
    restPerc() {
      const { total, used } = this.info;
      if (!total) return 0;
      return (used / total) * 100;
    },
  },
  data() {
    return {
      locales: "dashboard.billing.",
      info: null,
      paying: false,
    };
  },

  mounted() {
    this.getInfo();
  },
  methods: {
    async getInfo() {
      try {
        const { data } = await this.$http.get("/bill/storagespace");
        for (const key in data) {
          if (key) data[key] = data[key].toFixed(2);
        }
        this.info = data;
      } catch (error) {
        console.log(error);
      }
    },
    async onPay() {
      try {
        this.paying = true;
        await this.$http.post("/bill/pay", {
          storage: 40,
          amount: 50,
          pay: 0,
        });
        await this.getInfo();
        this.$confirm(
          this.$t(`dashboard.billing.OnPayMessage`),
          this.$t(`common.Congratulations`),
          {
            type: "success",
            confirmText: this.$t(`dashboard.billing.DeployNow`),
            cancelText: this.$t(`dashboard.billing.Later`),
          }
        )
          .then(() => {
            location.href = "index.html";
          })
          .catch(() => {
            this.$router.replace("/dashboard/billing?tab=1");
          });
      } catch (error) {
        console.log(error);
      }
      this.paying = false;
    },
  },
};
</script>
