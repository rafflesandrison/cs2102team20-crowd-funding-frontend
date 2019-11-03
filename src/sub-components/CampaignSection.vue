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
                    <b-button href="#" variant="primary">Pledge</b-button>
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
            rewards: Array
        }
    }
</script>

<style scoped>

</style>