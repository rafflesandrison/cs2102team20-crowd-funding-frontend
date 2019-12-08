import axios from "axios";

export default {
  state: {
    email: null,
    full_name: null,
    phone_number: null
  },
  mutations: {
    updateUser(state, { email, full_name, phone_number }) {
      state.email = email;
      state.full_name = full_name;
      state.phone_number = phone_number;
    }
  },
  actions: {}
};
