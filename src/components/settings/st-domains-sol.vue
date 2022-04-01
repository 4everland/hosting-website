<template>
  <div>
    <v-skeleton-loader type="article" v-if="!info" />
    <div v-else-if="!info.sns">
      <h3>Solana</h3>
      <div class="gray mt-1 fz-14">
        Add your Solana to your 4EVERLAND site
      </div>
      <div class="mt-5">
        <div class="d-flex">
          <v-text-field
            outlined
            dense
            v-model.trim="domain"
            @keyup.enter="onAdd"
            placeholder="SOL Domain"
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
    <div v-else>
      <template>
        <div class="mb-6 mt-3">
          <div class="d-flex al-c flex-wrap">
            <div class="mr-auto">
              <h3 class="mr-auto">{{ info.sns }}</h3>
              <div class="d-flex al-c mt-2">
                <v-icon :color="info.verify ? 'success' : 'error'" size="18">
                  mdi-{{ info.verify ? "check-circle" : "information" }}
                </v-icon>
                <span
                  class="ml-1 fz-13"
                  :class="info.verify ? 'color-suc' : 'red-1'"
                >
                  {{
                    info.verify
                      ? "Valid Configuration"
                      : "Invalid Configuration"
                  }}
                </span>
              </div>
            </div>
            <div class="mt-2">
              <div class="text-center">
                <v-menu offset-y open-on-hover>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list dense>
                    <v-list-item
                      link
                      v-clipboard="info.cid"
                      @success="$toast('Copied to clipboard !')"
                    >
                      <span>Copy CID</span>
                    </v-list-item>
                    <v-list-item
                      v-if="!info.verify"
                      link
                      @click="verifyConfiguration"
                    >
                      <span>Verify Configuration</span>
                    </v-list-item>
                    <v-list-item link @click="onRemove">
                      <span class="red-1">Remove</span>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!info.verify">
          <v-divider></v-divider>
          <div class="gray mt-1 fz-14">
            Set the content hash of your SOL domain and we will automatically
            update the site for all future site deployments. This operation is
            performed only once.
          </div>
          <div class="d-flex al-c space-btw">
            <div class="gray mt-1 fz-14">
              <span>Owner:</span>
              <span>{{ owner.cutStr(6, 4) }}</span>
            </div>
            <v-btn
              @click="setContentHash"
              color="primary"
              class="ml-4"
              style="margin-top: 2px"
            >
              Set content hash
            </v-btn>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  getOwner,
  getConnect,
  getResolveData,
  domainUpdate,
  sendTransaction,
} from "../../plugins/sns";
const reg = /.+\.sol$/;

export default {
  data() {
    return {
      domain: "",
      adding: false,
      info: null,
      resolveData: "",
      owner: "",
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
    async getInfo() {
      try {
        const { id } = this.$route.params;
        const { data } = await this.$http.put("/project/ipns/sns/" + id);
        this.info = data;
        if (data.sns != "") {
          this.domain = data.sns;
          await this.verifyOwner();
        }
      } catch (error) {
        //
      }
    },
    async setInfo() {
      try {
        const { id } = this.$route.params;
        let body = {
          sns: this.domain,
          content: this.resolveData,
        };
        const { data } = await this.$http.put("/project/ipns/sns/" + id, body);
        this.info = data;
      } catch (error) {
        //
      }
    },
    async verifyConfiguration() {
      this.$loading();
      this.resolveData = await getResolveData(this.info.sns);
      if (this.resolveData === this.info.content) {
        this.info.verify = true;
      } else {
        this.info.verify = false;
      }
      this.setInfo();
      this.$loading.close();
    },
    async onRemove() {
      try {
        await this.$confirm(
          `${this.info.sns} will be removed. Are you sure you want to continue?`
        );
        this.domain = "";
        this.$loading();
        await this.setInfo();
        this.$toast("Removed successfully");
      } catch (error) {
        //
      }
      this.$loading.close();
    },

    onAdd() {
      let hostnameArray = this.domain.split(".");
      if (!reg.test(this.domain)) {
        return this.$alert("The domain name you entered is invalid.");
      }
      if (hostnameArray.length !== 2) {
        return this.$alert("The domain name you entered is invalid.");
      }
      this.verifyOwner(true).then(() => {
        this.$confirm(
          `${this.owner.cutStr(6, 4)} is the owner of ${
            this.domain
          }. Is that you?`
        ).then(() => {
          this.setInfo();
        });
      });
    },
    async verifyOwner(add) {
      try {
        this.$loading();
        this.owner = await getOwner(this.domain);
        if (add && !this.owner) {
          return this.$alert("Invalid Solana Domain");
        }
      } catch (error) {
        this.onErr(error);
      }
      this.$loading.close();
    },
    async setContentHash() {
      this.$loading();
      const accountAddr = await getConnect();
      if (accountAddr != this.owner) {
        return this.$alert(
          "Connected account is not the controller of the domain. "
        );
      }
      const transaction = await domainUpdate(this.info.sns, this.info.cid);
      const result = await sendTransaction(transaction);
      if (result) {
        this.resolveData = await getResolveData(this.info.sns);
        this.setInfo();
      }
      this.$loading.close();
    },
  },
};
</script>
