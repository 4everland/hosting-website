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
