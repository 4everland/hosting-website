import Vue from "vue";
import Vuex from "vuex";
import api from "../api";

Vue.use(Vuex);

const SET_DATA = "setData";

const store = new Vuex.Store({
  state: {
    nowDate: new Date(),
    ...getWH(),
    isTouch: "ontouchstart" in window,
    isFocus: true,
    appInfo: {
      title: "",
    },
    token: localStorage.token,
    loginSta: 0,
    userInfo: JSON.parse(localStorage.userInfo || "{}"),
    noticeMsg: {},
    alertInfo: {},
    projectInfo: {},
    buildInfo: {},
  },
  mutations: {
    [SET_DATA](state, data) {
      for (const key in data) {
        state[key] = data[key];
      }
    },
  },
  actions: {
    async getProjectInfo(_, id) {
      const { data } = await api.get("/project/" + id);
      const { repo = {} } = data;
      repo.pathPre = `${repo.namespace}/${repo.name}`;
      data.repo = repo;
      const { name } = (data.config = data.buildConfig);
      data.name = name;
      delete data.buildConfig;
      // if(!data.config) {
      //   const { data: config } = await api.get('/project/config/' + id)
      //   data.config = config
      // }
      data.id = id;
      setState({
        projectInfo: data,
      });
      return data;
    },
  },
});

export const setState = (Vue.prototype.$setState = (data) => {
  store.commit(SET_DATA, data);
});

function getWH() {
  const { clientWidth, clientHeight } = document.documentElement;
  return {
    clientWidth,
    clientHeight,
  };
}
window.onresize = () => {
  setState({
    ...getWH(),
  });
};
window.onblur = () => {
  setState({
    isFocus: false,
  });
};
window.onfocus = () => {
  setState({
    isFocus: true,
  });
};

setInterval(() => {
  setState({
    nowDate: new Date(),
  });
}, 1e3);

export default store;
