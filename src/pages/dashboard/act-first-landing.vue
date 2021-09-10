<style lang="scss">
.act-p1 {
  min-height: 200px;
  background: linear-gradient(180deg, #353748 0%, #20242c 100%);
  .act-gift1 {
    right: -20px;
    top: -120px;
    width: 300px;
  }
  .reward-item {
    min-width: 156px;
    height: 150px;
    &.done {
      background: #fff url(/img/icon/act-checked.png) right bottom no-repeat;
      background-size: 36px;
    }
  }
}
.act-wrap1 {
  .bd-1b {
    border: 1px solid #4a96fa;
  }
  table {
    background: #1e2226;
    border-spacing: 0;
    font-size: 15px;
    thead {
      background: linear-gradient(180deg, #464766 0%, #222631 100%);
    }
    tbody {
      font-size: 14px;
    }
    td {
      padding: 10px;
    }
    tr:nth-child(even) {
      background: #282d3b;
    }
  }
}
</style>
<template>
  <div class="white-0 act-wrap1">
    <div
      class="act-p1 bdrs-10 pos-r"
      :style="{
        'margin-top': asMobile ? '150px' : '240px',
      }"
    >
      <img
        src="img/bg/act-gift.png"
        class="pos-a act-gift1"
        :style="asMobile ? 'width: 240px;top:-100px;' : ''"
      />
      <div class="pd-20 pl-0 pr-0">
        <div class="ml-5 d-flex al-c">
          <h3 class="mr-2">My Rewards</h3>
          <v-btn
            plain
            color="white"
            small
            :loading="loading"
            @click="onRefresh"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </div>
        <div class="ov-a mt-5 gray-3 ta-c">
          <div class="ml-5 nowrap d-flex">
            <div
              class="bg-white bdrs-5 pt-5 pb-5 d-ib reward-item mr-6 flex-1"
              :class="{
                done: it.done,
              }"
              v-for="it in list"
              :key="it.type"
              v-show="!it.hide || it.done"
            >
              <div v-if="it.loaded">
                <p class="fw-b">
                  {{ numberComma(it.reward) }}
                  <span class="fz-12">T-4EVER</span>
                </p>
                <p class="gray fz-12 mt-1">{{ it.title }}</p>
                <div class="mt-8">
                  <v-btn
                    @click="onClick(it)"
                    color="primary"
                    small
                    :disabled="it.disabled"
                    v-if="it.btnTxt"
                    >{{ it.btnTxt }}</v-btn
                  >
                </div>
              </div>
              <div v-else>
                <v-skeleton-loader
                  type="card-heading, list-item-two-line"
                ></v-skeleton-loader>
              </div>
            </div>
          </div>
        </div>
        <div class="ta-c mt-10">
          <v-btn
            @click="$toast('dev')"
            rounded
            style="background: linear-gradient(90deg, #fa4adc 0%, #de4343 100%)"
          >
            <span class="white-0 d-ib pl-3 pr-3"
              >Available claim : 100,000 4EVER</span
            >
          </v-btn>
        </div>
      </div>
    </div>

    <act-dapp ref="dapp" />

    <act-invite ref="invite" />
  </div>
</template>

<script>
export default {
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    userInfo() {
      return this.$store.state.userInfo;
    },
    isFocus() {
      return this.$store.state.isFocus;
    },
  },
  data() {
    return {
      loading: false,
      list: [
        {
          type: "OLD_USER_DEPLOY",
          title: "Loyal follower rewards",
          hide: true,
          txt2: "Deployed",
        },
        {
          type: "DEPLOY",
          title: "Deploy rewards",
          txt: "Deploy",
          txt2: "Deployed",
          link: "/new",
        },
        {
          type: "BIND_DOMAIN",
          title: "Domain rewards",
          txt: "Add Domain",
          txt2: "Domain Added",
          link: "/dashboard/domains",
        },
        {
          type: "INVITE_REWARD",
          title: "Invite rewards",
          txt: "Invite",
        },
        {
          type: "VIEWER_REWARD",
          title: "Viewer rewards",
          txt: "Copy Domain",
        },
      ],
    };
  },
  watch: {
    isFocus(val) {
      if (val) {
        this.onRefresh();
      }
    },
  },
  created() {
    this.getList();
  },
  methods: {
    numberComma(source, length = 3) {
      source = String(source).split(".");
      source[0] = source[0].replace(
        new RegExp("(\\d)(?=(\\d{" + length + "})+$)", "ig"),
        "$1,"
      );
      return source.join(".");
    },
    async onRefresh() {
      await this.getList();
      this.$refs.dapp.getList();
      this.$refs.invite.getList();
    },
    onClick(row) {
      let { type, link } = row;
      console.log(type);
      const dapp = this.$refs.dapp;
      if (type != "INVITE_REWARD" && !dapp.list.length) {
        link = "/new";
      }
      if (link) this.$navTo(link);
      else if (type == "INVITE_REWARD") {
        this.$refs.invite.onInvite();
      } else if (type == "VIEWER_REWARD") {
        window.scrollTo(0, dapp.$el.offsetTop);
        dapp.setTipCopy();
      }
    },
    async getList() {
      try {
        this.loading = true;
        const { data } = await this.$http.get("/activity/rewards");
        for (const row of data) {
          const item = this.list.filter((it) => it.type == row.type)[0];
          if (!item) continue;
          row.loaded = true;
          row.btnTxt = item.txt;
          if (row.done && item.txt2) {
            row.btnTxt = item.txt2;
            row.disabled = true;
          }
          Object.assign(item, row);
        }
      } catch (error) {
        //
      }
      this.loading = false;
    },
  },
};
</script>