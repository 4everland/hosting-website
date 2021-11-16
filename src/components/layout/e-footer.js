export default {
  data() {
    return {
      menus: [
        {
          title: this.$t("common.Frameworks"),
          subs: [
            {
              label: "Vue.js",
              to: "/solution/vue",
            },
            {
              label: "Create React App",
              to: "/solution/create-react-app",
            },
            {
              label: "Next.js",
              to: "/solution/nextjs",
            },
            {
              label: "Nuxt.js",
              to: "/solution/nuxtjs",
            },
            {
              label: "Gatsby",
              to: "/solution/gatsby",
            },
            {
              label: "Angular",
              to: "/solution/angular",
            },
            // {
            //   label: 'More Frameworks',
            //   to: '/templates',
            // },
          ],
        },
        {
          title: this.$t("common.Resources"),
          subs: [
            {
              label: this.$t("common.Documentation"),
              href: "https://docs.hosting.4everland.org/guide/",
            },
            {
              label: this.$t("common.Changelog"),
              to: "/changelog",
            },
            {
              label: this.$t("common.Bugbounty"),
              to: "/bug-bounty",
            },
            {
              label: this.$t("common.Brand"),
              href: "file/logo.zip",
            },
          ],
        },
        {
          title: this.$t("common.Project"),
          subs: [
            {
              label: this.$t("common.Home"),
              href: "https://www.4everland.org/",
            },
            {
              label: this.$t("common.Blog"),
              href: "https://www.4everland.org/blog",
            },
            {
              label: this.$t("common.Roadmap"),
              href: "https://www.4everland.org/#roadmap",
            },
            {
              label: this.$t("common.Whitepaper"),
              href: "https://4everland.org/4everland-whitepaper-en.pdf",
            },
            {
              label: this.$t("common.ContactUs"),
              href: "mailto:contact@4everlan.org",
            },
          ],
        },
        {
          title: this.$t("common.Legal"),
          subs: [
            {
              label: this.$t("common.PrivacyPolicy"),
              href: "https://www.4everland.org/privacy-policy",
            },
            {
              label: this.$t("common.TermOfService"),
              href: "https://www.4everland.org/term-of-use",
            },
            // {
            //   label: 'Trademark Policy',
            // },
          ],
        },
      ],
      links: [
        {
          icon: "mdi-github",
          href: "https://github.com/4everland",
          color: "#4b4b4b",
        },
        {
          icon: "mdi-twitter",
          href: "https://twitter.com/4everland_org",
          color: "#60aadb",
        },
        {
          href: "https://t.me/org_4everland",
          icon:
            "M9.78,18.65L10.06,14.42L17.74,7.5C18.08,7.19 17.67,7.04 17.22,7.31L7.74,13.3L3.64,12C2.76,11.75 2.75,11.14 3.84,10.7L19.81,4.54C20.54,4.21 21.24,4.72 20.96,5.84L18.24,18.65C18.05,19.56 17.5,19.78 16.74,19.36L12.6,16.3L10.61,18.23C10.38,18.46 10.19,18.65 9.78,18.65Z",
          color: "#41a0d7",
        },
        {
          icon: "mdi-reddit",
          href: "https://www.reddit.com/r/4everland/",
          color: "#eb443b",
        },
        {
          icon:
            "M12,0 C5.3671875,0 0,5.3671875 0,12 C0,18.6328125 5.3671875,24 12,24 C18.6328125,24 24,18.6328125 24,12 C24,5.3671875 18.6328125,0 12,0 Z M9.2953125,17.7140625 L9.2953125,17.7140625 L9.2953125,17.7140625 L5.1046875,15.6609375 C5.0625,15.61875 4.9734375,15.5296875 4.9734375,15.440625 L4.9734375,5.934375 L9.2484375,8.071875 L9.2484375,17.7140625 L9.2953125,17.7140625 Z M9.8203125,13.1765625 L9.8203125,8.859375 L13.659375,15.0984375 L9.8203125,13.1765625 Z M11.521875,10.6453125 L14.4890625,5.8875 L18.8109375,8.0671875 L14.3578125,15.2671875 L11.521875,10.6453125 Z M18.9375,17.7140625 L18.9375,17.7140625 L18.9375,17.7140625 L14.746875,15.6609375 L18.9375,8.859375 L18.9375,17.7140625 Z",
          href: "https://4everland.medium.com/",
          color: "#4b4b4b",
        },
        {
          icon: "mdi-discord",
          href: "https://discord.gg/Cun2VpsdjF",
          color: "#714bdf",
        },
        {
          icon: "mdi-email",
          href: "mailto:info@4everland.org",
          color: "#79675b",
        },
      ],
    };
  },
};
