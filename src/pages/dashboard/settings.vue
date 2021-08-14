<template>
  <v-card outlined>
    <div class="pd-30">
      <div class="bd-1">
        <div class="pd-20">
          <h3>Your Username</h3>
          <div class="gray mt-1 fz-14">This is your username in 4EVERLAND.</div>
          <div class="mt-8 d-flex" style="max-width: 500px">
            <v-text-field outlined dense v-model="username"></v-text-field>
            <v-btn
              color="primary"
              :loading="saving == 'username'"
              @click="onSave('username')"
              :disabled="userInfo.username == username || !username"
              class="ml-4"
              style="margin-top: 2px"
            >
              Save
            </v-btn>
          </div>
        </div>
        <div class="pd-10-20 bdt-1 bg-f8 d-flex al-c">
          <div class="gray fz-12 mr-auto">
            Please use 32 characters at maximum.
          </div>
        </div>
      </div>

      <!-- <div class="bd-1 mt-8">
        <div class="pd-20">
          <h3>Your Email</h3>
          <div class="gray mt-1 fz-14">Please enter the email address.</div>
          <div class="mt-8 d-flex" style="max-width: 500px">
            <v-text-field outlined dense v-model="email"></v-text-field>
            <v-btn
              color="primary"
              :loading="saving == 'email'"
              @click="onSave('email')"
              :disabled="userInfo.email == email || !email"
              class="ml-4"
              style="margin-top: 2px"
            >
              Save
            </v-btn>
          </div>
        </div>
        <div class="pd-10-20 bdt-1 bg-f8 d-flex al-c">
          <div class="gray fz-12 mr-auto">
            We will email you to verify the change.
          </div>
        </div>
      </div> -->

      <div class="bd-1 mt-8">
        <div class="pd-20">
          <h3>Delete Personal Account</h3>
          <div class="gray mt-1 fz-14">
            Permanently delete your Personal Account and all of its contents
            from the 4everland platform. This action is not reversible, so
            please continue to act with caution.
          </div>
        </div>
        <div class="pd-10-20 bdt-1 bg-f8 d-flex al-c">
          <v-btn
            color="error"
            small
            class="ml-auto"
            @click="onDelete"
            :loading="deleting"
          >
            Delete Account
          </v-btn>
        </div>
      </div>
    </div>
  </v-card>
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
  },
  data() {
    const { username, email } = this.$store.state.userInfo || {};
    return {
      username,
      email,
      saving: false,
      deleting: false,
    };
  },
  watch: {
    userInfo() {
      // this.username = this.userInfo.username
    },
  },
  mounted() {
    // console.log(this.userInfo)
  },
  methods: {
    async onDelete() {
      try {
        let html =
          "4everland will delete all of your projects, as well as all their deployments, domains, SSL certificates, activity, and all other resources belonging to your Personal Account.";
        html +=
          '<div class="bg-warning pd-10-20 fz-14 mt-3"><b>Warning</b>: This action is not reversible. Please be certain.</div>';
        const { username } = this.userInfo;
        await this.$prompt(html, "Delete Personal Account", {
          confirmText: "Delete",
          confirmTextAttrs: {
            color: "error",
            text: false,
          },
          inputAttrs: {
            label: `Enter your name \`${username}\` to continue`,
            rules: [
              (v) => v == username || "The text you entered didn't match.",
            ],
            required: true,
          },
          input2Attrs: {
            label: `Type \`delete my account\` To verify`,
            rules: [
              (v) =>
                v == "delete my account" ||
                "The text you entered didn't match.",
            ],
            required: true,
          },
        });
        this.$loading();
        this.deleting = true;
        // await this.$sleep(500)
        await this.$http.delete("/user");
        localStorage.clear();
        this.$loading.close();
        this.$alert("Personal account deleted successfully").then(() => {
          location.href = "index.html";
        });
      } catch (error) {
        console.log(error);
        this.$loading.close();
      }
      this.deleting = false;
    },
    async onSave(key) {
      try {
        const val = this[key];
        if (key == "email" && !this.$regMap.email.test(val)) {
          return this.$toast("Invalid Email");
        }
        this.saving = key;
        await this.$http.put("/user", {
          [key]: val,
        });
        this.$setState({
          noticeMsg: {
            name: "updateUser",
          },
        });
      } catch (error) {
        //
      }
      this.saving = false;
    },
  },
};
</script>