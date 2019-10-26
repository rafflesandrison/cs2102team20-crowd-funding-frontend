<template>
    <div>
        <b-jumbotron v-bind:header="project.project_name">
            <!-- Project Image  -->
            <b-card img-src="https://placekitten.com/300/300" img-alt="Card image" img-left class="mb-3">
                <b-card-text>
                    <h1>$50,XXX CURRENT FUNDING</h1>
                    <p>pledged of ${{project.project_funding_goal}} funding goal</p>
                </b-card-text>
                <b-card-text>
                    <h3>3,xxx </h3>
                    <p>backers</p>
                </b-card-text>
                <b-card-text>
                    <h3>{{this.dayTillDeadline()}}</h3>
                    <p>days to go</p>
                </b-card-text>
                <p>
                    <b-button variant="success">Back this project</b-button>
                </p>
                <p>
                    <b-button variant="outline-secondary"><i class="fa fa-heart" aria-hidden="true"></i> Like</b-button>
                </p>
                <p>This project will only be funding if it reaches
                    its goal by {{this.getFormattedDate(new Date(this.project.project_deadline))}}</p>
            </b-card>
        </b-jumbotron>

        <!-- Navigation between Campaign | Project Update | Feedback | Comments -->
        <div class="nav-bar">
            <b-nav tabs fill>
                <b-nav-item active>Campaign</b-nav-item>
                <b-nav-item>Project Update</b-nav-item>
                <b-nav-item>Feedback</b-nav-item>
                <b-nav-item disabled>Comments</b-nav-item>
            </b-nav>
        </div>

        <!-- Description and Rewards -->
        <b-container class="bv-example-row">
            <b-row>
                <b-col cols="8">
                    <h2>Project Description</h2>
                    <p>
                        {{this.project.project_description}}}
                    </p>
                </b-col>
                <b-col>
                    <h2>Rewards</h2>
                    <b-card
                            :title="'$' + reward.reward_pledge_amount"
                            tag="article"
                            style="max-width: 20rem;"
                            class="mb-2"
                            v-for="(reward, index) in rewards" :key="index"
                    >
                        <b-card-text>
                            <h6>{{reward.reward_name}}</h6>
                            <p>
                                {{reward.reward_description}}
                            </p>
                        </b-card-text>
                        <b-button href="#" variant="primary">Pledge</b-button>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "Project",
        data() {
            return {
                project: null,
                rewards: null,
            }
        },
        beforeMount() {
            this.loadProject()
            this.loadRewards()
        },
        methods: {
            loadProject() {
                axios
                    .get("http://localhost:3000/project/" + this.$route.params.projectName)
                    .then((response) => {
                        console.log(response.data);
                        this.project = response.data
                    })
                    .catch((error) => {
                        // Failure
                        alert(error);
                    });
            },
            loadRewards() {
                axios
                    .get("http://localhost:3000/project/" + this.$route.params.projectName + "/rewards")
                    .then((response) => {
                        console.log(response.data);
                        this.rewards = response.data
                    })
                    .catch(error => {
                        alert(error)
                    })
            },
            dayTillDeadline() {
                const date1 = new Date();
                const date2 = new Date(this.project.project_deadline);
                const diffTime = Math.abs(date2 - date1);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays;
            },
            getFormattedDate(date) {
                    var year = date.getFullYear();

                    var month = (1 + date.getMonth()).toString();
                    month = month.length > 1 ? month : '0' + month;

                    var day = date.getDate().toString();
                    day = day.length > 1 ? day : '0' + day;

                    return year + '/' + month + '/' + day;
            }
        },
    }
</script>

<style scoped>
    .nav-bar {
        margin: 20px 0 20px 0;
    }
</style>