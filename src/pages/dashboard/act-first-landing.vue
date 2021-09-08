<style lang="scss">
.act-p1 {
  min-height: 200px;
  background: linear-gradient(180deg, #353748 0%, #20242c 100%);
  .act-gift1 {
    right: -20px;
    top: -120px;
    width: 300px;
  }
  .reward-item {
    width: 156px;
    height: 150px;
  }
}
.act-wrap1 {
  .bd-1b {
    border: 1px solid #4A96FA;
  }
  table {
    background: #1e2226;
    border-spacing: 0;
    font-size: 15px;
    thead {
      background: linear-gradient(180deg, #464766 0%, #222631 100%);
    }
    tbody {
      font-size: 14px;
    }
    td {
      padding: 10px;
    }
    tr:nth-child(even) {
      background: #282d3b;
    }
  }
}
</style>
<template>
  <div class="white-0 act-wrap1">
    <div class="act-p1 bdrs-10 pos-r" :style="{
      'margin-top': asMobile ? '150px' : '240px'
    }">
      <img src="img/bg/act-gift.png" class="pos-a act-gift1" :style="asMobile ? 'width: 240px;top:-100px;' : ''" />
      <div class="pd-20 pl-0 pr-0">
        <h3 class="ml-5">My Rewards</h3>
        <div class="ov-a mt-6 gray-3 ta-c">
          <div class="ml-5 nowrap">
            <div class="bg-white bdrs-5 pd-20 d-ib reward-item mr-6" v-for="i in 5" :key="i">
              <p class="fw-b">10,000 4EVER</p>
              <p class="gray fz-12 mt-1">Domain rewards</p>
              <div class="mt-8">
                <v-btn color="primary" small>Add Domain</v-btn>
              </div>
            </div>
          </div>
        </div>
        <div class="ta-c mt-10">
          <v-btn rounded style="background:linear-gradient(90deg, #FA4ADC 0%, #DE4343 100%)">
            <span class="white-0 d-ib pl-3 pr-3">Available claim : 100,000 4EVER</span>
          </v-btn>
        </div>
      </div>
    </div>

    <div class="mt-10">
      <h3 class="pd-20">My DApps</h3>
    </div>
    <div class="ov-a bdrs-10 bd-1b ov-h">
      <table class="w100p ta-c" style="min-width: 560px;">
        <thead>
          <tr>
            <td>#</td>
            <td>DApp</td>
            <td>Domains</td>
            <td>Total Users</td>
            <td>Percentage</td>
            <td>CreateAt</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 5" :key="i">
            <td>1</td>
            <td>hosting-test</td>
            <td>hqs.link</td>
            <td>100</td>
            <td>10%</td>
            <td>Aug 1 2021</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
}
</script>