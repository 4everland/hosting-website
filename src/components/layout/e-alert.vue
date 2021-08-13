<template>
  <div>
    <v-snackbar
      color="primary"
      timeout="2000"
      v-bind="noticeInfo.attrs"
      v-model="showSnackbar"
    >
      {{ noticeInfo.content }}
      <template #action>
        <v-btn text @click="showSnackbar = false"> close </v-btn>
      </template>
    </v-snackbar>

    <v-dialog
      v-model="showLoading"
      max-width="260px"
      :persistent="!alertInfo.maskClick"
    >
      <v-card>
        <div class="ta-c pd-30">
          <v-progress-circular
            :size="50"
            color="primary"
            indeterminate
          ></v-progress-circular>
          <div class="mt-5" v-if="alertInfo.title">
            {{ alertInfo.title }}
          </div>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="showAlert"
      v-show="!!alertInfo.content"
      max-width="460"
      :persistent="alertInfo.showCancel"
    >
      <v-card>
        <v-card-title>
          <v-icon :color="iconColor" class="mr-2">
            {{ iconName }}
          </v-icon>
          {{
            alertInfo.title
              ? alertInfo.title
              : alertInfo.showCancel
              ? "Confirm"
              : "Alert"
          }}
        </v-card-title>
        <v-card-text>
          <div class="fz-16" v-html="alertInfo.content"></div>
          <div class="mt-8" v-if="alertInfo.showInput">
            <v-form ref="form" lazy-validation>
              <v-text-field
                v-model="inputVal"
                autofocus
                dense
                v-bind="alertInfo.inputAttrs"
                @keyup.enter="hideAlert(1)"
              ></v-text-field>
              <v-text-field
                class="mt-6"
                v-if="alertInfo.input2Attrs"
                v-model="inputVal2"
                dense
                v-bind="alertInfo.input2Attrs"
                @keyup.enter="hideAlert(1)"
              ></v-text-field>
            </v-form>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            color="#666"
            v-if="alertInfo.showCancel"
            @click="hideAlert(0)"
          >
            {{ alertInfo.cancelText || "Cancel" }}
          </v-btn>
          <v-btn color="primary" text @click="hideAlert(1)">
            {{ alertInfo.confirmText || "OK" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      alertInfo: (s) => s.alertInfo,
    }),
    iconName() {
      const { type, icon } = this.alertInfo;
      if (icon) return icon;
      return type == "success" ? "mdi-check-circle" : "mdi-alert-circle";
    },
    iconColor() {
      const { type, iconColor } = this.alertInfo;
      return iconColor || type || "warning";
    },
  },
  data() {
    return {
      showAlert: false,
      showLoading: false,
      showSnackbar: false,
      inputVal: "",
      inputVal2: "",
      noticeInfo: {},
    };
  },
  watch: {
    alertInfo(info) {
      if (info.type == "loading") {
        this.showLoading = info.isLoading;
      } else if (info.type == "snackbar") {
        this.showSnackbar = true;
      } else this.showAlert = true;
    },
  },
  created() {
    const showModal = (config) => {
      return new Promise((resolve, reject) => {
        if (config.showInput) {
          this.inputVal = config.defaultValue || "";
        }
        this.$setState({
          alertInfo: {
            ...config,
            success(e) {
              resolve(e);
            },
            fail(e) {
              reject(e);
            },
          },
        });
      });
    };
    Vue.prototype.$loading = (title, opts = {}) => {
      return showModal({
        title,
        maskClick: true,
        ...opts,
        type: "loading",
        isLoading: true,
      });
    };
    Vue.prototype.$loading.close = () => {
      return showModal({
        type: "loading",
        isLoading: false,
      });
    };

    Vue.prototype.$alert = (content, title, opts = {}) => {
      return showModal({
        title,
        content,
        ...opts,
      });
    };
    Vue.prototype.$confirm = (content, title, opts = {}) => {
      return showModal({
        title,
        content,
        showCancel: true,
        ...opts,
      });
    };
    Vue.prototype.$prompt = (content, title, opts = {}) => {
      return showModal({
        title,
        content,
        showCancel: true,
        showInput: true,
        ...opts,
      });
    };
    Vue.prototype.$toast = Vue.prototype.$notice = (
      content,
      attrs = {},
      opts = {}
    ) => {
      this.showSnackbar = false;
      this.noticeInfo = {
        type: "snackbar",
        content,
        attrs,
        ...opts,
      };
      this.showSnackbar = true;
    };
  },
  methods: {
    async hideAlert(isOk) {
      const { success, fail, showInput } = this.alertInfo;
      if (isOk) {
        let body = {};
        if (showInput) {
          const valid = this.$refs.form.validate();
          if (!valid) {
            // fail(new Error('incorrent input'))
            return;
          }
          body.value = this.inputVal;
        }
        if (success) success(body);
      } else {
        if (fail) fail();
      }
      this.showAlert = false;
    },
  },
};
</script>