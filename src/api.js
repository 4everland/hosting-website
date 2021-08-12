import Vue from "vue";
import Axios from "axios";
import router from "./router";

const http = Axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
});

http.interceptors.request.use(
  (config) => {
    const { token } = localStorage;
    // config.params = config.params || {}
    if (token) {
      config.headers.common["token"] = token;
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (res) => {
    const data = res.data;
    const { noTip } = res.config;
    if (typeof data == "object" && data && "code" in data) {
      if (data.code != 200) {
        let msg = data.message || `${data.code} error`;
        Vue.prototype.$loading.close();
        // console.log(msg)
        if (data.code == 401 || [10024, 10023, 10008].includes(data.code)) {
          localStorage.clear();
          let { path = "" } = router.history.current || {};
          location.href = "index.html#/?to=" + path;
        } else if (!noTip) {
          setTimeout(() => {
            Vue.prototype.$alert(msg);
          }, 10);
        }
        throw new Error(msg);
      }
      if ("data" in data) {
        return data;
      }
    }
    return res;
  },
  (error) => {
    const { config = {}, data = {}, status, statusText } = error.response || {};
    console.log(error, status, statusText);
    let msg =
      data.message ||
      statusText ||
      (status ? `${config.url}：${status}` : error.message);
    if (msg == "Network Error") {
      msg =
        "A network error has occurred. Please check your connection and try again.";
    }
    if (status == 401) {
      router.replace("/");
    }
    if (msg) {
      Vue.prototype.$alert(msg);
    }
    return Promise.reject(error);
  }
);

Vue.prototype.$http = http;

export default http;
