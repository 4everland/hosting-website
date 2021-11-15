<template>
  <div class="z-100">
    <v-app-bar :app="false" :color="$bg1" dark>
      <a href="/">
        <e-logo class="d-b"></e-logo>
        <!-- <img src="img/icon.svg" style="height: 30px" class="d-b" /> -->
      </a>

      <a
        class="fz-17 ml-5 white-8 line-1"
        :href="titleInfo.link"
        v-if="titleInfo.title"
        >{{ titleInfo.title }}</a
      >

      <v-spacer></v-spacer>
      <template v-if="asMobile">
        <v-menu class="z-1000" offset-y min-width="130">
          <template v-slot:activator="{ attrs, on }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
              <!-- <v-icon>mdi-menu</v-icon> -->
            </v-btn>
          </template>
          <v-list>
            <div v-for="(it, i) in links" :key="i">
              <div class="gray ml-4 mt-2 mb-1" v-if="it.title">
                <v-icon size="16">mdi-github</v-icon>
                {{ it.title }}
              </div>
              <v-list-item link :href="it.href" :to="it.to" @click="onMenu(it)">
                <v-list-item-title>
                  <!-- <v-icon size="16" v-if="it.icon">mdi-{{it.icon}}</v-icon> -->
                  <span class="fz-15">{{ it.label }}</span>
                </v-list-item-title>
              </v-list-item>
            </div>
          </v-list>
        </v-menu>
      </template>
      <template v-else>
        <v-menu
          class="z-1000"
          offset-y
          open-on-hover
          v-for="(it, i) in links"
          :key="i"
        >
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              :color="it.color || $bg1"
              class="ml-5"
              :outlined="it.outlined"
              :href="it.href"
              :to="it.to"
              :target="/^http/.test(it.href) ? '_blank' : ''"
              @click="onMenu(it)"
              v-bind="attrs"
              v-on="on"
              :class="it.outlined ? '' : 'op-6'"
            >
              <v-img
                v-if="it.img"
                :src="it.img"
                width="16"
                height="16"
                class="bdrs-100 mr-1"
              ></v-img>
              <v-icon size="16" class="mr-1" v-else-if="it.icon"
                >mdi-{{ it.icon }}</v-icon
              >
              <span class="">{{ it.label }}</span>
              <v-icon v-if="it.subs">mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list v-if="it.subs">
            <v-list-item
              link
              :to="sub.to"
              @click="onMenu(sub)"
              v-for="(sub, j) in it.subs"
              :key="j"
            >
              <v-list-item-title>
                <v-icon size="16" class="mr-1" v-if="sub.icon">
                  mdi-{{ sub.icon }}
                </v-icon>
                <span class="fz-15">{{ sub.label }}</span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <e-meta-connect v-if="userInfo.username"></e-meta-connect>
    </v-app-bar>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      noticeMsg: (s) => s.noticeMsg,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    links() {
      let links = [
        {
          label: this.$t("common.Changelog"),
          to: "/changelog",
        },
        {
          label: this.$t("common.Doc"),
          href: "https://docs.hosting.4everland.org/guide/",
        },
      ];
      const { username, avatar } = this.userInfo;
      if (username) {
        let feedback = {
          label: this.$t("common.Contact"),
          icon: "message-processing-outline",
          // name: "feedback",
          subs: [
            {
              label: this.$t("common.Bugbounty"),
              to: "/bug-bounty",
              icon: "bug-outline",
            },
            {
              label: this.$t("common.Report"),
              name: "feedback",
              icon: "alert-octagon-outline",
            },
          ],
        };
        if (this.asMobile) {
          feedback = feedback.subs;
          links = feedback.concat(links);
        } else links.unshift(feedback);
        const subs = [
          {
            label: "Collections",
            title: username,
            to: "/collections",
          },
          {
            label: "Referral",
            to: "/user/refer",
          },
          {
            label: this.$t("common.Settings"),
            // title: username,
            to: "/dashboard/settings",
          },
          {
            label: this.$t("common.Logout"),
            name: "logout",
          },
        ];
        // if (this.$inDev)
        //   subs.splice(1, 0, );
        if (this.asMobile) links = links.concat(subs);
        else
          links.push({
            label: username,
            icon: "github",
            img: avatar,
            color: "#4A96FA",
            outlined: true,
            subs,
          });
      } else {
        const login = {
          label: "Login",
          name: "login",
          color: "#4A96FA",
          outlined: true,
        };
        if (this.$route.path == "/") {
          login.color = "#BBC2C9";
        }
        links.push(login);
      }
      return links;
    },
  },
  data() {
    return {
      titleInfo: {},
    };
  },
  watch: {
    noticeMsg({ name, data = {} }) {
      if (name == "setTitle") {
        this.titleInfo = data;
        if (data.title) {
          document.title = `${data.title} · ${this.$docTitle}`;
        }
      }
    },
  },
  methods: {
    onMenu(it) {
      const { name } = it;
      if (name == "feedback") {
        this.$setState({
          noticeMsg: {
            name: "feedback",
            data: it,
          },
        });
      }
      if (name == "logout") {
        localStorage.token = "";
        delete localStorage.userInfo;
        location.href = "index.html";
      } else if (name == "login") {
        const { path } = this.$route;
        if (path == "/")
          this.$setState({
            noticeMsg: {
              name: "login",
            },
          });
        else location.href = "index.html";
      }
    },
  },
};
</script>