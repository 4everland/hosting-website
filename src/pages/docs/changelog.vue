<template>
  <div class="wrap-1">
    <div class="con-3">
      <v-card outlined>
        <div class="pd-20">
          <v-timeline dense align-top>
            <v-timeline-item small v-for="(it, i) in list" :key="i">
              <v-img
                :src="it.img"
                class="w100p mb-4 bdrs-10 bd-1"
                max-height="380"
                v-if="it.img"
              />
              <div class="color-1 fw-b">{{ it.time }}</div>
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
  data() {
    return {
      list: [
        {
          time: "August 31, 2021",
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
          time: "2021-8-16".toDate().format("date"),
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