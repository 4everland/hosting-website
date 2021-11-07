<style lang="scss">
.refer-header {
  background: #2b0c74 url(/img/bg/refer-1.jpeg) no-repeat;
  background-size: 100%;
  .wrap-1 {
    background: url(/img/bg/refer-2.png) no-repeat 90% center;
    background-size: contain;
  }
}
.page-refer {
  .link-wrap {
    max-width: 600px;
    margin: 50px auto 10px;
  }
}
</style>

<template>
  <div class="page-refer">
    <div class="refer-header">
      <div class="wrap-1">
        <div class="con-1">
          <div class="white-0 fw-b" :class="asMobile ? 'fz-30' : 'fz-35'">
            <p>Refer Friends.</p>
            <p>Enter Web3.0 Together.</p>
          </div>
          <div class="link-wrap d-flex al-c bg-white-9 bdrs-5">
            <span class="pd-10 gray fz-14 mr-auto line-1 shrink-1">
              https://hosting.4everland.org/#/?invite=xxxxxx
            </span>
            <v-btn plain color="primary" small>Copy</v-btn>
            <v-btn plain color="primary" small>Share</v-btn>
          </div>
        </div>
      </div>
    </div>

    <div class="wrap-1">
      <div class="con-1">
        <v-card outlined>
          <div class="pd-20 bdb-1">My Referrals</div>
          <div class="pd-20">
            <div
              style="background: #4f80ac"
              class="pd-20 white-0 d-flex space-btw"
            >
              <div class="ta-c" v-for="i in 3" :key="i">
                <p class="op-7" :class="asMobile ? 'fz-12' : 'fz-13'">
                  Total Referrals
                </p>
                <p class="fz-18 fw-b">128</p>
              </div>
            </div>
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
};
</script>