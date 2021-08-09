<template>
  <div class="con-3 mt-8">
    <v-card outlined>
      <div class="pd-20">
        <v-timeline dense align-top>
          <v-timeline-item small v-for="(it, i) in list" :key="i">
            <div class="color-1 fw-b">{{ it.time }}</div>
            <div class="mt-3 mb-5">
              <div v-html="it.con"></div>
            </div>
            <!-- <v-divider></v-divider> -->
          </v-timeline-item>
        </v-timeline>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          time: "2021-7-22",
          con: "Preview version",
        },
        {
          time: "2021-6-20",
          con: "First Commit",
        },
      ],
    };
  },
};
</script>