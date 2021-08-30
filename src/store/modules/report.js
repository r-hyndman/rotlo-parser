import Vue from 'vue';

const actions = {
  setReport: (context, reportId) => {
    context.commit('setCurrentReport', reportId);
  },
  addReport: (context, report) => {
    context.commit('addReport', report);
  },
};

const getters = {
  report: (state) => {
    return state.currentReport;
  },
  reports: (state) => {
    return state.reports;
  },
};

const state = () => ({
  reports: {},
  currentReport: {},
});

const mutations = {
  setCurrentReport: (state, reportId) => {
    state.currentReport = state.reports[reportId];
  },
  addReport: (state, report) => {
    Vue.set(state.reports, report.id, report);
    state.currentReport = state.reports[report.id];
  },
};

export default {
  namespaced: true,
  actions,
  getters,
  state,
  mutations,
};
