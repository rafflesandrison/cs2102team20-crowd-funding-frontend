import axios from 'axios'

export default {
  state: {
    amount: 0,
  },
  mutations: {
    updateAmount(state, value) {
        state.amount = value;
    }
  },
  actions: {
    async login({commit}, payload) {
      alert("This was dispatched");
      await axios.post('/login', payload)
        .then(() => {
          commit('userLogin', payload)
        })
    },

    logout({commit}) {
      commit('userLogout');
    }
  }
}