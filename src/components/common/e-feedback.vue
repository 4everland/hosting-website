<template>
  <div>
    <v-dialog eager v-model="showPop" max-width="650">
      <div class="pos-r">
        <h2 class="pd-15 fz-18 ta-c">{{ title }}</h2>
        <div
          class="pos-a top-0 right-0 pd-15 z-100 hover-1"
          @click="showPop = false"
        >
          <v-icon>mdi-close</v-icon>
        </div>
      </div>
      <div class="bdt-1 pd-30">
        <v-text-field
          prepend-icon="mdi-email"
          class="mt-3"
          outlined
          persistent-placeholder
          v-model="form.email"
          label="Email"
          placeholder="Your email"
        />
        <v-textarea
          prepend-icon="mdi-note-text-outline"
          outlined
          persistent-placeholder
          v-model="form.description"
          rows="4"
          label="Description"
          placeholder="Your feedback..."
        />
        <!-- <v-file-input
          v-model="files"
          label="Pictures"
          accept="image/*"
          counter
          multiple
          outlined
        ></v-file-input> -->
        <e-upload v-model="files"></e-upload>

        <div class="ta-c mt-5">
          <v-btn color="primary" :loading="loading" @click="onSubmit"
            >Submit</v-btn
          >
        </div>
      </div>
    </v-dialog>
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
  },
  data() {
    return {
      showPop: false,
      title: "Feedback",
      form: {
        email: "",
        description: "",
      },
      files: [],
      fileList: [],
      loading: false,
    };
  },
  watch: {
    noticeMsg({ name, data }) {
      if (name == "feedback" && !this.showPop) {
        this.showPop = true;
        this.title = data ? data.label : "Feedback";
      }
    },
    showPop() {
      this.form.email = this.userInfo.email;
    },
  },
  methods: {
    async onSubmit() {
      const body = { ...this.form };
      let msg = "";
      if (!this.$regMap.email.test(body.email)) {
        msg = "Invalid Email";
      } else if (!body.description) {
        msg = "No Description";
      } else if (body.description.length > 10) {
        msg = "Description: 10000 chars at maximum";
      }
      if (msg) {
        return this.$toast(msg);
      }

      const form = new FormData();
      for (const key in body) {
        form.append(key, body[key]);
      }
      for (const file of this.files) {
        form.append("files", file);
      }
      try {
        this.loading = true;
        await this.$http.post("/feedback/upload", form);
        this.showPop = false;
        this.$toast("Your feedback is received.");
        this.form.description = "";
        this.files = [];
      } catch (error) {
        //
      }
      this.loading = false;
    },
  },
};
</script>