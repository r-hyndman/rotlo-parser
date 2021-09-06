import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import auth from './modules/auth';
import report from './modules/report';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app,
    auth,
    report,
  },
});
