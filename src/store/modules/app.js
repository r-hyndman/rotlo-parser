const actions = {};

const getters = {
  app: (state) => {
    return state.app;
  },
};

const state = () => ({
  app: {
    name: {
      long: 'WarcraftLogs Parser',
      short: 'Parser',
    },
    guild: {
      long: 'Raiders of the Lost Orc',
      short: 'RotLO',
    },
    version: 'v0.3',
  },
});

const mutations = {};

export default {
  namespaced: true,
  actions,
  getters,
  state,
  mutations,
};
