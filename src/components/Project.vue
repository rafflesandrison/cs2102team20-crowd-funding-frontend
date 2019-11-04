<template>
  <div>
    <b-jumbotron v-bind:header="project.project_name" v-if="this.$store.state.auth.isLoggedIn">
      <!-- Project Image  -->
      <b-card img-src="https://placekitten.com/300/300" img-alt="Card image" img-left class="mb-3">
        <b-card-text>
          <h1>${{project.project_current_funding}}</h1>
          <p>pledged of ${{project.project_funding_goal}} funding goal</p>
        </b-card-text>
        <b-card-text>
          <h3>{{rewardsBackedCount}}</h3>
          <p>rewards pledged by backers</p>
        </b-card-text>
        <b-card-text>
          <h3>{{this.dayTillDeadline()}}</h3>
          <p>days to go</p>
        </b-card-text>
        <p v-if="this.$store.state.auth.isLoggedIn">
          <b-button variant="warning" v-b-modal.backs-modal @click="listBackings">Manage Backings</b-button>
          <!-- <br/> -->
          <!-- <b-button v-if="is_backed" variant="danger" v-b-modal.backs-modal @click="listBackings">Unback this project</b-button> -->
        </p>
        <p v-if="this.$store.state.auth.isLoggedIn">
          <b-button :pressed.sync="is_liked" variant="outline-danger" @click="toggleLikeProject">
            <i class="fa fa-heart" aria-hidden="true"></i> Like
          </b-button>
        </p>
        <p>
          This project will only be funding if it reaches
          its goal by {{this.getFormattedDate(new Date(this.project.project_deadline))}}
        </p>
      </b-card>
    </b-jumbotron>

    <!-- Tabs between Campaign | Project Update | Feedback | Comments -->
    <div v-if="this.$store.state.auth.isLoggedIn">
      <b-tabs content-class="mt-3" fill>
        <b-tab title="Campaign" active>
          <!-- Campaign: Description and Rewards -->
          <campaign-section
                  v-bind:project="project"
                  v-bind:rewards="rewards"
                  v-bind:backedRewards="backedRewards"
                  @pledge:reward="backProject"
                  @unpledge:reward="unbackProject"
          />
        </b-tab>
        <b-tab title="Updates">
          <!-- Project Update -->
          <update-section
                  v-bind:updates="updates"
          />
        </b-tab>
        <b-tab title="Comments">
          <comment-section
                  v-bind:comments="comments"
                  @post:comment="postComment"
          />
        </b-tab>
      </b-tabs>
    </div>

    <div v-else>
      <p>Please log in dude.</p>
    </div>

    <el-button @click="getBackedRewards">Click ME!</el-button>

    <b-modal title="Manage Backings" id="backs-modal" hide-footer>
      <div>
      <b-input-group prepend="$" class="mt-3">
        <b-form-input v-model="backs_amount"></b-form-input>
        <b-input-group-append>
          <b-button variant="success" @click="backProjectWithoutReward">Back!</b-button>
        </b-input-group-append>
      </b-input-group>
      </div>
      <div v-if="is_backed">
        <data-tables
      :data="tableData"
      :action-col="actionCol"
      :filters="filters">
      <el-table-column
        v-for="title in titles"
        :prop="title.prop"
        :label="title.label"
        :key="title.prop"
        sortable="custom"/>
    </data-tables>
        </div>
    </b-modal>

  </div>
</template>

<script>
import axios from "axios";
import CampaignSection from "../sub-components/CampaignSection";
import UpdateSection from "../sub-components/UpdateSection";
import CommentSection from "../sub-components/CommentSection";

export default {
  name: "Project",
  components: {
    CampaignSection,
    UpdateSection,
    CommentSection,
  },
  data() {
    return {
      project: null,
      rewards: null,
      updates: [
        {
          project_name: 'Sample Project Name #1',
          update_title: "Woah! We hit our goal...",
          update_description: "Well that was fast. We have hit our goal of $90k. We are floored by your support !",
          update_time: "2019-07-02 16:04:56.874028"
        },
        {
          project_name: 'Sample Project Name #2',
          update_title: "Thank you for your support !",
          update_description: "We are so pleased to announce that..... We have hit our goal of $1m! We are floored by your support !",
          update_time: "2019-08-02 16:04:56.874028"
        },
      ],
      comments: [
          {
              project_name: 'Project 1',
              comment_text: 'Comment text testing one two three.',
              comment_date: '2019-06-02 13:00:56.874028',
              email: 'cabi@example.com'
          },
          {
              project_name: 'Project 1',
              comment_text: 'Comment text testing one two three.',
              comment_date: '2019-07-02 13:00:56.874028',
              email: 'cabi@example.com'
          },
          {
              project_name: 'Project 1',
              comment_text: 'Comment text testing one two three.',
              comment_date: '2019-07-02 07:00:56.874028',
              email: 'abi@example.com'
          },
      ],
      rewardsBackedCount: 0,
      backDialogVisible: false,
      backs_amount: 0,
      is_backed: null,
      titles: null,
      tableData: null,
      is_liked: null,
      backedRewards: [],
      actionCol: {
        props: {
          label: 'Actions',
        },
        buttons: [{
          props: {
            type: 'danger'
          },
          handler: row => {
                 this.$confirm("Are you sure you want to unback this project?")
                .then(() => {
                  axios.post(`/project/${this.$route.params.projectName}/unback/${row.transaction_id}`, {
                    user_email: this.$store.state.user.email,
                  })
                      .then(() => {
                        this.listBackings();
                        this.isBacked();
                      });
                    })
        .catch((error) => {alert(error)});
          },
          label: 'Unback'
        }]
      },
    };
  },
  beforeMount() {
    this.loadProject();
    this.loadRewards();
    this.loadUpdates();
    this.loadComments();
    this.loadTotalBackers();
    this.isBacked();
    this.isLiked();
    this.getBackedRewards();
  },
  computed: {
  },
  methods: {
    loadProject() {
      axios
        .get("http://localhost:3000/project/" +
                this.$route.params.projectName)
        .then(response => {
          // console.log(response.data);
          this.project = response.data;
        })
        .catch(error => {
          // Failure
          alert("loadProjet(): " + error);
        });
    },
    loadRewards() {
      axios
        .get(
          "http://localhost:3000/project/" +
            this.$route.params.projectName +
            "/rewards"
        )
        .then(response => {
          // console.log(response.data);
          this.rewards = response.data;
        })
        .catch(error => {
          alert("loadReward()" + error);
        });
    },
    loadUpdates() {
      axios
              .get(
                      "http://localhost:3000/project/" +
                      this.$route.params.projectName +
                      "/updates"
              )
              .then(response => {
                // console.log(response.data);
                this.updates = response.data;
              })
              .catch(error => {
                alert("loadUpdates()" + error);
              });
    },
    loadComments() {
      axios
              .get(
                      "http://localhost:3000/project/" +
                      this.$route.params.projectName +
                      "/comments"
              )
              .then(response => {
                // console.log(response.data);
                this.comments = response.data;
              })
              .catch(error => {
                alert("loadComments()" + error);
              });
    },
    loadTotalBackers() {
      axios
              .get(
                      "http://localhost:3000/project/" +
                      this.$route.params.projectName +
                      "/backers"
              )
              .then(response => {
                console.log("loadTotalBackers")
                console.log(response.data);
                this.rewardsBackedCount = response.data.length;
              })
              .catch(error => {
                alert(error);
              });
    },
    getBackedRewards() {
      axios
              .get("http://localhost:3000/project/backedRewards/" + this.$route.params.projectName + "/"
                      + this.$store.state.user.email)
              .then(response => {
                this.backedRewards = response.data.map(reward => reward.reward_name)
                //console.log("Backed projects are")
                //console.log(this.backedRewards)
                //console.log("Response data\n")
                //console.log(response.data)
                //console.log("Response data after turning to array is\n")
                //console.log(response.data.map(reward => reward.reward_name))
              })
              .catch(error => {
                alert("getBackedRewards() " + error)
              })
    },
    postComment(newComment) {
      axios
              .post("http://localhost:3000/project/" + this.$route.params.projectName + "/comments", {
                newComment: newComment,
                commenterEmail: this.$store.state.user.email,
                projectName: this.project.project_name,
              })
              .then(response => {
                this.$set(this.comments, 0, response.data)
              })
              .catch(error => {
                alert("postComment()" + error)
              });
    },
    isBacked() {
      axios
        .get(`/project/${this.$route.params.projectName}/back/${this.$store.state.user.email}`)
        .then((response) => {
          if (response.data.length > 0) {
            this.is_backed = true;
          } else {
            this.is_backed = false;
          }
        })
        .catch((error) => {
          alert("isBacked()" + error);
        });
    },
    backProject(reward) {
      console.log("backProject")
      console.log(`/project/${this.project.project_name}/back`)
      console.log({
        user_email: this.$store.state.user.email,
        project_backed_name: this.project.project_name,
        reward_name: reward.reward_name,
        backs_amount: reward.back_amount,
      })
      axios
        .post(`/project/${this.project.project_name}/back`, {
          user_email: this.$store.state.user.email,
          project_backed_name: this.project.project_name,
          reward_name: reward.reward_name,
          backs_amount: reward.back_amount,
        })
        .then(response => {
          if (response.data == "Failure") {
            this.$message({
              message: "You do not have enough cash.",
              type: "error"
            });
          } else {
            this.$message({
              message: "Successfully backed.",
              type: "success"
            });
            // this.$bvModal.hide("backs-modal");
            this.is_backed = true;
            this.listBackings();
            this.$set(this.backedRewards, this.backedRewards.length, reward.reward_name)
            this.$set(this.project, 'project_current_funding',
                    this.project.project_current_funding + parseFloat(reward.back_amount))
            this.$set(this, 'rewardsBackedCount', this.rewardsBackedCount + 1)
            console.log("back: backedRewards")
            console.log(this.backedRewards)
          }
        })
        .catch((error) => {
          this.$message({
            message: "An error occurred.",
            type: "warning"
          });

          alert(JSON.stringify(error));
        });
    },

    backProjectWithoutReward() {
           // TODO: provide front-end check on negative backs-amount
      axios
        .post(`/project/${this.project.project_name}/back`, {
          user_email: this.$store.state.user.email,
          project_backed_name: this.project.project_name,
          backs_amount: this.backs_amount
        })
        .then(response => {
          if (response.data == "Failure") {
            this.$message({
              message: "You do not have enough cash.",
              type: "error"
            });
          } else {
            this.$message({
              message: "Successfully backed.",
              type: "success"
            });
            // this.$bvModal.hide("backs-modal");
            this.is_backed = true;
            this.listBackings();
          }
        })
        .catch(() => {
          this.$message({
            message: "An error occurred.",
            type: "warning"
          });
        });
    },
    unbackProject(reward) {
      console.log("unbackProject")
      console.log(`/project/${this.project.project_name}/unback`)
      console.log({
        user_email: this.$store.state.user.email,
        project_backed_name: this.project.project_name,
        reward_name: reward.reward_name,
      })
      axios
              .post(`/project/${this.project.project_name}/unback`, {
                user_email: this.$store.state.user.email,
                project_backed_name: this.project.project_name,
                reward_name: reward.reward_name,
              })
              .then(response => {
                if (response.data == "Failure") {
                  this.$message({
                    message: "Unable to unback at the moment...",
                    type: "error"
                  });
                } else {
                  this.$message({
                    message: "Successfully unback",
                    type: "success"
                  });
                  // this.$bvModal.hide("backs-modal");
                  this.is_backed = false;
                  this.listBackings();
                  this.$delete(this.backedRewards, this.backedRewards.indexOf(reward.reward_name))
                  this.$set(this.project, 'project_current_funding',
                          this.project.project_current_funding - parseFloat(reward.back_amount))
                  this.$set(this, 'rewardsBackedCount', this.rewardsBackedCount - 1)
                  console.log("unback: backedRewards")
                  console.log(this.backedRewards)
                }
              })
              .catch(() => {
                this.$message({
                  message: "An error occurred.",
                  type: "warning"
                });
              });
    },
    listBackings() {
      if (this.is_backed) {
        axios
        .get(`/project/${this.$route.params.projectName}/back/${this.$store.state.user.email}/list/headers`)
        .then((response) => {
          var tempColumns = [];
          response.data.fields.forEach((element) => {
            tempColumns.push({
              prop: element.name,
              label: element.name.replace(/_/g, ' ')
            });
          })
          this.titles = tempColumns;
        })
        .catch(() => {});

        axios
        .get(`/project/${this.$route.params.projectName}/back/${this.$store.state.user.email}/list`)
        .then((response) => {
          this.tableData = response.data;
        })
        .catch((error) => {
          alert("listBackings()" + error)
        });
      }
    },
    isLiked() {
      axios.get(`/project/${this.$route.params.projectName}/islike/${this.$store.state.user.email}`)
        .then((response) => {
          if (response.data.length == 0) {
            this.is_liked = false;
          } else {
            this.is_liked = true;
          }
        })
    },
    toggleLikeProject() {
      if (!this.is_liked) {
        axios.get(`/project/${this.$route.params.projectName}/unlike/${this.$store.state.user.email}`)
          .then(() => {
            this.is_liked = false;
          });
      } else {

        axios.get(`/project/${this.$route.params.projectName}/like/${this.$store.state.user.email}`)
          .then(() => {
            this.is_liked = true;
          });
      }
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
      month = month.length > 1 ? month : "0" + month;

      var day = date.getDate().toString();
      day = day.length > 1 ? day : "0" + day;

      return year + "/" + month + "/" + day;
    },
  }
};
</script>

<style scoped>
.nav-bar {
  margin: 20px 0 20px 0;
}
</style>