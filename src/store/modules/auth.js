import axios from "axios";

export default {
  state: {
    isLoggedIn: false
  },
  mutations: {
    userLogin(state) {
      state.isLoggedIn = true;
    },

    userLogout(state) {
      state.isLoggedIn = false;
    }
  },
  actions: {
    async login({ commit }, payload) {
      await axios.post("/login", payload).then(responsePacket => {
        const email = responsePacket.data.email;
        const full_name = responsePacket.data.full_name;
        const phone_number = responsePacket.data.phone_number;
        const amount = responsePacket.data.amount;

        commit("updateUser", { email, full_name, phone_number });
        commit("initializeWallet", { amount });
        commit("userLogin");
      });
    },

    logout({ commit }) {
      commit("updateUser", null);
      commit("userLogout");
    }
  }
};
