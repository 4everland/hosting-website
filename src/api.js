import Vue from "vue";
import Axios from "axios";
// import router from "./router";

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

function goLogin() {
  localStorage.token = "";
  delete localStorage.userInfo;
  localStorage.loginTo = location.hash;
  location.href = "index.html";
}

http.interceptors.response.use(
  (res) => {
    const data = res.data;
    const { noTip } = res.config;
    if (typeof data == "object" && data && "code" in data) {
      if (data.code != 200) {
        let msg = data.message || `${data.code} error`;
        Vue.prototype.$loading.close();
        // console.log(msg)
        if (data.code < 1e4) {
          goLogin();
        } else if (!noTip) {
          setTimeout(() => {
            Vue.prototype.$alert(msg).then(() => {
              if (
                data.code == 10016 ||
                /storage has reached the max/.test(msg)
              ) {
                location.href = "index.html";
              }
            });
          }, 10);
        }
        const error = new Error(msg);
        error.code = data.code;
        throw error;
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
        "A network error has occurred. Please check your connections and try again.";
    }
    if (status == 401) {
      goLogin();
    } else if (msg) {
      setTimeout(() => {
        Vue.prototype.$alert(msg).then(() => {
          if (msg == "Request aborted") {
            location.reload();
          }
        });
      }, 10);
    }
    error.code = data.code;
    return Promise.reject(error);
  }
);

Vue.prototype.$http = http;

export default http;
