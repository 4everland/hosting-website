<style lang="scss">
.act-p1 {
  min-height: 200px;
  background: linear-gradient(180deg, #353748 0%, #20242c 100%);
  .reward-item {
    min-width: 156px;
    height: 150px;
    &.done {
      background: #fff url(/img/icon/act-checked.png) right bottom no-repeat;
      background-size: 36px;
    }
  }
}
.act-gift1 {
  right: -20px;
  top: -130px;
  width: 300px;
}
.act-wrap1 {
  .bd-1b {
    border: 1px solid #4a96fa;
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
    <div class="ta-r">
      <v-btn
        color="primary"
        small
        rounded
        href="https://www.4everland.org/firstlanding"
        target="_blank"
        >Rules</v-btn
      >
    </div>
    <div class="ta-c">
      <img
        src="img/bg/act-title1.png"
        :style="{
          height: asMobile ? '100px' : '250px',
        }"
      />
    </div>
    <div
      :style="{
        'margin-top': asMobile ? '60px' : '50px',
      }"
    ></div>

    <div class="pos-r">
      <img
        src="img/bg/act-gift.png"
        class="pos-a z-1 act-gift1"
        :style="asMobile ? 'width: 240px;top:-100px;' : ''"
      />
      <act-countdown></act-countdown>
    </div>
    <div class="act-p1 bdrs-10 pos-r">
      <div class="pd-20 pl-0 pr-0">
        <div class="ml-5 mr-6 d-flex al-c">
          <h3>My Rewards</h3>
          <!-- <v-btn
            plain
            color="white"
            small
            :loading="loading"
            @click="onRefresh"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn> -->
          <v-btn
            class="ml-auto"
            :color="errAccount ? 'error' : 'primary'"
            small
            rounded
            @click="setAddr"
          >
            <v-icon size="16" class="mr-1">mdi-wallet</v-icon>
            <span>{{ ethAddr ? ethAddr.cutStr(6, 4) : "Wallet Address" }}</span>
          </v-btn>
        </div>
        <div class="ov-a mt-5 gray-3 ta-c">
          <div class="ml-5 nowrap d-flex">
            <div
              class="bg-white bdrs-5 pt-5 pb-5 d-ib reward-item mr-6 flex-1"
              :class="{
                done: it.done,
              }"
              v-for="it in list"
              :key="it.type"
              v-show="!it.hide || it.done"
            >
              <div v-if="it.loaded">
                <p class="fw-b">
                  {{ numberComma(it.reward) }}
                  <span class="fz-12">4EVER</span>
                </p>
                <div class="gray fz-12 mt-1 d-flex al-c flex-center">
                  <span>{{ it.title }}</span>
                  <e-tooltip right max-width="300" v-if="it.tip">
                    <v-icon slot="ref" color="#999" size="14" class="pa-1 d-ib"
                      >mdi-help-circle-outline</v-icon
                    >
                    <span v-html="it.tip"></span>
                  </e-tooltip>
                </div>
                <div class="mt-8">
                  <v-btn
                    @click="onClick(it)"
                    color="primary"
                    small
                    :disabled="it.disabled"
                    v-if="it.btnTxt"
                    >{{ it.btnTxt }}</v-btn
                  >
                </div>
              </div>
              <div v-else>
                <v-skeleton-loader
                  type="card-heading, list-item-two-line"
                ></v-skeleton-loader>
              </div>
            </div>
          </div>
        </div>
        <div class="ta-c mt-10">
          <v-btn
            :disabled="totalReward == 0"
            @click="onClaim"
            :loading="claimLoading"
            rounded
            style="background: linear-gradient(90deg, #fa4adc 0%, #de4343 100%)"
          >
            <span class="white-0 d-ib pl-3 pr-3"
              >{{ claimed ? "Claimed" : "My rewards" }} :
              {{ numberComma(totalReward) }}
              <span class="fz-12">4EVER</span></span
            >
          </v-btn>
          <!-- <div class="mt-3">
            <v-btn small plain color="white" @click="setAddr"
              >Wallet Address</v-btn
            >
          </div> -->
        </div>
      </div>
    </div>

    <act-dapp ref="dapp" :tip="list[4].tip" />

    <act-invite ref="invite" :tip="list[3].tip" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import Web3 from "web3";
// import WalletConnectProvider from '@walletconnect/web3-provider';
import actAbi from "../../plugins/act-abi";

export default {
  computed: {
    ...mapState({
      actStatus: (s) => s.actStatus,
      userInfo: (s) => s.userInfo,
      isFocus: (s) => s.isFocus,
      nowDate: (s) => s.nowDate,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    isEnd() {
      return this.actStatus == 2 || this.nowDate > 1634169600000;
    },
  },
  data() {
    return {
      loading: false,
      totalReward: 0,
      list: [
        {
          type: "OLD_USER_DEPLOY",
          title: "Early adopter",
          hide: true,
          txt2: "Deployed",
          tip: "Early adopter rewards are to those who deployed one or more projects before First Landing start in 4EVERLAND.",
        },
        {
          type: "DEPLOY",
          title: "Deploy rewards",
          txt: "Deploy",
          txt2: "Deployed",
          link: "/new",
          tip: "Deploy rewards are to those who deploy one or more projects during First Landing to win deploy rewards. They might run out so hurry up!",
        },
        {
          type: "BIND_DOMAIN",
          title: "Domain rewards",
          txt: "Add Domain",
          txt2: "Domain Added",
          link: "/dashboard/domains",
          tip: "Domain rewards are to those who customise their project domain name.",
        },
        {
          type: "INVITE_REWARD",
          title: "Invite rewards",
          txt: "Invite",
          tip: "Your valid invited developers/ total valid invited developers * 10 million = your invitation rewards.  <i>* Invited developer GitHub accounts must be registered before 8th September.</i>",
          isMore: true,
        },
        {
          type: "VIEWER_REWARD",
          title: "Viewer rewards",
          txt: "Copy Domain",
          tip: "Your valid page users/ total valid page users * 10 million = your total user rewards. <i>* You must connect  your domain to claim total user rewards.</i>",
          isMore: true,
        },
      ],
      ethAddr: "",
      claimLoading: false,
      errAccount: false,
      claimed: !!localStorage.claimed,
    };
  },
  watch: {
    isFocus(val) {
      if (val) {
        this.onRefresh();
      }
    },
    "$route.path"(val) {
      if (val == "/dashboard/first-landing") {
        this.onRefresh();
      }
    },
    isEnd() {
      this.getList();
    },
  },
  created() {
    this.getList();
    this.getAddr();
  },
  methods: {
    async connectMetaMask() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        // await window.ethereum.enable();
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          return true;
        } catch (error) {
          this.$alert("Failed to connect wallet" + ": " + error.message);
          return false;
        }
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        return true;
      } else {
        this.$confirm("Metamask is not installed", {
          confirnText: "Install",
        }).then(() => {
          window.open(
            "https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn"
          );
        });
        return false;
      }
    },
    async onClaim() {
      if (!this.ethAddr) {
        this.setAddr();
        return;
      }
      // && !this.$inDev
      if (this.actStatus != 3) {
        return this.$alert(
          "The claim is expected to start on 21st October, please make sure that you have added your ETH wallet address in time otherwise you might lost your rewards."
        );
      }

      const isOk = await this.connectMetaMask();
      console.log(isOk);
      if (!isOk) return;

      // https://github.com/dinn2018/airdrop-claim/blob/master/deployments/ropsten/MerkleDistributor.json
      // https://github.com/dinn2018/airdrop-claim/blob/master/deployments/ropsten/TEver.json
      // https://raw.githubusercontent.com/dinn2018/airdrop-claim/master/scripts/result.json
      const info = actAbi.result.claims[this.ethAddr];
      if (!info) {
        return this.$alert(`Your Wallet address is not in reward list.`);
      }

      let accounts = await window.web3.eth.getAccounts();
      console.log(accounts);
      this.errAccount = !accounts.includes(this.ethAddr);
      if (this.errAccount) {
        return this.$alert(
          `Wallet address(${this.ethAddr.cutStr(
            6,
            4
          )}) is not connected in MetaMask.`
        );
      }

      const contract = new window.web3.eth.Contract(actAbi.abi, actAbi.address);
      try {
        const isClaimed = await contract.methods.isClaimed(info.index);
        if (isClaimed) {
          this.$alert("Your wallet address has been claimed.");
          if (!this.$inDev) return;
        }
        this.claimLoading = true;
        await contract.methods
          .claim(
            info.index,
            this.ethAddr,
            info.amount,
            info.tokenId,
            info.proof
          )
          .send(
            {
              from: this.ethAddr,
            },
            (err, txid) => {
              if (err) {
                this.$alert(err.message);
                return;
              }
              localStorage.txid = txid;
              console.log("txid: " + txid);
              this.$toast("Transaction start");
            }
          );
        this.$alert("Claim successfully!");
        localStorage.claimed = 1;
        this.claimed = true;
        this.addSymbol();
      } catch (error) {
        console.log(error);
        this.$alert(error.message);
      }
      this.claimLoading = false;
    },
    addSymbol() {
      if (localStorage.tever_symbol) {
        return;
      }
      // https://github.com/dinn2018/airdrop-claim/blob/master/deployments/ropsten/TEver.json
      window.web3.currentProvider.send(
        {
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: "0x91122227D4b4dbdFE85b9e0D8FbBd8bBeD2F038c",
              symbol: "TEVER",
              decimals: 18,
              image: "https://hosting.4everland.org/img/logo.jpg",
            },
          },
        },
        (err, ok) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log("set symbol", ok);
          localStorage.tever_symbol = 1;
        }
      );
    },
    numberComma(source, length = 3) {
      source = String(source).split(".");
      source[0] = source[0].replace(
        new RegExp("(\\d)(?=(\\d{" + length + "})+$)", "ig"),
        "$1,"
      );
      return source.join(".");
    },
    async getAddr() {
      const { data } = await this.$http.get("/activity/ethAddress");
      this.ethAddr = data;
    },
    async setAddr() {
      const tip =
        "Submit your ETH Address, rewards available at the end of the 4EVERLAND FirstLanding.";
      let value = "";
      try {
        const data = await this.$prompt(tip, "Prompt", {
          hideTitle: true,
          defaultValue: this.ethAddr,
          inputAttrs: {
            label: "Wallet Adress",
            require: true,
            placeholder: "Enter your wallet address",
            rules: [
              (v) =>
                this.$regMap.eth.test(v) ||
                "Please enter correct eth wallet address.",
            ],
            required: true,
          },
        });
        value = data.value;
      } catch (error) {
        return;
      }
      if (value == this.ethAddr) {
        return;
      }
      try {
        console.log(value);
        this.$loading();
        await this.$http.put(`/activity/bind/eth/${value}`);
        this.$loading.close();
        this.$toast(`${!this.ethAddr ? "Added" : "Updated"} successfully`);
        this.ethAddr = value;
        this.getAddr();
      } catch (error) {
        console.log(error);
        this.setAddr();
      }
    },
    async onRefresh() {
      await this.getList();
      this.$refs.dapp.getList();
      this.$refs.invite.getList();
    },
    onClick(row) {
      let { type, link } = row;
      console.log(type);
      const dapp = this.$refs.dapp;
      if (["VIEWER_REWARD", "DEPLOY"].includes(type) && !dapp.list.length) {
        link = "/new";
      }
      if (link) this.$navTo(link);
      else if (type == "INVITE_REWARD") {
        this.$refs.invite.onInvite();
      } else if (type == "VIEWER_REWARD") {
        dapp.setTipCopy();
      }
    },
    async getList() {
      try {
        this.loading = true;
        // const { data: status } = await this.$http.get("/activity/status");
        // this.$setState({
        //   actStatus: status,
        // });
        let {
          data: { myRewards: rows, poolD2E: rest, totalRewards },
        } = await this.$http.get("/activity/rewards");
        // rest = 0;
        const list = [];
        this.totalReward = totalRewards;
        for (const row of rows) {
          delete row.title;
          const item = this.list.filter((it) => it.type == row.type)[0];
          if (!item) continue;
          row.loaded = true;
          row.btnTxt = item.txt;
          // row.done = true;
          if (row.done) {
            if (item.txt2) {
              row.btnTxt = item.txt2;
              row.disabled = true;
            }
            if (!this.isEnd && item.isMore) {
              row.done = false;
            }
          }
          if ((rest <= 0 && !item.isMore) || this.isEnd) {
            row.disabled = true;
            row.btnTxt = this.isEnd ? "Ended" : "Run out";
          }
          list.push({
            ...item,
            ...row,
          });
        }
        this.list = list;
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
  },
};
</script>