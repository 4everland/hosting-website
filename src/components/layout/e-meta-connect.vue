<template>
  <div>
    <v-dialog v-model="showPop" max-width="500">
      <e-dialog-close @click="showPop = false"></e-dialog-close>
      <div class="pd-15-20">
        <div class="ta-c">
          <h3>Connect Wallet</h3>
        </div>
        <div class="pd-20">
          <div class="gray fz-15">
            After connecting to your wallet, you'll be able to make changes in
            custom settings. Please select the Ethereum Mainnet network.
          </div>
          <div class="mt-5 d-flex al-c">
            <img src="img/icon/metamask.png" style="height: 25px" />
            <b class="ml-4">MetaMask</b>
            <span class="gray fz-13 ml-5">{{ connectAddr.cutStr(4, 4) }}</span>
            <v-btn
              :color="isConnect ? '' : 'primary'"
              class="ml-auto"
              @click="onConnect"
              >{{ isConnect ? "Disconnect" : "Connect" }}</v-btn
            >
          </div>
        </div>
      </div>
    </v-dialog>
    <div
      @click="showPop = true"
      v-ripple
      style="background: #ffe9d3; padding: 5px"
      :class="{ 'filter-gray': !isConnect }"
      class="bdrs-3 ml-5 hover-1"
    >
      <v-img src="img/icon/metamask.png" width="22"></v-img>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Web3 from "web3";
import actAbi from "../../plugins/act-abi";
// https://github.com/dinn2018/airdrop-claim/blob/master/deployments/ropsten/MerkleDistributor.json
// https://github.com/dinn2018/airdrop-claim/blob/master/deployments/ropsten/TEver.json
// https://raw.githubusercontent.com/dinn2018/airdrop-claim/master/scripts/result.json
// https://github.com/dinn2018/airdrop-claim/blob/master/deployments/ropsten/TEver1155.json

export default {
  data() {
    return {
      showPop: false,
      ethAddr: "",
      isConnect: false,
    };
  },
  computed: {
    ...mapState({
      noticeMsg: (s) => s.noticeMsg,
      connectAddr: (s) => s.connectAddr,
    }),
  },
  watch: {
    noticeMsg({ name }) {
      if (name == "walletConnect") {
        this.isConnect = true;
      } else if (name == "showWalletConnect") {
        this.showPop = true;
      }
    },
    async isConnect(val) {
      localStorage.isConnectMetaMask = val ? "1" : "";
      // this.onConnect();
      let connectAddr = "";
      if (val) {
        this.showPop = false;
        window.ethContract = new window.web3.eth.Contract(
          actAbi.abi,
          actAbi.address
        );
        const accounts = await window.web3.eth.getAccounts();
        connectAddr = accounts[0];
      }
      this.$setState({
        noticeMsg: {
          name: "walletConntect",
          data: {
            isConnect: val,
          },
        },
        connectAddr,
      });
    },
  },
  created() {
    this.getAddr();
    if (localStorage.isConnectMetaMask) {
      // this.onConnect();
      this.isConnect = true;
    }
  },
  methods: {
    async getAddr() {
      const { data } = await this.$http.get("/activity/ethAddress");
      this.ethAddr = data;
    },
    async onConnect() {
      if (!this.isConnect) {
        const isOk = await this.connectMetaMask();
        this.isConnect = isOk;
      } else {
        window.ethereum = null;
        this.isConnect = false;
      }
    },
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
  },
};
</script>