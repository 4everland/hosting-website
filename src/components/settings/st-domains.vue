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
        v-model="domain"
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
        <div class="pd-20">
          <div class="d-flex al-c">
            <h3 class="mr-auto">{{ it.domain }}</h3>
            <!-- <v-chip small color="#E09975" class="ml-3">
            <span class="white-0">production</span>
          </v-chip> -->
            <v-btn
              v-if="!it.valid"
              small
              class="mr-4"
              @click="onRefresh(it)"
              :loading="it.refreshing"
            >
              Refresh
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
          <div class="d-flex al-c mt-2">
            <v-icon :color="it.valid ? 'success' : 'error'" size="18">
              mdi-{{ it.valid ? "check-circle" : "information" }}
            </v-icon>
            <span class="ml-1 fz-13" :class="it.valid ? 'color-suc' : 'red-1'">
              {{ it.valid ? "Valid Configuration" : "Invalid Configuration" }}
            </span>
          </div>
        </div>
        <div class="pd-20 bdt-1" v-if="!it.valid">
          <div class="fz-14">
            <b>A Record </b>
            <span class="ml-3">Nameserver</span>
          </div>
          <p class="gray mt-1 fz-13">
            Set the following record on your DNS provider to continue:
          </p>
          <div class="bg-f4 pd-10-20 fz-14 bd-1 d-flex mt-6">
            <div class="flex-1">
              <p class="el-label-1">Type</p>
              <p class="mt-3">CNAME</p>
            </div>
            <div class="flex-1">
              <p class="el-label-1">Name</p>
              <p class="mt-3">{{ it.pre }}</p>
            </div>
            <div class="flex-2">
              <p class="el-label-1">Value</p>
              <p
                class="mt-3 hover-1"
                v-clipboard="dnsName"
                @success="$toast('copied')"
              >
                {{ dnsName }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      domain: "",
      list: null,
      adding: false,
      dnsName: /test|vercel|localhost/.test(location.origin)
        ? "cname.foreverland.xyz"
        : "cname.4everland-dns.com",
    };
  },
  computed: {
    info() {
      return this.$store.state.projectInfo;
    },
  },
  mounted() {
    this.getList();
    this.getDnsName();
  },
  methods: {
    async getDnsName() {
      try {
        const { data } = await this.$http.get("/domain/cname");
        this.dnsName = data;
      } catch (error) {
        //
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
          it.pre = !arr.length ? "@" : arr.join(".");
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
          return this.$alert("invalid domain");
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
      } catch (error) {
        console.log(error);
      }
      this.adding = false;
    },
    async onRemove(it) {
      try {
        if (it.valid) {
          let html = `<div class="fz-15">${it.domain} will no longer be a production domain of this project.</div>
              <ul class="mt-3 fz-14 gray-6"><li>The domain will not be applied to future production deployments</li>
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
      } catch (error) {
        //
      }
      this.$set(it, "removing", false);
    },
    async onRefresh(it) {
      try {
        this.$set(it, "refreshing", true);
        const { data } = await this.$http.get("/domain/verify/" + it.domainId);
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