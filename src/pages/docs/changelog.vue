<template>
  <div class="wrap-1">
    <div class="con-3">
      <v-card outlined>
        <div class="pr-8">
          <v-timeline dense align-top>
            <v-timeline-item small v-for="(it, i) in list" :key="i">
              <v-img
                :src="it.img"
                class="w100p mb-4 bdrs-10 bd-1"
                max-height="360"
                min-height="300"
                v-if="it.img"
              />
              <div class="color-1 fw-b">
                {{ it.time.toDate().format("date") }}
              </div>
              <div class="mt-3 mb-5">
                <div class="lh-2 gray-6 fz-14" v-html="it.con"></div>
              </div>
              <!-- <v-divider></v-divider> -->
            </v-timeline-item>
          </v-timeline>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  data() {
    return {
      list: [
        {
          time: "2021-10-11",
          img: "img/log/2021-10-11.jpeg",
          con: `<h3>More details in 4EVER-HOSTING have improved.</h3>
          <ul>
          <li>Set the corresponding browser title according to the page route </li>
          <li>Added a prompt of A record or AAAA record conflict when adding a first-level domain name in the project settings</li>
          </ul>`,
        },
        {
          time: "2021-9-27",
          img: "img/log/2021-9-27.jpeg",
          con: `<h3>Improvements on the statistics page and breadcrumb navigation is added.</h3>
          <ul>
          <li>Breadcrumb navigation added on project details and build page</li>
          <li>Added refresh data button added on  the Statistics page </li>
          <li>Optimized UI of the statistics page, added different colour for retention rate</li>
          </ul>`,
        },
        {
          time: "2021-9-13",
          img: "img/log/2021-9-13.jpeg",
          con: `<h3>Optimized the deployment process.</h3>
          <ul>
          <li>Optimized the construction process and added branch selection function</li>
          <li>Optimized the build process and increased the Deploy Hooks option</li>
          <li>Added commits history to the project details page, and specific commits can be selected for deployment</li>
          </ul>`,
        },
        {
          time: "2021-9-6",
          img: "img/log/2021-9-6.png",
          con: `<h3>Intercom is now up. Now you can speak to us in no time and also we have optimized couples details such as import Git repository etc.</h3>
          <ul>
          <li>Optimized the Build command, scroll down for the default scripts in package.json</li>
          <li>Optimized Git repository search</li>
          <li>Optimized Git Repo import process and support branch selection </li>
          <li>Set the Clone Flow page defaults to project name to the git name and added branch display</li>
          <li>Integrated Intercom</li>
          </ul>
          `,
        },
        {
          time: "2021-8-31",
          img: "img/log/2021-8-31.jpg",
          con: `<h3>We have done more functional support and detailed optimization for 4EVER-HOSTING, as follows:</h3>
<ul>
<li>Support multiple GitHub accounts login and also org Github accounts. </li>
<li>Enable search on Github projects and display in pages.</li>
<li>Added project titles on the build page and with links direct to project details.</li>
<li>Added the 'go to last line' button to return the bottom of the build logs. (This button shows the number of new build logs while building).</li>
<li>Fixed no updates on output contents issue after rebuild.</li>
<li>Updated default background image and changelog icon.</li>
<li>Optimized line chart on the statistics page.</li>
</ul>`,
        },
        {
          time: "2021-8-16",
          img: "https://www.4everland.org/imgs/blogs/Hosting_Launch.png",
          con: `
<h3>4EVER-HOSTING is officially launched, you can deploy and host your website through "HOSTING" with one click. The specific features are as follows.</h3>
<ul>
<li>Authorize login via github</li>
<li>Connect to a github repository</li>
<li>Select a framework or custom build command, output dir, root dir</li>
<li>Add environment variables</li>
<li>Execute the compilation, log view real-time build process</li>
<li>Access to the build project website</li>
<li>A new account to receive trial credits and view credit usage (40GB storage + unlimited flow)</li>
<li>Support for project templates, clone any github repository, support for subfolders</li>
<li>Access to any imported project to: check build history, statistics (PV/UV/retention), change compilation configuration, customize domain name, configure environment variables, configure webhooks, etc.</li>
<li>Support for viewing Docs documentation</li>
<li>Support for automated content risk identification and review services</li>
<li>Support for Feedback and reporting features</li>
</ul>
`,
        },
      ],
    };
  },
};
</script>