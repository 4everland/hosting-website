<style lang="scss">
.bug-bounty {
  h4 {
    margin-top: 20px;
    color: #333;
    font-size: 16px;
  }
}
</style>

<template>
  <div class="wrap-1 bug-bounty">
    <div class="con-3 bg-white bd-1">
      <img
        src="img/bg/bug-bounty-bg.png"
        class="wh100p d-b hover-1"
        @click="onReport"
      />
      <div class="pd-20">
        <h3>4EVERLAND Bug Bounty Campaign</h3>
        <div class="mt-5 fz-14 gray-6 lh-2">
          <div v-html="html"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    html() {
      return this.$t("common.BugBounty")
        .split(/\n/)
        .map((txt) => {
          if (/^<.+>$/.test(txt.trim())) return txt;
          return `<div>${txt}</div>`;
        })
        .join("");
    },
  },
  methods: {
    onReport() {
      this.$setState({
        noticeMsg: {
          name: "feedback",
          data: { label: "Bug Bounty" },
        },
      });
    },
  },
};
</script>