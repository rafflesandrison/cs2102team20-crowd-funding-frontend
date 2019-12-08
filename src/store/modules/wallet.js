import axios from "axios";

export default {
  state: {
    amount: null,
    topupHistory: [],
    transferHistory: [],
    backingHistory: []
  },
  mutations: {
    initializeWallet(state, { amount }) {
      state.amount = amount;
    },
    updateWallet(
      state,
      { amount, topupHistory, transferHistory, backingHistory }
    ) {
      state.amount = amount;
      state.topupHistory =
        topupHistory === undefined || topupHistory === null ? [] : topupHistory;
      state.transferHistory =
        transferHistory === undefined || transferHistory === null
          ? []
          : transferHistory;
      state.backingHistory =
        backingHistory === undefined || backingHistory === null
          ? []
          : backingHistory;
    }
  },
  actions: {
    async fetchData({ commit }, payload) {
      await axios.post("/wallet/retrieve", payload).then(responsePacket => {
        const amount = responsePacket.data.amount;
        const topupHistory = responsePacket.data.topupHistory;
        const backingHistory = responsePacket.data.backingHistory;
        const transferHistory = responsePacket.data.transferHistory;

        commit("updateWallet", {
          amount,
          topupHistory,
          transferHistory,
          backingHistory
        });
      });
    },
    async topUp({ commit }, payload) {
      await axios.post("/wallet/topup", payload).then(responsePacket => {
        const amount = responsePacket.data.amount;
        const topupHistory = responsePacket.data.topupHistory;
        const backingHistory = responsePacket.data.backingHistory;
        const transferHistory = responsePacket.data.transferHistory;

        commit("updateWallet", {
          amount,
          topupHistory,
          transferHistory,
          backingHistory
        });
      });
    },
    async transfer({ commit }, payload) {
      await axios.post("/wallet/transfer", payload).then(responsePacket => {
        const amount = responsePacket.data.amount;
        const topupHistory = responsePacket.data.topupHistory;
        const backingHistory = responsePacket.data.backingHistory;
        const transferHistory = responsePacket.data.transferHistory;

        commit("updateWallet", {
          amount,
          topupHistory,
          transferHistory,
          backingHistory
        });
      });
    }
  }
};
