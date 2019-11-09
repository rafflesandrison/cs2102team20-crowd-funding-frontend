<template>
    <b-container class="bv-example-row">
        <b-row>
            <b-col cols="8">
                <h2>Project Description</h2>
                <p>{{this.project.project_description}}</p>
            </b-col>
            <b-col>
                <h2>Rewards</h2>
                <b-card
                        tag="article"
                        style="max-width: 20rem;"
                        class="mb-2"
                        v-for="(reward, index) in rewards"
                        :key="index"
                >
                        <b-form-group
                                v-if="isDonate(reward) && !isOwner"
                                id="input-reward-pledge-amount"
                                label="How much do you wish to donate?"
                                label-for="input-reward-pledge-amount"
                        >
                            <b-form-input
                                    id="input-reward-pledge-amount"
                                    v-model="reward.reward_pledge_amount"
                                    type="number"
                                    step=".01"
                                    required
                            ></b-form-input>
                        </b-form-group>
                        <b-form-group
                                v-if="isDonate(reward) && isOwner"
                                id="input-reward-pledge-amount"
                                label="Total donation received"
                                label-for="input-reward-pledge-amount"
                        >
                            <b-form-input
                                    id="input-reward-pledge-amount"
                                    v-model="reward.reward_pledge_amount"
                                    type="number"
                                    step=".01"
                                    required
                                    disabled="true"
                            ></b-form-input>
                        </b-form-group>
                        <h4 v-else>${{reward.reward_pledge_amount}}</h4>
                        <h6>{{reward.reward_name}}</h6>
                        <p>{{reward.reward_description}}</p>
                    <!-- Buttons for Backed, Unbacked, Donate -->
                    <div v-if="!project.ended || isOwner">
                        <b-button
                                v-if="!isBackedReward(reward.reward_name) && !isDonate(reward) && !isOwner"
                                @click="pledge(reward.reward_name, reward.reward_pledge_amount)"
                                href="#" variant="success"
                        >
                            Pledge
                        </b-button>
                        <b-button v-if="isBackedReward(reward.reward_name) && !isDonate(reward) && !isOwner"
                                  id="unback-btn"
                                  @click="pledge(reward.reward_name, reward.reward_pledge_amount)"
                        >
                            <span>You have pledge for this reward!</span>
                        </b-button>
                        <b-button
                                id="donate-btn"
                                v-else-if="isDonate(reward) && !isOwner"
                                @click="donate(reward.reward_pledge_amount)"
                                href="#" variant="success"
                        >
                            Donate
                        </b-button>
                    </div>
                </b-card>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    export default {
        name: "CampaignSection",
        props: {
            project: Object,
            rewards: Array,
            backedRewards: Array,
        },
        data() {
          return {
          }
        },
        computed: {
            isOwner() {
                return this.$store.state.user.email == this.project.email
            }
        },
        methods: {
            pledge(rewardName, rewardAmount) {
                if (this.isBackedReward(rewardName)) {
                    alert("Are you sure you want to remove your pledge?") // to be changed to modal if time permits
                    this.$emit("unpledge:reward", {
                        reward_name: rewardName,
                        back_amount: rewardAmount
                    })
                } else {
                    if (parseFloat(this.$store.state.wallet.amount) < parseFloat(rewardAmount)) {
                        alert("Wallet balance is low. You might want to top up. Current balance is "
                            + this.$store.state.wallet.amount + " and the reward amount is " + rewardAmount)
                        return
                    }

                    this.$emit("pledge:reward", {
                        reward_name: rewardName,
                        back_amount: rewardAmount
                    })
                }
            },
            donate(amount) {
                if (amount == 0) {
                    this.$message("You cannot donate $0!");
                    return;
                }
                alert("Donating" + amount + " for project " + this.project.project_name)
                this.$emit("donate:money", {
                    backer_email: this.$store.state.user.email,
                    project_name: this.project.project_name,
                    back_amount: amount,
                })
            },
            isBackedReward(rewardName) {
                // If reward has been chosen during backing, return true
                return this.backedRewards.indexOf(rewardName) >= 0
            },
            isDonate(reward) {
                return reward.reward_name === null && reward.reward_description === null
            }
        }
    }
</script>

<style scoped>
    #unback-btn {
        width: 17em
    }

    #unback-btn:hover {
        background: indianred
    }

    #unback-btn:hover span {
        display:none
    }

    #unback-btn:hover:before {
        content: "Remove pledge";
    }

    #donate-btn {
        background: gold;
        color: #2c3e50;
    }
</style>