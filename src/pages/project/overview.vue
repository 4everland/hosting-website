<style>
</style>

<template>
  <div>
    <v-card outlined>
      <e-card-head-1 :title="info.name || 'Loading'">
        <div class="">
          <v-icon color="#fff" size="16">mdi-github</v-icon>
          <a
            class="ml-1 u"
            style="color: inherit"
            v-if="info.repo"
            :href="`https://github.com/` + info.repo.pathPre"
            target="_blank"
          >
            {{ info.repo.pathPre }}
          </a>
        </div>
        <template #right>
          <v-btn
            small
            depressed
            color="primary"
            :disabled="!mainHref"
            :href="mainHref"
            target="_blank"
            v-if="info.id"
          >
            Visit
          </v-btn>
        </template>
      </e-card-head-1>

      <div class="pd-20">
        <div class="d-flex al-c flex-wrap">
          <div class="mr-auto">
            <div class="fz-20">Production Deployment</div>
            <div class="fz-14 mt-1 gray">
              The deployment that is available to your visitors
            </div>
          </div>
          <div
            v-if="info.id"
            class="d-flex al-c"
            :class="{
              'mt-4': $vuetify.breakpoint.mobile,
            }"
          >
            <v-btn small class="mr-5" :to="getLink('log')">
              View Build Logs
            </v-btn>
            <v-btn small :to="getLink('domain')"> View Domains </v-btn>
          </div>
        </div>

        <!-- :class="asMobile > -1 ? 'bdt-1 pt-5' : 'bd-1 pd-15'" -->
        <div class="mt-5" :class="asMobile ? 'pt-2' : 'bdt-1 pt-6'">
          <v-row>
            <v-col cols="12" md="6">
              <e-link :href="mainHref">
                <v-img
                  class="bd-1 bdrs-5"
                  :src="$getImgSrc(info.screenshot)"
                  lazy-src="img/proj-bg-def.png"
                  :height="asMobile ? 160 : 300"
                ></v-img>
              </e-link>
            </v-col>
            <v-col cols="12" md="6" class="fz-14">
              <template v-if="info.id">
                <div class="label-1">Deployment</div>
                <div v-if="info.latest" class="line-1">
                  <e-domain :val="info.latest.domain"></e-domain>
                </div>

                <div class="label-1 mt-6">Domains</div>
                <div v-for="(it, i) in info.domains.slice(0, 2)" :key="i">
                  <e-domain :val="info.domains[i].domain"></e-domain>
                  <v-menu
                    v-if="i == 1 && info.domains.length > 2"
                    offset-y
                    open-on-hover
                  >
                    <template v-slot:activator="{ attrs, on }">
                      <span v-bind="attrs" v-on="on" class="ml-5">
                        +{{ info.domains.length - 2 }}
                      </span>
                    </template>
                    <div class="bg-white pd-10 fz-14">
                      <div
                        class="pd-5"
                        v-for="(row, j) in info.domains.slice(2)"
                        :key="j"
                      >
                        <e-domain :val="info.domains[2 + j].domain"></e-domain>
                      </div>
                    </div>
                  </v-menu>
                </div>

                <div class="d-flex mt-6">
                  <div class="flex-1">
                    <div class="label-1">State</div>
                    <e-status :val="state"></e-status>
                  </div>
                  <div class="flex-1">
                    <div class="label-1">Created</div>
                    <div>
                      <e-time>{{ info.repo.updateAt }}</e-time>
                    </div>
                  </div>
                </div>

                <div class="label-1 mt-6">Branch</div>
                <e-branch></e-branch>

                <div class="mt-2">
                  <e-commit :info="info.latest.commits"></e-commit>
                </div>
              </template>
              <v-skeleton-loader v-else type="article" />
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
    const { id } = this.$route.params;
    return {
      id,
    };
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      info: (s) => s.projectInfo,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    mainHref() {
      const [row] = this.info.domains || [];
      if (!row) return "";
      return "//" + row.domain;
    },
    state() {
      const { state = "Wait" } = this.info.latest || {};
      return state.toLowerCase();
    },
  },
  methods: {
    getLink(name) {
      const { latest } = this.info;
      let link;
      if (name == "log") {
        link = `/build/${this.info.name}/${latest.taskId}/overview`;
      } else if (name == "domain") {
        link = `/project/${this.id}/settings?tab=1`;
      }
      return link;
    },
  },
};
</script>