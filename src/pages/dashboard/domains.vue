<template>
  <div>
    <v-card outlined>
      <e-card-head-1 :title="$t(`${locales}Titele`)">
        <div>
          {{ $t(`${locales}Subhead`) }}
        </div>
      </e-card-head-1>
      <div class="pd-20">
        <div class="mb-5 ta-r">
          <v-btn small color="primary" @click="showPop = true">
            {{ $t(`${locales}Add`) }}
          </v-btn>
          <v-btn
            small
            color="error"
            class="ml-5"
            @click="onDelete"
            :loading="deleting"
            :disabled="selected.length == 0"
            v-if="list.length > 0"
          >
            {{ $t(`${locales}Delete`) }}
          </v-btn>
        </div>
        <v-data-table
          class="-elevation-1"
          v-model="selected"
          :loading="loading"
          :show-select="list.length > 0"
          item-key="domainId"
          :headers="headers"
          :items="list"
          :page.sync="page"
          :items-per-page.sync="pageSize"
        >
          <template v-slot:item.domain="{ item }">
            <v-chip :color="item.valid ? 'success' : 'error'" small 
              :to="`/project/${item.projectId}/settings?tab=1`">
              {{ item.domain }}
            </v-chip>
          </template>
        </v-data-table>
      </div>
    </v-card>

    <v-dialog v-model="showPop" max-width="600">
      <div class="pd-30">
        <h2>{{ $t(`${locales}AddDomain`) }}</h2>
        <v-window v-model="curStep">
          <v-window-item :value="0">
            <div class="gray mt-2">{{ $t(`${locales}SelectProjectAdd`) }}</div>
            <div class="bd-1 mt-6">
              <div v-if="!projects">
                <v-skeleton-loader type="article" />
              </div>
              <template v-else>
                <div class="d-flex al-c bdb-1">
                  <v-icon class="ml-4">mdi-magnify</v-icon>
                  <input
                    type="text"
                    v-model="keyword"
                    :placeholder="$t(`${locales}SearchForProjects`)"
                    class="flex-1 pd-10"
                    style="height: 54px; outline: none"
                  />
                </div>
                <div class="ov-a" style="max-height: 40vh">
                  <div
                    class="d-flex al-c pd-15"
                    :class="{
                      'bdt-1': i > 0,
                    }"
                    v-for="(it, i) in projList"
                    :key="i"
                  >
                    <v-icon>mdi-folder-outline</v-icon>
                    <span class="ml-2">{{ it.name }}</span>
                    <v-btn
                      small
                      color="primary"
                      class="ml-auto"
                      @click="onSelect(it)"
                      >{{ $t(`${locales}Select`) }}</v-btn
                    >
                  </div>
                </div>
                <div class="d-flex al-c bdt-1 pd-15 gray fz-15">
                  <v-icon>mdi-folder-plus-outline</v-icon>
                  <!-- <span class="ml-2">{{ $t(`${locales}YouCanAlso`) }}</span> -->
                  <a class="color-1 ml-1" href="#/new">{{
                    $t(`${locales}CreateNewProject`)
                  }}</a>
                </div>
              </template>
            </div>
          </v-window-item>
          <v-window-item :value="1">
            <div class="mt-5">
              <p>
                <b>{{ $t(`${locales}Project`) }}</b
                >：{{ chooseProj.name }}
              </p>
              <p class="gray">
                {{ $t(`${locales}EnterTheDomain`) }}
              </p>
            </div>
            <div class="mt-5">
              <v-text-field
                dense
                outlined
                autofocus
                v-model="domain"
                placeholder="mywebsite.com"
                @keyup.enter="onAdd"
              />
            </div>
          </v-window-item>
        </v-window>

        <div class="ta-c mt-8">
          <v-btn @click="showPop = false" small>{{
            $t(`${locales}Cancel`)
          }}</v-btn>
          <v-btn
            small
            color="primary"
            class="ml-6"
            v-if="curStep > 0"
            :loading="adding"
            @click="onAdd"
          >
            {{ $t(`${locales}Add`) }}
          </v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      locales: "dashboard.domains.",
      headers: [
        { text: this.$t(`dashboard.domains.Domain`), value: "domain" },
        {
          text: this.$t(`dashboard.domains.Nameservers`),
          value: "nameServers",
        },
        { text: this.$t(`dashboard.domains.CreateAt`), value: "createTime" },
      ],
      list: [],
      page: 1,
      pageSize: 10,
      selected: [],
      loading: false,
      showPop: false,
      curStep: 0,
      chooseProj: {},
      projects: null,
      adding: false,
      domain: "",
      deleting: false,
      keyword: "",
    };
  },
  computed: {
    projList() {
      return this.projects.filter((it) => {
        if (!this.keyword.trim()) return true;
        return new RegExp(this.keyword, "i").test(it.name);
      });
    },
  },
  watch: {
    showPop(val) {
      if (val) {
        this.curStep = 0;
        if (!this.projects) this.getProjects();
      }
    },
    selected(val) {
      console.log(val);
    },
    pageSize() {
      this.getList();
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    async onDelete() {
      try {
        let html = `The following domains will be permanently deleted along with associated <b>aliases</b> and <b>certs</b>. If the domain is used as Staging Domain it will be <b>cleared</b>. Are you sure you want to continue?`;
        html += '<div class="pd-10"></div>';
        const now = new Date();
        for (const it of this.selected) {
          const time = new Date(it.createAt * 1e3).toNiceTime(now);
          html += `<div class="mt-2 fz-14">${it.domain} <span class="fl-r gray">added ${time}</span></div>`;
        }
        await this.$confirm(html, "Delete Domains");
        const ids = this.selected.map((it) => it.domainId).join(",");
        this.deleting = true;
        await this.$http.delete("/domain/" + ids);
        await this.getList();
        this.$toast(this.selected.length + " domain(s) deleted successfully");
        this.selected = [];
      } catch (error) {
        //
      }
      this.deleting = false;
    },
    async getProjects() {
      try {
        const { data } = await this.$http.get("/project");
        this.projects = data;
      } catch (error) {
        this.$confirm(error.message, "Error", {
          confirmText: "Retry",
        }).then(() => {
          this.getProjects();
        });
      }
    },
    onSelect(it) {
      this.chooseProj = it;
      this.curStep = 1;
    },
    async onAdd() {
      try {
        if (!this.$regMap.domain.test(this.domain)) {
          return this.$alert(
            `The specified value “${this.domain}” is not a fully qualified domain name.`
          );
        }
        this.adding = true;
        const projectId = this.chooseProj.id
        await this.$http.post("/domain", {
          domain: this.domain,
          projectId,
        });
        this.domain = "";
        this.$toast("Added successfully");
        this.showPop = false;
        this.$router.push(`/project/${projectId}/settings?tab=1`)
        // this.getList();
      } catch (error) {
        console.log(error);
      }
      this.adding = false;
    },
    async getList() {
      try {
        this.loading = true;
        const { data } = await this.$http.get("/domain/list", {
          params: {
            page: this.page - 1,
            size: this.pageSize == -1 ? 20 : this.pageSize,
          },
        });
        this.list = data.content.map((it) => {
          it.createTime = new Date(it.createAt * 1e3).format();
          return it;
        });
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
  },
};
</script>