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
            <span class="gray fz-13 ml-5">{{ ethAddr.cutStr(4, 4) }}</span>
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
      class="bdrs-3 ml-5 hover-1"
    >
      <v-img src="img/icon/metamask.png" width="22"></v-img>
    </div>
  </div>
</template>

<script>
import Web3 from "web3";

export default {
  data() {
    return {
      showPop: false,
      ethAddr: "",
      isConnect: !!localStorage.isConnectMetaMask,
    };
  },
  watch: {
    showPop(val) {
      if (val && localStorage.isConnectMetaMask) this.isConnect = true;
    },
  },
  created() {
    this.getAddr();
  },
  methods: {
    async getAddr() {
      const { data } = await this.$http.get("/activity/ethAddress");
      this.ethAddr = data;
    },
    async setAddr() {
      const tip = "Your ETH Address";
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
    async onConnect() {
      if (!this.isConnect) {
        await this.connectMetaMask();
        this.isConnect = true;
        localStorage.isConnectMetaMask = 1;
      } else {
        this.isConnect = false;
        localStorage.isConnectMetaMask = "";
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