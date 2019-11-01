<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<template>
  <div>
    <!-- Modal that retrieves and handles Top Up Information -->
    <b-modal
      id="topup-modal"
      centered
      title="Top Up"
      @show="modalStateReset"
      @hidden="modalStateReset"
      @ok="topupWallet"
    >
      <p class="my-4">How much would you like to top up to your wallet?</p>
      <form ref="form" @submit.stop.prevent="topupWallet">
        <b-form-group :state="amountState">
          <b-input-group prepend="$">
            <b-form-input
              @input="checkIfAmountValid"
              type="text"
              v-model="amountTopUp"
              :state="amountState"
              placeholder="00.00"
              aria-describedby="input-live-help input-live-feedback"
              required
            ></b-form-input>
          </b-input-group>
        </b-form-group>
      </form>
    </b-modal>
    <!-- Modal that retrieves and handles Transfer Information -->
    <b-modal
      id="transfer-modal"
      centered
      title="Transfer"
      @show="modalStateReset"
      @hidden="modalStateReset"
      @ok="transferAmount"
    >
      <p class="my-4">How much and to whom would you like to transfer?</p>
      <form ref="form" @submit.stop.prevent="transferAmount">
        <b-form-group :state="receiverEmailState && amountState">
          <b-input-group class="mb-2">
            <b-form-input
              type="email"
              v-model="receiver_email"
              @input="checkIfValidEmail"
              :state="receiverEmailState"
              placeholder="example@gmail.com"
              aria-describedby="input-live-help input-live-feedback"
              required
            ></b-form-input>
          </b-input-group>
          <b-input-group prepend="$" class="mb-2">
            <b-form-input
              @input="checkIfAmountValid"
              type="text"
              v-model="amountTopUp"
              :state="amountState"
              placeholder="00.00"
              aria-describedby="input-live-help input-live-feedback"
              required
            ></b-form-input>
          </b-input-group>
        </b-form-group>
      </form>
    </b-modal>
    <!-- Container responsible for holding UI Elements -->
    <b-container>
      <b-row class="my-4">
        <b-col class="my-4">
          <b-container class="mt-5">
            <b-row>
              <b-col>
                <span
                  class="border border-primary px-4 py-2 rounded"
                  style="font-size: 5em"
                >${{ this.$store.state.wallet.amount }}</span>
              </b-col>
            </b-row>
          </b-container>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="4" offset="4" align-self="center">
          <div class="border border-danger p-2" style="overflow-y: scroll; height: 200px">
            <p
              v-for="walletHistory in getTotalHistory()"
              v-bind:key="walletHistory.transaction_date + walletHistory.amount"
              v-b-tooltip.hover
              :title="() => formatTooltipText(walletHistory)"
              :style="formatWalletHistory(walletHistory)"
            >${{ walletHistory.amount }}</p>
          </div>
        </b-col>
      </b-row>
      <b-row class="my-3" align-v="end">
        <b-col class="my-3">
          <b-container class="my-3" fluid>
            <b-row>
              <b-col>
                <b-button
                  v-b-modal.topup-modal
                  variant="success"
                  size="lg"
                  style="font-size: 2em; margin: 3px;"
                >Top Up</b-button>
                <b-button
                  v-b-modal.transfer-modal
                  variant="danger"
                  size="lg"
                  style="font-size: 2em; margin: 3px;"
                >Transfer</b-button>
              </b-col>
            </b-row>
          </b-container>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import axios from "axios";
export default {
  methods: {
    getTotalHistory() {
      const walletHistory = this.$store.state.wallet.topupHistory
        .concat(this.$store.state.wallet.transferHistory)
        .concat(this.$store.state.wallet.backingHistory);

      walletHistory.sort(
        (trans1, trans2) =>
          new Date(trans1.transaction_date) - new Date(trans2.transaction_date)
      );
      return walletHistory;
    },
    checkIfValidEmail() {
      const splits = this.receiver_email.split(".");
      if (
        this.receiver_email === "" ||
        this.receiver_email === null ||
        this.receiver_email === undefined
      ) {
        this.receiverEmailState = null;
      } else if (
        this.receiver_email.includes("@") &&
        this.receiver_email.includes(".") &&
        splits.length >= 2 &&
        splits[1] !== ""
      ) {
        this.receiverEmailState = true;
      } else {
        this.receiverEmailState = false;
      }
    },
    formatTooltipText(transactionData) {
      const date = new Date(transactionData.transaction_date);
      var toolTipText = "";
      if (transactionData.type === "Topup") {
        toolTipText = `$${transactionData.amount} was topped up to the wallet`;
      } else if (transactionData.type === "TransferTo") {
        toolTipText = `$${parseFloat(transactionData.amount) *
          -1} was transferred to ${transactionData.email}`;
      } else if (transactionData.type === "TransferFrom") {
        toolTipText = `$${transactionData.amount} was transferred to you from ${transactionData.email}`;
      } else if (transactionData.type === "Backing") {
        toolTipText = `$${transactionData.amount} was used to back ${transactionData.project_name}`;
      }
      toolTipText =
        toolTipText +
        ` on ${date.getDate()}/${date.getMonth() +
          1}/${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.`;
      return toolTipText;
    },
    formatWalletHistory(transactionData) {
      if (parseFloat(transactionData.amount) > 0) {
        return {
          color: "green"
        };
      } else {
        return {
          color: "red"
        };
      }
    },
    checkIfAmountValid() {
      // For a blank input, no form validation is carried out.
      if (this.amountTopUp === null || this.amountTopUp === "") {
        this.amountState = null;
      } else {
        // If there is an input and there are non-numbered inputs.
        const nonNumberMatches = this.amountTopUp.match(/\D/gi);
        if (nonNumberMatches !== null && nonNumberMatches.length > 0) {
          // Checks for the following
          // - No more than 1 possible non-numbered character
          // - The 1 possible non-numbered character is "."
          // - If there is a "." the text following that is a number (not blank)
          // - Numbers after "." are of a max length of 2
          this.amountState =
            nonNumberMatches.length <= 1 &&
            (nonNumberMatches[0] === "." &&
              this.amountTopUp.split(".").length === 2 &&
              this.amountTopUp.split(".")[1] !== "" &&
              this.amountTopUp.split(".")[1].length <= 2)
              ? true
              : false;
        } else {
          // If there are only numbered inputs.
          this.amountState = true;
        }
      }
    },
    topupWallet() {
      if (
        this.amountState &&
        this.amountTopUp !== "" &&
        this.amountTopUp !== null
      ) {
        this.$store
          .dispatch("topUp", {
            email: this.$store.state.user.email,
            currentAmount: this.$store.state.wallet.amount,
            topupAmount: this.amountTopUp
          })
          .then(() => {
            this.$message("Amount Top-Up Success.");
          })
          .catch(() => {
            alert("Amount Top-Up Failed.");
          });
      }
    },
    transferAmount() {
      this.$store
        .dispatch("transfer", {
          email: this.$store.state.user.email,
          transferAmount: this.amountTopUp,
          receiverEmail: this.receiver_email
        })
        .then(() => {
          this.$message("Transfer Success");
        })
        .catch(() => {
          alert("Transfer Failed.");
        });
    },
    fetchData() {
      this.$store
        .dispatch("fetchData", {
          email: this.$store.state.user.email
        })
        .then(() => {
          this.$message("Data Fetch Success");
        })
        .catch(() => {
          alert("Data Fetch Failed.");
        });
    },
    modalStateReset() {
      (this.amountTopUp = ""),
        (this.amountState = null),
        (this.receiver_email = ""),
        (this.receiverEmailState = null);
    }
  },
  data() {
    return {
      amountTopUp: "",
      amountState: null,
      receiver_email: "",
      receiverEmailState: null
    };
  },
  created() {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData();
  }
};
</script>