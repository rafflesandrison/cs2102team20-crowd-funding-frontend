<template>
  <div>
    <!-- Modal that retrieves and handles Top Up Information -->
    <b-modal id="topup-modal" centered title="Top Up" @ok="handleSubmit">
      <p class="my-4">How much would you like to top up to your wallet?</p>
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group :state="amountTopUpState">
          <b-input-group prepend="$">
            <b-form-input
              @input="checkIfAmountValid"
              type="text"
              v-model="amountTopUp"
              :state="amountTopUpState"
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
                >${{ this.amount }}</span>
              </b-col>
            </b-row>
          </b-container>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="4" offset="4" align-self="center">
          <div class="border border-danger p-2" style="overflow-y: scroll; height: 200px">
            <p v-for="topUp in this.previousTopUps" v-bind:key="topUp">{{ topUp }}</p>
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
                  style="font-size: 2em"
                >Top Up</b-button>
              </b-col>
            </b-row>
          </b-container>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
export default {
  methods: {
    checkIfAmountValid() {
      // For a blank input, no form validation is carried out.
      if (this.amountTopUp === null || this.amountTopUp === "") {
        this.amountTopUpState = null;
      } else {
        // If there is an input and there are non-numbered inputs.
        const nonNumberMatches = this.amountTopUp.match(/\D/gi);
        if (nonNumberMatches !== null && nonNumberMatches.length > 0) {
          // Checks for the following
          // - No more than 1 possible non-numbered character
          // - The 1 possible non-numbered character is "."
          // - If there is a "." the text following that is a number (not blank)
          // - Numbers after "." are of a max length of 2
          this.amountTopUpState =
            nonNumberMatches.length <= 1 &&
            (nonNumberMatches[0] === "." &&
              this.amountTopUp.split(".").length === 2 &&
              this.amountTopUp.split(".")[1] !== "" &&
              this.amountTopUp.split(".")[1].length <= 2)
              ? true
              : false;
        } else {
          // If there are only numbered inputs.
          this.amountTopUpState = true;
        }
      }
    },
    // TODO: Link this function to the backend to save newly updated
    // wallet information.
    handleSubmit() {
      if (
        this.amountTopUpState &&
        this.amountTopUp !== "" &&
        this.amountTopUp !== null
      ) {
        alert("Amount To Top Up = " + this.amountTopUp);
      }
    }
  },
  data() {
    return {
      amount: this.$store.state.auth.currentUser.amount,
      amountTopUp: "",
      amountTopUpState: null,
      previousTopUps: []
    };
  }
};
</script>