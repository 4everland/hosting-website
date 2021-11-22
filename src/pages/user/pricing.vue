<style lang="scss">
.pricing {
  color: #495667;
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
  .bdt-1 {
    border-top: 1px solid #c6d1d7;
  }
  .plan-table {
    border: 1px solid #c6d1d7;
    table {
      border-spacing: 0;
    }
    td {
      border-bottom: 1px solid #c6d1d7;
      padding: 8px;
    }
    tbody tr:last-of-type td {
      border-bottom: none;
    }
  }
}
</style>

<template>
  <div class="pricing" :class="{ m: asMobile }">
    <div class="bg-white pb-4">
      <div class="head-bg pos-r">
        <div class="wrap-1">
          <div class="con-3">
            <h1 class="fz-40">
              <span style="color: #7175ff">Simple, </span>Flexible Pricing
            </h1>
            <div class="gray mt-3">
              A better experience for developers <br />
              creates a better experience for users.
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
            <v-col> </v-col>
          </v-row>

          <h2>Plan Details</h2>
          <div class="ta-c plan-table bdrs-10 mt-8 ov-a">
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

    <div class="bg-th1 bdt-1 wrap-1 pos-s btm-0"></div>
  </div>
</template>

<script>
export default {
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  data() {
    return {
      planHeaders: [
        {
          text: "Bandwith",
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
          text: "Statistic",
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
          price: "190 USD/mo",
          band: "1 TB",
          stor: "4100 GB",
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
          price: "Custom Pricing",
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
};
</script>