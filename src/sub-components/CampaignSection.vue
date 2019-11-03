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
                        :title="'$' + reward.reward_pledge_amount"
                        tag="article"
                        style="max-width: 20rem;"
                        class="mb-2"
                        v-for="(reward, index) in rewards"
                        :key="index"
                >
                    <b-card-text>
                        <h6>{{reward.reward_name}}</h6>
                        <p>{{reward.reward_description}}</p>
                    </b-card-text>
                    <b-button
                            v-if="!isBackedReward(reward.reward_name)"
                            @click="pledge(reward.reward_name, reward.reward_pledge_amount)"
                            href="#" variant="success"
                    >
                        Pledge
                    </b-button>
                    <b-button v-else
                              id="unback-btn"
                              @click="pledge(reward.reward_name, reward.reward_pledge_amount)"
                    >
                        <span>You have pledge for this reward!</span>
                    </b-button>
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
            isBackedReward(rewardName) {
                // If reward has been chosen during backing, return true
                return this.backedRewards.indexOf(rewardName) >= 0
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
</style>