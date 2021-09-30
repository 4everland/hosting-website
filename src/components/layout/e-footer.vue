<style>
.e-footer {
  color: #7f8489;
}
</style>

<template>
  <div class="e-footer wrap-0">
    <div class="con-1">
      <div class="d-flex flex-wrap">
        <div
          class="mb-10 ml-2"
          :class="{
            'mr-10': !$vuetify.breakpoint.mobile,
          }"
        >
          <!-- <img src="img/icon.svg" style="height: 30px" /> -->
          <a href="/">
            <e-logo class="d-b" :height="50"></e-logo>
          </a>
          <div class="mt-10">
            <v-btn
              icon
              :href="item.href"
              target="_blank"
              class="mr-2"
              v-for="(item, i) in links"
              :key="i"
            >
              <v-icon>{{ item.icon }}</v-icon>
            </v-btn>
          </div>
        </div>

        <div class="flex-grow-1">
          <v-row>
            <v-col cols="6" lg="3" md="3" v-for="(item, i) in menus" :key="i">
              <div class="ml-3 mb-5 fz-14 white-8">{{ item.title }}</div>
              <div v-for="(sub, j) in item.subs" :key="j">
                <v-btn
                  text
                  small
                  color="#999"
                  :to="sub.to"
                  :href="sub.href"
                  :target="/^http/.test(sub.href) ? '_blank' : ''"
                  @click="onClick(sub)"
                >
                  {{ sub.label }}
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
      <div class="fz-12 mt-10 ml-3">
        Copyright © 2021 4everland Inc. All rights reserved
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "./e-footer";

export default {
  mixins: [mixin],
  methods: {
    onClick(it) {
      const { notice } = it;
      console.log(it);
      if (notice) {
        this.$setState({
          noticeMsg: {
            name: notice,
          },
        });
      }
    },
  },
};
</script>