const actions = {
  setToken: (context, token) => {
    context.commit('setToken', token);
  },
};

const getters = {
  token: (state) => {
    return state.token;
  },
};

const state = () => ({
  token: undefined,
});

const mutations = {
  setToken: (state, token) => {
    state.token = token;
  },
};

export default {
  namespaced: true,
  actions,
  getters,
  state,
  mutations,
};
