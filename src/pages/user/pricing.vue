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
    <pricing-plan v-model="planIdx" />

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
                    <span class="fz-14 gray">{{ 0 }}</span>
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
            v-if="shouldApprove"
            :loading="checking"
            @click="onApprove"
          >
            <b>Approve</b>
          </v-btn>
          <v-btn v-else class="mt-3" block color="primary" :loading="checking">
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
                label="Duration"
                single-line
                dense
                :menu-props="{
                  offsetY: true,
                }"
              ></v-select>
            </div>
            <div class="fz-13 gray">
              Billing period runs from Aug 30, 2021 to Sep 3, 2021
              <br />(Including the remaining 3 days of Pro)
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
              <v-btn color="primary" class="ml-auto" @click="popPay = true"
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
import { erc20, payment, paymentAddress, provider } from "../../plugins/pay";
import { uint256Max } from "../../plugins/pay/utils";

export default {
  data() {
    return {
      popPay: false,
      tokenIdx: 0,
      planIdx: 1,
      tokenList: JSON.parse(localStorage.pay_token_list || "[]"),
      shouldApprove: false,
      checking: true,
      duration: 1,
      durationList: [1, 2, 3, 6].map((i) => {
        return {
          text: `${i} Month${i > 1 ? "s" : ""}`,
          value: i,
        };
      }),
    };
  },
  computed: {
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
  },
  watch: {
    selectedToken() {
      this.checkApprove();
    },
  },
  mounted() {
    this.getTokenList();
  },
  methods: {
    async checkApprove() {
      if (!this.selectedToken) return;
      try {
        this.checking = true;
        const signer = provider.getSigner();
        const from = await signer.getAddress();
        const erc = erc20(this.selectedToken.address);
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
        this.checking = true;
        const erc = erc20(this.selectedToken.address);
        const data = erc.interface.encodeFunctionData("approve", [
          paymentAddress,
          uint256Max,
        ]);
        const signer = provider.getSigner();
        const from = await signer.getAddress();
        console.log("approve from", from);
        const tx = await signer.sendTransaction({
          from,
          to: this.selectedToken.address,
          data,
        });
        await tx.wait();
        this.checkBuy();
      } catch (e) {
        this.popError(e);
        this.checking = false;
      }
    },
    popError(e) {
      this.$alert(e.message);
    },
    async checkBuy() {
      this.checkApprove();
    },
    async getTokenList() {
      let len = await payment.tokenLength();
      len = len.toNumber();
      const list = [];
      for (let i = 0; i < len; i++) {
        let address = await payment.tokens(i);
        const erc = erc20(address);
        const name = await erc.name();
        const symbol = await erc.symbol();
        list.push({
          index: i,
          name,
          symbol,
          address,
        });
      }
      console.log(list);
      this.tokenList = list;
      localStorage.pay_token_list = JSON.stringify(list);
    },
  },
};
</script>