<template>
  <div>
    <h3>Domains</h3>
    <div class="gray mt-1 fz-14">
      These domains are assigned to your Production Deployments.Optionally, a
      different Git branch or a redirection to another domain can be configured
      for each one.
    </div>
    <div class="mt-5 d-flex">
      <v-text-field
        outlined
        dense
        v-model.trim="domain"
        @keyup.enter="onAdd"
        placeholder="mywebsite.com"
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
    <div v-if="!list">
      <v-skeleton-loader type="article" />
    </div>
    <template v-else>
      <div class="bd-1 mb-6 mt-3" v-for="(it, i) in list" :key="i">
        <div class="pd-20 d-flex al-c flex-wrap">
          <div class="mr-auto">
            <h3 class="mr-auto">{{ it.domain }}</h3>
            <div class="d-flex al-c mt-2">
              <v-icon :color="it.valid ? 'success' : 'error'" size="18">
                mdi-{{ it.valid ? "check-circle" : "information" }}
              </v-icon>
              <span
                class="ml-1 fz-13"
                :class="it.valid ? 'color-suc' : 'red-1'"
              >
                {{ it.valid ? "Valid Configuration" : "Invalid Configuration" }}
              </span>
            </div>
          </div>
          <div class="mt-2">
            <v-btn
              v-if="!it.valid"
              small
              class="mr-4"
              @click="onRefresh(it)"
              :loading="it.refreshing"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
            <v-btn
              small
              color="error"
              @click="onRemove(it)"
              :loading="it.removing"
            >
              Remove
            </v-btn>
          </div>
        </div>
        <div class="pd-20 bdt-1" v-if="!it.valid">
          <!-- <div class="fz-14">
            <b>Nameservers</b>
          </div> -->
          <p class="gray mt-1 fz-14">
            Set the following record on your DNS provider to continue:
          </p>
          <div class="bg-f4 pd-10-20 fz-14 bd-1 d-flex mt-3">
            <div class="flex-1">
              <p class="el-label-1">Type</p>
              <p class="mt-3">{{ it.isA ? "A" : "CNAME" }}</p>
            </div>
            <div class="flex-1 ml-5">
              <p class="el-label-1">Name</p>
              <p class="mt-3">{{ it.pre }}</p>
            </div>
            <div class="flex-2 ml-5">
              <p class="el-label-1">Value</p>
              <p
                class="mt-3 hover-1 wb-all"
                v-clipboard="it.isA ? dns.ip : dns.cname"
                @success="$toast('Copied to clipboard !')"
              >
                {{ it.isA ? dns.ip : dns.cname }}
                <v-icon size="14" class="ml-1">mdi-content-copy</v-icon>
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      domain: "",
      list: null,
      adding: false,
      dns: {
        cname: "-",
        ip: "",
      },
    };
  },
  computed: {
    ...mapState({
      info: (s) => s.projectInfo,
      isFocus: (s) => s.isFocus,
    }),
  },
  watch: {
    isFocus(val) {
      if (val) {
        this.setRefresh();
        setTimeout(() => {
          this.setRefresh();
        }, 10e3);
      }
    },
  },
  mounted() {
    this.getList();
    this.getDnsName();
  },
  methods: {
    async getDnsName() {
      try {
        const { data } = await this.$http.get("/domain/server");
        this.dns = data;
      } catch (error) {
        //
      }
    },
    onUpdate() {
      this.$setState({
        noticeMsg: {
          name: "updateProject",
        },
      });
    },
    async setRefresh() {
      const rows = (this.list || []).filter((it) => !it.valid);
      for (const it of rows) {
        await this.onRefresh(it);
      }
    },
    async getList() {
      try {
        const { data } = await this.$http.get("/domain/list", {
          params: {
            projectId: this.info.id,
          },
        });
        this.list = data.content.map((it) => {
          const arr = it.domain.split(".");
          arr.pop();
          arr.pop();
          it.isA = !arr.length;
          it.pre = it.isA ? "@" : arr.join(".");
          // it.valid = 1
          return it;
        });
      } catch (error) {
        console.log(error);
      }
    },
    async onAdd() {
      try {
        if (!this.domain) return;
        if (!this.$regMap.domain.test(this.domain)) {
          return this.$alert(
            `The specified value "${this.domain}” is not a fully qualified domain name.`
          );
        }
        this.adding = true;
        await this.$http.post("/domain", {
          domain: this.domain,
          projectId: this.info.id,
        });
        this.domain = "";
        this.$toast("Added successfully");
        await this.getList();
        // console.log(data)
        this.onUpdate();
        this.setRefresh();
      } catch (error) {
        console.log(error);
      }
      this.adding = false;
    },
    async onRemove(it) {
      try {
        if (it.valid) {
          let html = `<div class="fz-15">${it.domain} will no longer be a production domain of this project.</div>
              <ul class="mt-3 fz-14 gray-6"><li>The domain will not be used in future production deployments</li>
              <li>The domain will be removed from your latest production deployment</li>
              <li>The domain is still owned by you</li>
              <li>Existing deployments will not be affected</li></ul>`;
          await this.$confirm(html, "Remove Domain from Project", {
            confirmText: "Remove",
          });
        } else {
          await this.$confirm(it.domain + " will be removed");
        }
        this.$set(it, "removing", true);
        await this.$http.delete("/domain/" + it.domainId);
        await this.getList();
        this.$toast("Removed successfully");
        this.onUpdate();
      } catch (error) {
        //
      }
      this.$set(it, "removing", false);
    },
    async onRefresh(it) {
      try {
        this.$set(it, "refreshing", true);
        const { data } = await this.$http.get("/domain/verify/" + it.domainId, {
          noTip: true,
        });
        if (data.success) {
          await this.getList();
          this.$toast(it.domain + " is valid now");
        }
      } catch (error) {
        //
      }
      this.$set(it, "refreshing", false);
    },
  },
};
</script>