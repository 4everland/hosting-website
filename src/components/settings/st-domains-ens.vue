<template>
  <div>
    <h3>ENS</h3>
    <div class="gray mt-1 fz-14">Add your ENS to your 4everland site.</div>
    <div class="mt-5">
      <v-skeleton-loader type="article" v-if="!info" />
      <div v-else-if="info.ens">
        <v-btn
          :href="`https://app.ens.domains/name/${info.ens}/details`"
          target="_blank"
          outlined
          color="primary"
        >
          {{ info.ens }}
        </v-btn>
      </div>
      <div class="d-flex" v-else>
        <v-text-field
          outlined
          dense
          v-model.trim="domain"
          @keyup.enter="onAdd"
          placeholder="ENS Domain"
        >
        </v-text-field>
        <v-btn
          @click="onAdd"
          :disabled="!domain"
          :loading="adding"
          color="primary"
          class="ml-4"
          style="margin-top: 2px"
        >
          Add
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { namehash } from "@ensdomains/ensjs";
import { encode, decode } from "@ensdomains/content-hash";
import { getProvider, getENSRegistry, getResolver } from "../../plugins/ens";

export default {
  data() {
    return {
      domain: "",
      adding: false,
      ipnsHash: "",
      info: null,
    };
  },
  computed: {
    ...mapState({
      netType: (s) => s.netType,
      connectAddr: (s) => s.connectAddr,
    }),
  },
  created() {
    this.getInfo();
  },
  methods: {
    async getInfo(isPut) {
      try {
        const { id } = this.$route.params;
        const body = {};
        if (isPut) {
          body.ens = this.domain;
        }
        const { data } = await this.$http.put("/project/ipns/" + id, body);
        this.ipnsHash = data.ipns;
        this.info = data;
        console.log(data, this.ipnsHash);
      } catch (error) {
        //
      }
    },
    checkNet() {
      if (!this.netType) return false;
      let msg = "";
      if (this.$inDev) {
        // if (this.netType != "goerli") msg = "Dev: please connect to goerli";
      } else if (this.netType != "main") {
        msg = "Wrong network, please connect to Ethereum mainnet";
      }
      if (msg) {
        this.$alert(msg);
      }
      return !msg;
    },
    showConnect() {
      this.$setState({
        noticeMsg: {
          name: "showWalletConnect",
        },
      });
    },
    onAdd() {
      if (!this.checkNet() || !this.connectAddr) {
        this.showConnect();
        return;
      }
      if (!/.+\.eth$/.test(this.domain)) {
        return this.$alert("Invalid ETH Domain");
      }
      this.verify();
    },
    async verify() {
      try {
        this.$loading();
        this.node = namehash(this.domain);
        this.provider = getProvider();
        const registry = getENSRegistry(this.provider);

        this.owner = await registry.owner(this.node);
        console.log(this.owner);

        this.resolver = await registry.resolver(this.node);
        let contentHash = await getResolver(
          this.resolver,
          this.provider
        ).contenthash(this.node);
        this.$loading.close();

        if (contentHash.substring(2)) {
          const res = decode(contentHash);
          console.log(res);
          if (res == this.ipnsHash) {
            this.getInfo(true);
            return;
          }
        }
        if (this.owner == this.connectAddr) {
          this.setContentHash();
        } else {
          this.$alert(
            `${this.owner.cutStr(10, 10)} is the owner of ${this.domain}`
          );
        }
      } catch (error) {
        this.onErr(error);
      }
    },
    async setContentHash() {
      try {
        await this.$confirm(
          "Set the content hash of your ENS domain and we will automatically update the site for all future site deployments. This operation is performed only once.",
          "Set content hash"
        );
        this.$loading();
        const signer = this.provider.getSigner();
        const ipnsHashEncoded = encode("ipns-ns", this.ipnsHash);
        const data = getResolver(
          this.resolver,
          this.provider
        ).interface.encodeFunctionData("setContenthash", [
          this.node,
          `0x${ipnsHashEncoded}`,
        ]);
        const from = await signer.getAddress();
        const tx = await signer.sendTransaction({
          to: this.resolver,
          from,
          data,
        });
        this.$loading(`Transaction(${tx.hash.cutStr(4, 3)}) pending`);
        const receipt = await tx.wait();
        console.log(receipt);

        this.getInfo(true);
      } catch (error) {
        this.onErr(error);
      }
      this.$loading.close();
    },
    onErr(e) {
      // console.log(e);
      if (e) this.$alert(e.message);
    },
  },
};
</script>