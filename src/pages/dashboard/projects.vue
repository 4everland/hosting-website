<template>
  <div>
    <e-storage ref="stor"></e-storage>

    <div class="mb-5 d-flex al-c">
      <v-alert
        v-if="badProjects.length"
        class="mr-5 mt-3"
        type="warning"
        outlined
        border="left"
        icon="mdi-alert-circle-outline"
        dense
        dismissible
      >
        <span class="fz-14"
          >The project{{ badProjects.length > 1 ? "s" : "" }}
          <b>{{ badProjects.join(", ") }}</b>
          {{ badProjects.length > 1 ? "have" : "has" }} been removed due to the
          violation issue. Please check your email for prompt action.</span
        >
      </v-alert>

      <v-btn class="ml-auto" small depressed color="primary" @click="addNew">{{
        $t(`${locales}NewProject`)
      }}</v-btn>
    </div>
    <v-row v-if="!list">
      <v-col cols="12" :md="6" :lg="4" v-for="i in 3" :key="i">
        <v-skeleton-loader max-width="450" type="card"></v-skeleton-loader>
      </v-col>
    </v-row>
    <div
      v-else-if="!list.length"
      class="pb-10 ta-c bg-white bdrs-5 ov-h m-auto shadow-1"
      style="max-width: 750px"
    >
      <v-img
        src="img/empty/proj.png"
        class="m-auto mt-10"
        max-width="220"
      ></v-img>
      <!-- <img src="img/empty/act-proj.png" class="m-auto w100p" v-else /> -->
      <div class="gray mt-10">{{ $t(`${locales}NoDeployments`) }}</div>
      <div class="mt-6">
        <v-btn outlined color="primary" @click="addNew" :loading="loading">{{
          $t(`${locales}GetStart`)
        }}</v-btn>
      </div>
    </div>
    <v-row v-else>
      <!-- :md="6"  -->
      <v-col cols="12" :md="6" :lg="4" v-for="it in list" :key="it.id">
        <v-card outlined class="hover-c1 trans-200 ov-h">
          <a :href="`#/project/${it.name}/${it.id}/overview`" class="pos-r d-b">
            <v-img
              :src="$getImgSrc(it.production.screenshot)"
              lazy-src="img/empty/cover.jpg"
              height="155"
            ></v-img>
            <div class="bg-black-3 pos-mask" v-if="it.online === false">
              <b class="pos-center white-0 fz-20">Removed</b>
            </div>
          </a>

          <div class="d-flex al-c pl-4 pr-4 pt-3 bdt-1">
            <a
              :href="`#/project/${it.name}/${it.id}/overview`"
              class="mr-auto b line-1 fz-18 fw-b"
            >
              {{ it.name }}
            </a>

            <v-btn
              class="mr-3"
              icon
              v-if="it.production.domain"
              :to="`/statistics/${it.name}/${it.id}`"
            >
              <v-icon :color="$color1">mdi-file-chart-outline</v-icon>
            </v-btn>
            <v-btn
              small
              depressed
              color="primary"
              :disabled="!it.production.state"
              :href="'//' + it.production.domain"
              target="_blank"
            >
              {{ $t(`${locales}Visit`) }}
            </v-btn>
          </div>

          <v-card-subtitle class="pt-2">
            <div class="" style="min-height: 60px">
              <e-build-line
                type="Production"
                :name="it.name"
                :info="it.production"
              ></e-build-line>
              <e-build-line
                type="Latest"
                :name="it.name"
                :info="it.latest"
              ></e-build-line>
            </div>
          </v-card-subtitle>

          <v-divider></v-divider>

          <a
            :href="`https://github.com/${it.repo.namespace}/${it.repo.name}`"
            target="_blank"
            class="pd-12-15 fz-14 d-flex al-c b"
            v-if="it.repo"
          >
            <v-icon :color="$color1" size="18">mdi-github</v-icon>
            <span class="ml-1 line-1"
              >{{ it.repo.namespace }}/{{ it.repo.name }}</span
            >
            <span class="ml-auto gray shrink-0">
              <e-time pre="Updated">{{ it.repo.updateAt }}</e-time>
            </span>
          </a>
          <a
            v-else
            :href="`#/project/${it.name}/${it.id}/settings?tab=2`"
            class="pd-12-15 fz-14 d-flex al-c"
          >
            <v-icon :color="$color1" size="18">mdi-github</v-icon>
            <span class="ml-1 gray color-1">Connect To Git</span>
          </a>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      locales: "dashboard.projects.",
      list: null,
      loading: false,
      lastState: "",
      badProjects: [],
    };
  },
  computed: {
    ...mapState({
      isFocus: (s) => s.isFocus,
      buildInfo: (s) => s.buildInfo,
      actStatus: (s) => s.actStatus,
    }),
  },
  watch: {
    buildInfo({ data }) {
      if (data.state != this.lastState && this.list) {
        const item = this.list.filter((it) => {
          return it.lastest && it.lastest.taskId == data.taskId;
        })[0];
        if (!item) {
          if (this.hasNew) return;
          this.hasNew = true;
        } else {
          this.hasNew = false;
        }
        console.log(this.hasNew, data.taskId, data.state);
        this.lastState = data.state;
        this.getList();
      }
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    async addNew() {
      const needCheck = await this.$refs.stor.checkStorage();
      if (needCheck) return;
      this.$router.push("/new");
    },
    onChart() {
      this.$toast("chart");
    },
    onVisit(it) {
      const { domain } = it.production;
      window.open("//" + domain);
    },
    async getList() {
      try {
        this.loading = true;
        const { data } = await this.$http.get("/project");
        this.badProjects = data
          .filter((it) => it.online === false)
          .map((it) => it.name);
        this.list = data;
        // console.log(data)
      } catch (error) {
        //
      }
      this.loading = false;
    },
  },
};
</script>