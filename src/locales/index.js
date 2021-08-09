import Vue from "vue";
import VueI18n from "vue-i18n";

import en from "./en-US";
import zh from "./zh-CN";

Vue.use(VueI18n);

const messages = {
  "en-US": en,
  "zh-CN": zh,
};

let locale = "en-US";

export default new VueI18n({
  locale: locale,
  fallbackLocale: "en-US",
  messages,
});
