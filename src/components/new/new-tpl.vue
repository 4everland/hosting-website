<template>
  <v-card outlined :min-height="minHeight">
    <div class="pd-20">
      <div class="fz-20 fw-b mr-10">
        {{ $t(`${locales}CloneTemplate`) }}
      </div>
      <div class="mt-6 gray fz-15">
        {{ $t(`${locales}GetStartedwithTemplate`) }}
      </div>
      <v-row class="mt-4">
        <v-col cols="6" v-for="(it, i) in tplList" :key="i">
          <a
            class="bd-1 d-b hover-1 pos-r pd-20"
            style="height: 188px"
            :style="{
              background: `-webkit-linear-gradient(-65deg, ${it.bg1}, #fff 50%)`,
            }"
            :href="getTplLink(it)"
            v-ripple
          >
            <h2 class="gray-3 fz-16 mb-2">{{ it.name }}</h2>
            <p class="gray" :class="asMobile ? 'fz-12' : 'fz-14'">
              {{ it.solution }}
            </p>
            <img
              :src="it.logo"
              class="pos-a right-0 btm-0 pa-3"
              :style="{
                height: asMobile ? '55px' : '70px',
              }"
            />
          </a>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    minHeight: null,
  },
  data() {
    return {
      locales: "new.index.",
    };
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    tplList() {
      const arr = ["vue", "create-react-app", "nextjs", "nuxtjs"];
      return arr.map((name) => {
        return this.$getFramework(name);
      });
    },
  },
  methods: {
    getTplLink(it) {
      const src =
        "https://github.com/4everland/project-templates/tree/main/examples/" +
        it.slug;
      return `#/new/clone-flow?s=${encodeURIComponent(src)}&t=${it.name}`;
    },
  },
};
</script>