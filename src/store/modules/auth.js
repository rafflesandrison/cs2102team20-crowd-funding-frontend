import axios from 'axios'

export default {
  state: {
    currentUser: null,
    isLoggedIn: false
  },
  mutations: {
    userLogin(state, {email}) {
      state.currentUser = email;
      state.isLoggedIn = true;
    },

    userLogout(state) {
      state.currentUser = null;
      state.isLoggedIn = false;
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