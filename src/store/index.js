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
    actStatus: 2,
    connectAddr: "",
    netType: "",
    walletTip: "",
  },
  mutations: {
    [SET_DATA](state, data) {
      for (const key in data) {
        state[key] = data[key];
      }
    },
    setProject(_, info) {
      const data = { ...info };
      const { repo = {} } = data;
      repo.pathPre = `${repo.namespace}/${repo.name}`;
      data.repo = repo;
      const { name, projectId } = (data.config = data.buildConfig);
      delete data.buildConfig;
      data.name = name;
      data.id = projectId;
      setState({
        projectInfo: data,
      });
    },
  },
  actions: {
    async getProjectInfo({ commit }, id) {
      const { data } = await api.get("/project/" + id);
      commit("setProject", data);
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
  const isTouch = "ontouchstart" in window;
  setState({
    isFocus: true,
    isTouch,
  });
};

setInterval(() => {
  setState({
    nowDate: new Date(),
  });
}, 1e3);

export default store;
