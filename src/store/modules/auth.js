import axios from "axios";

export default {
  state: {
    currentUser: {
      email: null,
      full_name: null,
      phone_number: null,
      amount: null
    },
    isLoggedIn: false
  },
  mutations: {
    userLogin(state, { email, full_name, phone_number, amount }) {
      state.currentUser = { email, full_name, phone_number, amount };
      state.isLoggedIn = true;
    },

    userLogout(state) {
      state.currentUser = null;
      state.isLoggedIn = false;
    }
  },
  actions: {
    async login({ commit }, payload) {
      await axios.post("/login", payload).then(responsePacket => {
        commit("userLogin", responsePacket.data);
      });
    },

    logout({ commit }) {
      commit("userLogout");
    }
  }
};
