<template>
  <div class="wrap-1">
    <div class="con-3">
      <v-card outlined>
        <div class="pd-20">
          <v-timeline dense align-top>
            <v-timeline-item small v-for="(it, i) in list" :key="i">
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
          time: "2021-8-16".toDate().format("date"),
          con: `
<p class="gray-3">4EVER-HOSTING is officially launched, you can deploy and host your website through "HOSTING" with one click. The specific features are as follows.</p>
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