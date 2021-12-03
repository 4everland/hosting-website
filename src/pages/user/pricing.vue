<style lang="scss">
.pay-token-select {
  display: inline-block;
  background: #fff;
  padding: 6px 8px;
  border-radius: 100px;
  .v-text-field__details {
    display: none;
  }
  .v-input__slot {
    margin-bottom: 0 !important;
    &::before,
    &::after {
      display: none;
    }
  }
  .v-text-field {
    margin-top: 0;
  }
}
.token-menu_content {
  margin-left: -35px;
  margin-top: 8px;
}
</style>

<template>
  <div class="pricing" :class="{ m: asMobile }">
    <pricing-plan :isBusiness="isBusiness" v-model="planIdx" />

    <v-dialog v-model="popPay" max-width="420">
      <div class="pd-20 pricing lh-1">
        <div class="bg-th1 bd-1 pd-20 bdrs-5 d-flex al-c">
          <div>
            <div class="pay-token-select">
              <v-select
                style="max-width: 150px"
                v-model="tokenIdx"
                :items="tokenList"
                item-text="symbol"
                item-value="index"
                single-line
                dense
                :menu-props="{
                  offsetY: true,
                  'content-class': 'token-menu_content',
                }"
              >
                <template #prepend v-if="selectedToken">
                  <img
                    :src="`img/icon/c-${selectedToken.symbol.toLowerCase()}.svg`"
                    style="width: 20px"
                  />
                </template>
                <template #item="{ item }">
                  <div class="d-flex al-c pt-2 pb-2">
                    <img
                      :src="`img/icon/c-${item.symbol.toLowerCase()}.svg`"
                      style="width: 20px"
                    />
                    <div class="ml-2 lh-1 mr-3" style="min-width: 90px">
                      <p class="fz-13">{{ item.symbol }}</p>
                      <p class="gray fz-12 mt-1">{{ item.name }}</p>
                    </div>
                    <span class="fz-14 gray">{{ item.balance }}</span>
                  </div>
                </template>
              </v-select>
            </div>
            <!-- <div class="gray mt-2 fz-13">Balance: xx</div> -->
          </div>
          <div class="ml-auto">
            <div class="fz-30 fw-b">{{ planUSD }}</div>
            <!-- <div class="gray mt-2 fz-13">$ {{ planUSD }}</div> -->
          </div>
        </div>

        <div class="mt-5">
          <v-btn
            block
            color="primary"
            :disabled="!shouldApprove"
            :loading="checking || approving"
            @click="onApprove"
          >
            <b>Approve</b>
          </v-btn>
          <v-btn
            v-show="!checking"
            :disabled="shouldApprove"
            class="mt-3"
            block
            color="primary"
            :loading="paying"
            @click="onPay"
          >
            Preview
          </v-btn>
        </div>
      </div>
    </v-dialog>

    <div class="bg-th1 bdt-1 wrap-2 pos-s btm-0">
      <div class="con-3">
        <v-row>
          <v-col>
            <div class="d-flex al-c">
              <span class="mr-2">Duration</span>
              <v-select
                class="s-1"
                style="max-width: 150px"
                v-model="duration"
                :items="durationList"
                item-text="text"
                item-value="value"
                single-line
                dense
              ></v-select>
            </div>
            <div class="fz-13 gray">
              <p v-if="durationList.length">
                {{ billPeriod }}
              </p>
              <p v-else class="red-1">Max billing period is one year</p>
              <p v-if="canRenew && billInfo.endTime">
                (Previous period was from
                {{ new Date(billInfo.startTime).format("date") }} to
                {{ new Date(billInfo.endTime).format("date") }})
              </p>
              <p v-if="extraDay">
                (Including the remaining
                {{ extraDay }} days of Pro)
              </p>
            </div>
          </v-col>
          <v-col
            :style="{
              'padding-left': asMobile ? null : '120px',
            }"
          >
            <div class="fz-13 gray mb-2" v-if="!asMobile">
              DAI、USDC、USDT are accepted by 4EVERLAND
            </div>
            <div class="d-flex al-c">
              <span>Total:</span>
              <b class="ml-5 mr-3 fz-30">{{ planUSD }}</b>
              <span class="gray fz-14">USD</span>
              <v-btn
                color="primary"
                class="ml-auto"
                @click="onPrepare"
                :loading="loadingPrice"
                :disabled="!durationList.length"
                >Preview</v-btn
              >
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
import { BigNumber } from "ethers";
import { mapState } from "vuex";
import { paymentAddress, getClient } from "../../plugins/pay";
import { uint256Max } from "../../plugins/pay/utils";
const MON_SEC = 86400 * 30;

export default {
  data() {
    return {
      uuid: null,
      billInfo: {},
      duration: 1,
      popPay: false,
      tokenIdx: 0,
      planIdx: 1,
      tokenList: JSON.parse(localStorage.pay_token_list || "[]"),
      shouldApprove: false,
      checking: false,
      approving: false,
      paying: false,
      payment: null,
      erc20: null,
      provider: null,
      canBuy: true,
      canUpgrade: false,
      canRenew: false,
      loadingPrice: false,
      upgradingExp: 0,
    };
  },
  computed: {
    ...mapState({
      netType: (s) => s.netType,
      connectAddr: (s) => s.connectAddr,
      nowDate: (s) => s.nowDate,
    }),
    durationList() {
      const { endTime = 0, plan } = this.billInfo;
      const restTime = endTime - Date.now();
      return [1, 2, 3, 6]
        .map((i) => {
          return {
            text: `${i} Month${i > 1 ? "s" : ""}`,
            time: i * MON_SEC * 1e3,
            value: i,
          };
        })
        .filter((it) => {
          if (
            plan != "Free" &&
            endTime &&
            it.time + restTime > 12 * MON_SEC * 1e3
          ) {
            return false;
          }
          return true;
        });
    },
    extraDay() {
      return Math.round(this.upgradingExp / 86400);
    },
    billStart() {
      let date = this.nowDate;
      const { endTime } = this.billInfo;
      if (this.canRenew && endTime) date = new Date(this.billInfo.endTime);
      return date;
    },
    billEnd() {
      return new Date(
        this.billStart * 1 + this.expireVal * 1e3 + this.upgradingExp * 1e3
      );
    },
    billPeriod() {
      return `Billing period starts from ${this.billStart.format(
        "date"
      )} to ${this.billEnd.format("date")}`;
    },
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    selectedToken() {
      return this.tokenList[this.tokenIdx];
    },
    planUnit() {
      return this.planIdx == 2 ? 199 : 40;
    },
    planUSD() {
      return this.planUnit * this.duration;
    },
    expireVal() {
      return this.duration * 86400 * 30;
    },
    isBusiness() {
      return this.billInfo.plan == "Business";
    },
  },
  watch: {
    connectAddr(val) {
      if (val) {
        this.onConnect();
      }
    },
    selectedToken() {
      this.checkApprove();
    },
    duration() {
      this.checkPlan();
    },
    planIdx() {
      this.checkPlan();
    },
    netType() {
      this.$loading.close();
      this.checkPlan();
    },
  },
  mounted() {
    this.getUUID();
    if (this.connectAddr) {
      this.onConnect();
    }
  },
  methods: {
    onConnect() {
      Object.assign(this, getClient());
      this.checkPlan();
    },
    async getBillInfo() {
      const { data } = await this.$http.get("/consumption/info");
      this.billInfo = data;
      if (this.isBusiness) this.planIdx = 2;
    },
    async getUUID() {
      const skey = "pay_uuid";
      let uuid = localStorage[skey];
      // uuid = "0x8f4e36b495d4456aaf975e06e35af232ab4747b6bc464f0ca5f7896d";
      if (uuid) {
        this.uuid = uuid;
        await this.getBillInfo();
        this.checkPlan();
        if (!this.connectAddr) {
          this.showConnect();
        }
        return;
      }
      try {
        this.$loading();
        const { data: id } = await this.$http.get("/user/payment/uuid");
        localStorage[skey] = "0x" + id;
        this.$loading.close();
        this.getUUID();
      } catch (error) {
        console.log(error);
        this.$alert(error.message).then(() => {
          this.getUUID();
        });
      }
    },
    async checkPlan() {
      if (!this.checkNet()) return;
      const payment = this.payment;
      if (!payment || !this.uuid) {
        return;
      }
      console.log("check plan");
      try {
        this.loadingPrice = true;
        const level = this.planIdx - 1;
        const from = this.uuid;
        this.upgradingExp = 0;
        this.canRenew = false;
        this.canBuy = await payment.canBuy(from, level);
        this.canUpgrade = await payment.canUpgrade(from, level);
        // const receipt = await payment.receipts(from);
        // console.log("receipt", receipt);
        if (this.canUpgrade) {
          const upgraded = await payment.getUpgradeExchange(from, level);
          this.upgradingExp = upgraded.toNumber();
          const max = await payment.maxTotalUpgradeExpiration(from, level);
          this.maxUpgradingExp = max.toNumber();
        } else {
          this.canRenew = await payment.canRenew(from);
        }
        console.log(
          level,
          this.canBuy,
          this.canRenew,
          this.canUpgrade,
          this.upgradingExp,
          this.maxUpgradingExp
        );
      } catch (e) {
        this.popError(e);
      }
      this.loadingPrice = false;
    },
    async afterPay() {
      await this.$alert(this.billPeriod, "Payment Submmited", {
        type: "success",
      });
      this.$router.push("/dashboard/settings?tab=1");
    },
    async onPay() {
      // if (Date.now) return this.afterPay();
      // let msg = ''
      try {
        let act = "buy";
        if (this.canUpgrade) act = "upgrade";
        else if (this.canRenew) act = "renew";
        let level = this.planIdx - 1;
        const signer = this.provider.getSigner();
        let params = [
          this.uuid,
          this.selectedToken.index,
          level,
          this.expireVal,
        ];
        if (act == "renew") {
          const nonce = await this.payment.nonces(this.uuid);
          params = [nonce, this.uuid, this.selectedToken.index, this.expireVal];
        }
        const data = this.payment.interface.encodeFunctionData(act, params);
        this.paying = true;
        const tx = await signer.sendTransaction({
          from: this.connectAddr,
          to: paymentAddress,
          data,
        });
        this.paying = false;
        localStorage.pay_hash = tx.hash;
        this.$loading(`Transaction(${tx.hash.cutStr(4, 3)}) pending`);
        await tx.wait();
        this.$loading.close();
        this.afterPay();
      } catch (e) {
        this.popError(e);
        this.paying = false;
      }
    },
    showConnect() {
      this.$setState({
        noticeMsg: {
          name: "showWalletConnect",
        },
      });
    },
    checkNet() {
      if (!this.netType) return false;
      let msg = "";
      if (this.netType != "goerli") {
        msg = "Dev: please connect to goerli";
      }
      if (msg) {
        this.$alert(msg);
      }
      return !msg;
    },
    onPrepare() {
      if (!this.connectAddr) {
        this.showConnect();
        return;
      }
      if (!this.checkNet()) return;
      this.popPay = true;
      this.checkApprove();
      this.getTokenList();
    },
    async checkApprove() {
      if (!this.selectedToken || !this.provider) return;
      try {
        this.checking = true;
        const signer = this.provider.getSigner();
        const from = await signer.getAddress();
        const erc = this.erc20(this.selectedToken.address);
        // console.log(from, this.selectedToken.address, erc);
        const allowance = await erc.allowance(from, paymentAddress);
        const minAllowance = uint256Max.shr(1);
        this.shouldApprove = allowance.lt(minAllowance);
        // console.log(this.shouldApprove);
      } catch (error) {
        this.popError(error);
      }
      this.checking = false;
    },
    async onApprove() {
      try {
        this.approving = true;
        const erc = this.erc20(this.selectedToken.address);
        const data = erc.interface.encodeFunctionData("approve", [
          paymentAddress,
          uint256Max,
        ]);
        const signer = this.provider.getSigner();
        const from = await signer.getAddress();
        console.log("approve from", from);
        const tx = await signer.sendTransaction({
          from,
          to: this.selectedToken.address,
          data,
        });
        await tx.wait();
        this.checkApprove();
      } catch (e) {
        this.popError(e);
      }
      this.approving = false;
    },
    popError(e) {
      this.$alert(e.message);
    },
    async getTokenList() {
      let len = await this.payment.tokenLength();
      len = len.toNumber();
      const list = [];
      for (let i = 0; i < len; i++) {
        let address = await this.payment.tokens(i);
        const erc = this.erc20(address);
        const name = await erc.name();
        const symbol = await erc.symbol();
        let balance = await erc.balanceOf(this.connectAddr);
        balance = balance.div(BigNumber.from((1e18).toString())) + "";
        list.push({
          index: i,
          name,
          symbol,
          address,
          balance,
        });
      }
      console.log(list);
      this.tokenList = list;
      localStorage.pay_token_list = JSON.stringify(list);
    },
  },
};
</script>