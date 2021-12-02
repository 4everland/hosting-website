<style lang="scss">
.pricing {
  color: #495667;
  .gray {
    color: #7f8489;
  }
  .head-bg {
    height: 280px;
    background: linear-gradient(137deg, #ffffff 0%, #f1f6fb 60%);
    border-radius: 0px 0px 900px 0px;
  }
  &.m h1 {
    font-size: 30px;
  }
  .bg-th1 {
    background: #f1f6fb;
  }
  .bd-1 {
    border: 1px solid #c6d1d7;
  }
  .bdt-1 {
    border-top: 1px solid #c6d1d7;
  }
  h2 {
    margin: 50px 0 10px;
    padding: 20px;
    line-height: 1;
  }
  .plan-table {
    table {
      border-spacing: 0;
    }
    td {
      border-bottom: 1px solid #c6d1d7;
      padding: 10px;
    }
    tbody tr:last-of-type td {
      border-bottom: none;
    }
  }
  .plan-item {
    ul {
      min-height: 270px;
    }
    &.clickable {
      cursor: pointer;
      &:hover {
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
      }
    }
    &.free {
      background: #f1f6fb;
    }
    &.active {
      background: #4a96fa;
      color: #fff;
      cursor: default;
      a {
        color: #fff;
      }
    }
  }
}
</style>

<template>
  <div class="bg-white pb-3">
    <div class="head-bg pos-r">
      <div class="wrap-1">
        <div class="con-3">
          <h1 class="fz-50">
            <span style="color: #7175ff">Simple, </span>Flexible Pricing
          </h1>
          <div class="gray mt-3">
            A better experience for developers creates <br />
            a better experience for users.
          </div>
          <v-img
            src="img/bg/pricing-1.svg"
            :width="asMobile ? 180 : 280"
            class="pos-a btm-0"
            style="right: 12%"
          ></v-img>
        </div>
      </div>
    </div>

    <div class="wrap-1">
      <div class="con-3">
        <v-row>
          <v-col
            cols="6"
            md="3"
            v-for="(it, i) in planList"
            :key="i"
            @click="onPlan(it, i)"
          >
            <div
              class="plan-item trans-200 bd-1 bdrs-10"
              :class="{
                active: i == value,
                free: getDisabled(i),
                clickable: !getDisabled(i) && i < planList.length - 1,
              }"
            >
              <div class="pa-3">
                <div class="d-flex al-c">
                  <b class="fz-18 mr-auto">{{ it.title }}</b>
                  <e-pricing-cell
                    v-if="i > 0 && !it.isCustom"
                    class="fz-12"
                    :value="it.price"
                  ></e-pricing-cell>
                </div>
                <div class="mt-2 op-5 fz-12 lh-12">
                  {{ it.desc }}
                </div>
              </div>
              <div class="pa-4 bdt-1">
                <ul class="ls-none">
                  <li class="mb-2" v-for="(txt, j) in getPlanList(i)" :key="j">
                    <v-icon
                      size="14"
                      class="mr-2"
                      :color="i == value ? '#fff' : ''"
                      >mdi-check-circle</v-icon
                    >
                    <span class="fz-13">{{ txt }}</span>
                  </li>
                </ul>
                <a
                  class="fw-b"
                  :target="it.isCustom ? '_blank' : ''"
                  :href="
                    it.isCustom
                      ? 'https://forms.gle/xyadYsQQVzXJbhDv5'
                      : '#pricing'
                  "
                >
                  {{ it.isCustom ? "Contact Sales" : "See all features" }} >>
                </a>
              </div>
            </div>
          </v-col>
        </v-row>

        <div class="ta-c">
          <h2>With Crypto Support</h2>
          <div class="gray lh-1">DAI、USDC、USDT are accepted by 4EVERLAND</div>
          <div style="max-width: 500px" class="m-auto">
            <v-row class="mt-6">
              <v-col v-for="(it, i) in coins" :key="i">
                <img :src="`img/icon/c-${it.toLowerCase()}.svg`" height="80" />
                <div class="fw-b mt-3">{{ it }}</div>
              </v-col>
            </v-row>
          </div>
        </div>

        <h2 class="ta-c" id="pricing">Plan Details</h2>
        <div class="ta-c plan-table bd-1 bdrs-10 ov-a">
          <table class="w100p nowrap">
            <thead class="bg-th1">
              <tr>
                <td>
                  <b>Full Feature List</b>
                </td>
                <td v-for="(it, i) in planList" :key="i">
                  <h3>{{ it.title }}</h3>
                  <e-pricing-cell
                    class="fz-12"
                    :value="it.price"
                  ></e-pricing-cell>
                </td>
              </tr>
            </thead>
            <tbody class="fz-13">
              <!-- <tr>
                  <td colspan="5" class="ta-l">
                    <b>Full Feature List</b>
                  </td>
                </tr> -->
              <tr v-for="(row, i) in planHeaders" :key="i">
                <td class="ta-l">
                  <e-pricing-cell :value="row.text"></e-pricing-cell>
                </td>
                <td v-for="(it, j) in planList" :key="j">
                  <e-pricing-cell :value="it[row.value]"></e-pricing-cell>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: Number,
    isBusiness: Boolean,
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  data() {
    return {
      coins: ["DAI", "USDC", "USDT"],
      planHeaders: [
        {
          text: "Bandwidth",
          value: "band",
        },
        {
          text: "Storage",
          value: "stor",
        },
        {
          text: "Build Minutes",
          value: "build",
        },
        {
          text: "Global Edge Network",
          value: "global",
        },
        {
          text: "DDos Mitigation",
          value: "ddos",
        },
        {
          text: "Free SSL",
          value: "ssl",
        },
        {
          text: "IPFS",
          value: "ipfs",
        },
        {
          text: "Statistics",
          value: "statis",
        },
        {
          text: "Community Support",
          value: "community",
        },
        {
          text: "Email Support",
          value: "email",
        },
        {
          text: "Premium Support",
          value: "premium",
        },
      ],
      planList: [
        {
          title: "Free",
          price: "0 USD/mo",
          desc: "For both non-commercial and personal projects",
          band: "100 GB",
          stor: "4 GB",
          build: "250 included/month",
          global: true,
          ddos: false,
          ssl: true,
          ipfs: true,
          statis: true,
          community: true,
          email: false,
          premium: false,
        },
        {
          title: "Pro",
          price: "40 USD/mo",
          desc: "For 4everland hosting  projects that are growing",
          band: "300 GB",
          stor: "40 GB",
          build: "500 included/month",
          global: true,
          ddos: true,
          ssl: true,
          ipfs: true,
          statis: true,
          community: true,
          email: true,
          premium: false,
        },
        {
          title: "Business",
          price: "199 USD/mo",
          desc: "For large teams dependent on 4everland hosting",
          band: "1 TB",
          stor: "100 GB",
          build: "2000 included/month",
          global: true,
          ddos: true,
          ssl: true,
          ipfs: true,
          statis: true,
          community: true,
          email: true,
          premium: false,
        },
        {
          title: "Custom",
          isCustom: true,
          price: "Custom Pricing",
          desc: "All the Performance plan features plus",
          band: "Custom",
          stor: "Custom",
          build: "Custom",
          global: true,
          ddos: true,
          ssl: true,
          ipfs: true,
          statis: true,
          community: true,
          email: true,
          premium: true,
        },
      ],
    };
  },
  methods: {
    getDisabled(i) {
      return i == 0 || (i == 1 && this.isBusiness);
    },
    onPlan(it, i) {
      if (!this.getDisabled(i) && !it.isCustom) {
        this.$emit("input", i);
      }
    },
    getPlanList(i) {
      const obj = this.planList[i];
      const res = [];
      for (const row of this.planHeaders) {
        let { text } = row;
        const val = obj[row.value];
        if (val === false) continue;
        if (obj.title == "Custom" && val === true && row.value != "premium")
          continue;
        if (["statis", "community"].includes(row.value)) continue;
        if (typeof val == "string") {
          text =
            val.replace("included/month", "").replace(" ", "") + " " + text;
        }
        res.push(text);
      }
      return res;
    },
  },
};
</script>
