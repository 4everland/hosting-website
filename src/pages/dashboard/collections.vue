<template>
  <div>
    <v-dialog max-width="420" v-model="showPop">
      <div class="pd-10-20 bg-gray-e d-flex al-c">
        <b class="fz-14">{{ curItem.title }}</b>
        <div class="ml-auto pa-1 hover-1" @click="showPop = false">
          <v-icon size="20">mdi-close</v-icon>
        </div>
      </div>
      <div class="pd-20">
        <v-img :src="curItem.img" class="w100p d-b mb-3" max-height="360" />
        <v-row>
          <v-col cols="12" md="5">
            <h4>Description</h4>
            <div class="pa-1 mt-1 bg-f5 gray-3 fz-13">
              {{ curItem.desc }}
            </div>
          </v-col>
          <v-col cols="12" md="7">
            <h4>Details</h4>
            <div
              class="mt-2 d-flex al-c space-btw fz-12"
              v-for="(it, i) in introList"
              :key="i"
            >
              <span class="gray">{{ it.label }}</span>
              <span
                class="color-1 hover-1"
                v-clipboard="it.value"
                @success="$toast('Copied')"
                >{{ it.value.cutStr(6, 4) }}</span
              >
            </div>
          </v-col>
        </v-row>
      </div>
    </v-dialog>
    <v-card outlined>
      <div class="pd-15-20 bdb-1 d-flex al-c">
        <b class="fz-16">My Collections</b>
        <span class="gray ml-auto fz-14">{{ connectAddr.cutStr(4, 4) }}</span>
      </div>
      <div class="pd-20">
        <div class="ta-c pa-10" v-if="!list.length">
          <img src="img/empty/bill.svg" style="height: 150px" />
          <p class="mt-4 fw-b">No NFTs to display</p>
          <p class="mt-1 gray-a fz-14">
            Please follow us for future limited NFT
          </p>
        </div>
        <div v-else class="pb-3">
          <p class="fz-14 fw-b mb-4">Total: {{ list.length }}</p>
          <v-row>
            <v-col cols="12" md="4" v-for="(it, i) in list" :key="i">
              <v-card @click="onItem(it)">
                <v-img :src="it.img" height="300"></v-img>
                <div class="pd-15-20">
                  <p class="fw-b fz-15 gray-6">{{ it.title }}</p>
                  <!-- <p class="gray fz-12">{{ it.title }} #{{ it.id }}</p> -->
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      showPop: false,
      list: [],
      curItem: {},
      contractAddr: "",
    };
  },
  computed: {
    ...mapState({
      noticeMsg: (s) => s.noticeMsg,
      connectAddr: (s) => s.connectAddr,
    }),
    introList() {
      return [
        {
          label: "Owned by",
          value: this.connectAddr,
        },
        {
          label: "Contract Address",
          value: this.contractAddr,
        },
        // {
        //   label: "Token ID",
        //   value: "0",
        // },
        {
          label: "Token Standard",
          value: "ERC-1155",
        },
        {
          label: "Blockchain",
          value: "Ethernum",
        },
      ];
    },
  },
  watch: {
    noticeMsg({ name }) {
      // console.log(name);
      if (name == "walletConntect") {
        this.onInit();
      }
    },
    "$route.path"(val) {
      if (val == "/dashboard/collections") {
        this.onInit();
      }
    },
  },
  created() {
    this.onInit();
  },
  methods: {
    async onInit() {
      if (!this.connectAddr) {
        // this.$setState({
        //   noticeMsg: {
        //     name: "showWalletConnect",
        //   },
        // });
        this.list = [];
        return;
      }

      try {
        this.$loading();
        const { data } = await this.$http.get(
          location.origin + "/file/tever-1155.json"
        );
        this.contractAddr = data.address;
        const contract = new window.web3.eth.Contract(data.abi, data.address);
        const nftId = 0;
        // const cid = await contract.methods.uri(nftId).call();
        // const { data: info } = await this.$http.get(
        //   "https://mygateway.mypinata.cloud/ipfs/" + cid.replace("ipfs://", "")
        // );
        // console.log(info);
        const num = await contract.methods
          .balanceOf(this.connectAddr, 0)
          .call();
        console.log("balance of #" + nftId, num);
        let list = [];
        while (list.length < num) {
          list.push({
            title: "Firstlanding",
            id: nftId,
            img: "img/bg/firstlanding0.gif",
            desc: "NFT test",
          });
        }
        this.list = list;
        this.$loading.close();
      } catch (error) {
        console.log(error);
      }
    },
    onItem(it) {
      this.curItem = it;
      this.showPop = true;
    },
  },
};
</script>