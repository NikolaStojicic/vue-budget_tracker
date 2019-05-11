import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from 'vuex-persist'

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
  key: 'budget_tracker',
  storage: localStorage
})

export default new Vuex.Store({
  plugins: [vuexPersist.plugin],
  state: {
    jwt: '',
    username: '',
    hostIp: '',
    refresh_jwt: ''
  },
  mutations: {
    set_jwt: (state, token) => {
      state.jwt = token;
      localStorage.jwt = token;
    },
    set_refresh_jwt: (state, token) => {
      state.refresh_jwt = token;
      localStorage.refresh_jwt = token;
    },
    set_username: (state, username) => {
      state.username = username;
      localStorage.username = username;
    },
    set_host_ip: (state, ip) => {
      state.hostIp = ip;
      localStorage.hostIp = ip;
    },
    clear_state: (state) => {
      state.jwt = '';
      state.username = '';
      state.hostIp = '';
      state.refresh_jwt = '';
    }
  },
  actions: {},
  getters: {
    getJwt: state => {
      return state.jwt
    },
    getRefreshJwt: state => {
      return state.refresh_jwt
    },
    getUsername: state => {
      return state.username
    },
    getHostIp: state => {
      return state.hostIp;
    }
  }
});