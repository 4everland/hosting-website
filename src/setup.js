import Vue from "vue";
import "./css/style.scss";
import "./components";
import "./api";
import VueClipboards from "vue-clipboards";
import frameworks from "./assets/frameworks.json";
import router from "./router";

Vue.use(VueClipboards);

Vue.prototype.$sleep = (msec = 300) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, msec);
  });
};

Vue.prototype.$navTo = (url) => {
  if (/^https?:/.test(url)) {
    window.open(url);
  } else if (/:/.test(url)) {
    location.href = url;
  } else {
    router.push(url);
  }
};

Vue.prototype.$setIcon = function(url = "favicon.ico") {
  document.querySelector('link[rel="icon"]').href = url;
};

Vue.prototype.$getImgSrc = function(src) {
  if (!src) src = "img/empty/cover.jpg";
  else if (!/^http/.test(src)) src = process.env.VUE_APP_BASE_URL + src;
  return src;
};

Vue.prototype.$getFramework = (name) => {
  let obj = frameworks.filter((it) => it.slug == name)[0];
  if (!obj) {
    obj = frameworks[frameworks.length - 1];
  }
  return obj;
};

Vue.prototype.$openWindow = (url) => {
  if ("ontouchstart" in window) location.href = url;
  else
    window.open(
      url,
      "n1",
      "height=600,width=900,top=50,left=200,toolbar=no,menubar=no"
    );
};

Vue.prototype.$color1 = "#4A96FA";
Vue.prototype.$bg1 = "#1e2226";

Vue.prototype.$regMap = {
  email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
  domain: /(\w+\.)+\w{2,10}/,
};
