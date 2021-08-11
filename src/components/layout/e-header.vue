<template>
  <div class="z-100">
    <v-app-bar :app="false" :color="$bg1" dark>
      <a href="/">
        <e-logo class="d-b"></e-logo>
        <!-- <img src="img/icon.svg" style="height: 30px" class="d-b" /> -->
      </a>
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
              <v-icon size="16" class="mr-1" v-if="it.icon"
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
                <span class="fz-15">{{ sub.label }}</span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>
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
    links() {
      let links = [
        {
          label: "Changelog",
          to: "/changelog",
        },
        {
          label: "Docs",
          href: "https://docs.hosting.4everland.org/guide/",
        },
      ];
      const { username } = this.userInfo;
      if (username) {
        let feedback = {
          label: "Contact",
          icon: "message-processing-outline",
          // name: "feedback",
          subs: [
            {
              label: "Bug Bounty",
              to: "/bug-bounty",
            },
            {
              label: "Feedback",
              name: "feedback",
            },
            {
              label: "Report",
              name: "feedback",
            },
          ],
        };
        if (this.asMobile) {
          feedback = feedback.subs.slice(0, 2)
          links = feedback.concat(links)
        }
        else links.unshift(feedback);
        const subs = [
          {
            label: "Settings",
            title: username,
            to: "/dashboard/settings",
          },
          {
            label: "Logout",
            name: "logout",
          },
        ];
        if (this.asMobile) links = links.concat(subs);
        else
          links.push({
            label: username,
            icon: "github",
            color: "#4A96FA",
            outlined: true,
            subs,
          });
      } else {
        links.push({
          label: "Login",
          name: "login",
          color: "#4A96FA",
          outlined: true,
        });
      }
      return links;
    },
  },
  data() {
    return {};
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
        localStorage.clear();
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
      // this.$notice(it.label)
    },
  },
};
</script>