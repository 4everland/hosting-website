export default {
  data() {
    return {
      menus: [
        {
          title: "Frameworks",
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
          title: "Resources",
          subs: [
            {
              label: "Documentation",
              href: "https://docs.hosting.4everland.org/guide/",
            },
            {
              label: "Changelog",
              to: "/changelog",
            },
            {
              label: "Feedback",
              notice: "feedback",
            },
          ],
        },
        {
          title: "Project",
          subs: [
            {
              label: "Home",
              href: "https://www.4everland.org/",
            },
            {
              label: "Blog",
              href: "https://www.4everland.org/blog",
            },
            {
              label: "Roadmap",
              href: "https://www.4everland.org/#roadmap",
            },
            {
              label: "Whitepaper",
              href:
                "https://www.4everland.org/4everland-whitepaper-en(Draft%20V0.0.2).pdf",
            },
            {
              label: "Contact us",
              href: "mailto:contact@4everlan.org",
            },
          ],
        },
        {
          title: "Legal",
          subs: [
            {
              label: "Privacy Policy",
              href: "https://www.4everland.org/privacy-policy",
            },
            {
              label: "Term of Service",
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
        },
        {
          icon: "mdi-twitter",
          href: "https://twitter.com/4everland_org",
        },
        {
          icon: "mdi-telegram",
          href: "https://t.me/org_4everland",
        },
        {
          icon: "mdi-reddit",
          href: "https://www.reddit.com/user/4everland_org/",
        },
        {
          icon:
            "M12,0 C5.3671875,0 0,5.3671875 0,12 C0,18.6328125 5.3671875,24 12,24 C18.6328125,24 24,18.6328125 24,12 C24,5.3671875 18.6328125,0 12,0 Z M9.2953125,17.7140625 L9.2953125,17.7140625 L9.2953125,17.7140625 L5.1046875,15.6609375 C5.0625,15.61875 4.9734375,15.5296875 4.9734375,15.440625 L4.9734375,5.934375 L9.2484375,8.071875 L9.2484375,17.7140625 L9.2953125,17.7140625 Z M9.8203125,13.1765625 L9.8203125,8.859375 L13.659375,15.0984375 L9.8203125,13.1765625 Z M11.521875,10.6453125 L14.4890625,5.8875 L18.8109375,8.0671875 L14.3578125,15.2671875 L11.521875,10.6453125 Z M18.9375,17.7140625 L18.9375,17.7140625 L18.9375,17.7140625 L14.746875,15.6609375 L18.9375,8.859375 L18.9375,17.7140625 Z",
          href: "https://4everland.medium.com/",
        },
        {
          icon: "mdi-discord",
          href: "https://discord.gg/sxtHDvvpuT",
        },
        {
          icon: "mdi-email",
          href: "mailto:info@4everland.org",
        },
      ],
    };
  },
};
