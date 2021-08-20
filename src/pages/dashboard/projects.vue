<template>
  <div>
    <e-storage ref="stor"></e-storage>
    <div class="ta-r mb-5">
      <v-btn small depressed color="primary" @click="addNew">{{
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
      class="ta-c bg-white bdrs-5"
      style="padding: 50px 0"
    >
      <v-img src="img/empty/no-proj.png" max-width="220" class="m-auto"></v-img>
      <div class="gray mt-10">{{ $t(`${locales}NoDeployments`) }}</div>
      <div class="mt-6">
        <v-btn outlined color="primary" @click="addNew" :loading="loading">{{
          $t(`${locales}GetStart`)
        }}</v-btn>
      </div>
    </div>
    <v-row v-else>
      <!-- :md="6"  -->
      <v-col cols="12" :md="6" :lg="4" v-for="(it, i) in list" :key="i">
        <v-card outlined class="hover-c1 trans-200 ov-h">
          <a :href="`#/project/${it.id}/overview`">
            <v-img
              :src="$getImgSrc(it.production.screenshot)"
              lazy-src="img/proj-bg-def.png"
              height="155"
            ></v-img>
          </a>

          <div class="d-flex al-c pl-4 pr-4 pt-3 bdt-1">
            <a
              :href="`#/project/${it.id}/overview`"
              class="mr-auto b line-1 fz-18 fw-b"
            >
              {{ it.name }}
            </a>

            <v-btn
              class="mr-3"
              icon
              v-if="it.production.domain"
              :to="'/dashboard/statistics?appId=' + it.id"
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
    };
  },
  computed: {
    ...mapState({
      isFocus: (s) => s.isFocus,
      buildInfo: (s) => s.buildInfo,
    }),
  },
  watch: {
    buildInfo({ data }) {
      // console.log(data.state);
      if (data.state != this.lastState) {
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