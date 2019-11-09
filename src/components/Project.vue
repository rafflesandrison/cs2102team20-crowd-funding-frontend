<template>
  <div>
    <b-jumbotron v-bind:header="project.project_name" v-if="this.$store.state.auth.isLoggedIn">
      <!-- Project Image  -->
      <b-card>
        <b-row>
          <b-col md="5">
            <b-card-img :src="project.project_image_url" class="rounded-0" v-bind="imageProp"></b-card-img>
          </b-col>
          <b-col md="7">
            <b-card-text>
              <h1>${{this.projectCurrentFunding.project_current_funding}}</h1>
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
              <!--
              <b-button variant="warning" v-b-modal.backs-modal @click="listBackings">Manage Backings</b-button>
              -->
              <b-button
                v-if="!project.ended"
                variant="success"
                :disabled="true"
                v-b-modal.backs-modal
              >Ongoing Campaign</b-button>
              <b-button
                v-if="project.ended"
                variant="dark"
                :disabled="true"
                v-b-modal.backs-modal
              >Campaign Ended</b-button>
              <br />
              <b-button
                variant="outline-success"
                v-if="project.ended && !fullyFunded"
                @click="collectRefund"
              >Collect Refund</b-button>
              <b-button
                variant="outline-success"
                v-if="project.ended && fullyFunded"
                v-b-modal.backs-modal
              >Give Feedback</b-button>
              <!-- <br/> -->
              <!-- <b-button v-if="is_backed" variant="danger" v-b-modal.backs-modal @click="listBackings">Unback this project</b-button> -->
            </p>
            <div>
              <b-button
                variant="outline-success"
                v-b-modal.modal-1
                v-if="hasEnded && fullyFunded"
                @click="giveFeedback"
              >Give Feedback</b-button>

              <b-modal id="modal-1" title="Give Feedback" @ok="postFeedback">
                <b-input-group>
                  <b-input-group-text>Feedback</b-input-group-text>
                  <b-form-input v-model="newFeedback"></b-form-input>
                  <br />
                  <b-form-select v-model="rating" :options="options" :select-size="4"></b-form-select>
                </b-input-group>
              </b-modal>
            </div>
            <!-- <br/> -->
            <!-- <b-button v-if="is_backed" variant="danger" v-b-modal.backs-modal @click="listBackings">Unback this project</b-button> -->
            <p v-if="this.$store.state.auth.isLoggedIn">
              <b-button
                :pressed.sync="is_liked"
                variant="outline-danger"
                @click="toggleLikeProject"
              >
                <i class="fa fa-heart" aria-hidden="true"></i> Like
              </b-button>
            </p>
            <p>
              This project will only be funded if it reaches
              its goal by {{this.getFormattedDate(new Date(this.project.project_deadline))}}
            </p>
          </b-col>
        </b-row>
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
            @donate:money="donate"
          />
        </b-tab>
        <b-tab title="Updates">
          <!-- Project Update -->
          <update-section v-bind:updates="updates" />
        </b-tab>
        <b-tab title="Comments">
          <comment-section v-bind:comments="comments" @post:comment="postComment" />
        </b-tab>

        <b-tab title="Feedback">
          <feedback-section v-bind:feedback="feedback" @post:feedback="postFeedback" />
        </b-tab>
      </b-tabs>
    </div>

    <div v-else>
      <p>Please log in dude.</p>
    </div>

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
        <data-tables :data="tableData" :action-col="actionCol" :filters="filters">
          <el-table-column
            v-for="title in titles"
            :prop="title.prop"
            :label="title.label"
            :key="title.prop"
            sortable="custom"
          />
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
import FeedbackSection from "../sub-components/FeedbackSection";

export default {
  name: "Project",
  components: {
    CampaignSection,
    UpdateSection,
    CommentSection,
    FeedbackSection
  },
  data() {
    return {
      project: null,
      projectCurrentFunding: null,
      rewards: null,
      updates: [
        {
          project_name: "Sample Project Name #1",
          update_title: "Woah! We hit our goal...",
          update_description:
            "Well that was fast. We have hit our goal of $90k. We are floored by your support !",
          update_time: "2019-07-02 16:04:56.874028"
        },
        {
          project_name: "Sample Project Name #2",
          update_title: "Thank you for your support !",
          update_description:
            "We are so pleased to announce that..... We have hit our goal of $1m! We are floored by your support !",
          update_time: "2019-08-02 16:04:56.874028"
        }
      ],
      comments: [
        {
          project_name: "Project 1",
          comment_text: "Comment text testing one two three.",
          comment_date: "2019-06-02 13:00:56.874028",
          email: "cabi@example.com"
        },
        {
          project_name: "Project 1",
          comment_text: "Comment text testing one two three.",
          comment_date: "2019-07-02 13:00:56.874028",
          email: "cabi@example.com"
        },
        {
          project_name: "Project 1",
          comment_text: "Comment text testing one two three.",
          comment_date: "2019-07-02 07:00:56.874028",
          email: "abi@example.com"
        }
      ],
      feedback: [],
      newFeedback: "",
      rating: [],
      options: [
        { value: null, text: "Please select some rating" },
        { value: 1, text: "1" },
        { value: 2, text: "2" },
        { value: 3, text: "3" },
        { value: 4, text: "4" },
        { value: 5, text: "5" }
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
          label: "Actions"
        },
        buttons: [
          {
            props: {
              type: "danger"
            },
            handler: row => {
              this.$confirm("Are you sure you want to unback this project?")
                .then(() => {
                  axios
                    .post(
                      `/project/${this.$route.params.projectName}/unback/${row.transaction_id}`,
                      {
                        user_email: this.$store.state.user.email
                      }
                    )
                    .then(() => {
                      this.listBackings();
                      this.isBacked();
                    });
                })
                .catch(error => {
                  alert(error);
                });
            },
            label: "Unback"
          }
        ]
      },
      imageProp: {
        blank: true,
        height: 400
      }
    };
  },
  beforeMount() {
    this.loadProject();
    this.loadCurrentFunding();
    this.loadRewards();
    this.loadUpdates();
    this.loadComments();
    this.loadTotalBackers();
    this.isBacked();
    this.isLiked();
    this.getBackedRewards();
  },
  mounted() {
    this.loadFeedback();
  },
  computed: {
    fullyFunded() {
      return (
        parseFloat(this.project.project_funding_received) >=
        parseFloat(this.project.project_funding_goal)
      );
    },
    isOwner() {
      return this.$store.state.user.email == this.project.email;
    }
  },
  methods: {
    loadProject() {
      axios
        .get("http://localhost:3000/project/" + this.$route.params.projectName)
        .then(response => {
          console.log("project: ");
          console.log(response.data);
          this.project = response.data;
        })
        .catch(error => {
          // Failure
          alert("loadProjcet(): " + error);
        });
    },
    loadCurrentFunding() {
      axios
        .get(
          "http://localhost:3000/project/currentFunding/" +
            this.$route.params.projectName
        )
        .then(response => {
          //alert("current funding is " + response.data.project_current_funding);
          this.projectCurrentFunding = response.data;
          this.projectCurrentFunding.project_current_funding =
            response.data.project_current_funding != null
              ? parseFloat(response.data.project_current_funding)
              : 0;
        })
        .catch(error => {
          // Failure
          alert(error);
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
          console.log("rewards are\n");
          console.log(this.rewards);
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
    loadFeedback() {
      axios
        .get("http://localhost:3000/project/" + this.$route.params.projectName)
        .then(response => {
          axios
            .get(`/feedback/${response.data.email}`)
            .then(response => {
              this.feedback = response.data;
            })
            .catch(error => {
              alert("loadFeedback()" + error);
            });
        })
        .catch(error => {
          // Failure
          alert("loadProject() within feedback: " + error);
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
          console.log("loadTotalBackers");
          console.log(response.data);
          this.rewardsBackedCount = response.data.length;
        })
        .catch(error => {
          alert(error);
        });
    },
    getBackedRewards() {
      axios
        .get(
          "http://localhost:3000/project/backedRewards/" +
            this.$route.params.projectName +
            "/" +
            this.$store.state.user.email
        )
        .then(response => {
          this.backedRewards = response.data.map(reward => reward.reward_name);
        })
        .catch(error => {
          alert("getBackedRewards() " + error);
        });
    },
    postComment(newComment) {
      axios
        .post(
          "http://localhost:3000/project/" +
            this.$route.params.projectName +
            "/comments",
          {
            newComment: newComment,
            commenterEmail: this.$store.state.user.email,
            projectName: this.project.project_name
          }
        )
        .then(response => {
          this.$set(this.comments, this.comments.length, response.data);
        })
        .catch(error => {
          alert("postComment()" + error);
        });
    },
    isBacked() {
      axios
        .get(
          `/project/${this.$route.params.projectName}/back/${this.$store.state.user.email}`
        )
        .then(response => {
          if (response.data.length > 0) {
            this.is_backed = true;
          } else {
            this.is_backed = false;
          }
        })
        .catch(error => {
          alert("isBacked()" + error);
        });
    },
    backProject(reward) {
      console.log("backProject");
      console.log(`/project/${this.project.project_name}/back`);
      console.log({
        user_email: this.$store.state.user.email,
        project_backed_name: this.project.project_name,
        reward_name: reward.reward_name,
        backs_amount: reward.back_amount
      });
      axios
        .post(`/project/${this.project.project_name}/back`, {
          user_email: this.$store.state.user.email,
          project_backed_name: this.project.project_name,
          reward_name: reward.reward_name,
          backs_amount: reward.back_amount
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
            this.$set(
              this.backedRewards,
              this.backedRewards.length,
              reward.reward_name
            );
            this.$set(
              this.projectCurrentFunding,
              "project_current_funding",
              this.projectCurrentFunding.project_current_funding +
                parseFloat(reward.back_amount)
            );
            this.$set(this, "rewardsBackedCount", this.rewardsBackedCount + 1);
            console.log("back: backedRewards");
            console.log(this.backedRewards);
          }
        })
        .catch(error => {
          this.$message({
            message: "An error occurred.",
            type: "warning"
          });

          alert(JSON.stringify(error));
        });
    },
    unbackProject(reward) {
      console.log("unbackProject");
      console.log(`/project/${this.project.project_name}/unback`);
      console.log({
        user_email: this.$store.state.user.email,
        project_backed_name: this.project.project_name,
        reward_name: reward.reward_name
      });
      axios
        .post(`/project/${this.project.project_name}/unback`, {
          user_email: this.$store.state.user.email,
          project_backed_name: this.project.project_name,
          reward_name: reward.reward_name
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
            this.$delete(
              this.backedRewards,
              this.backedRewards.indexOf(reward.reward_name)
            );
            this.$set(
              this.project,
              "project_current_funding",
              this.projectCurrentFunding.project_current_funding -
                parseFloat(reward.back_amount)
            );
            this.$set(this, "rewardsBackedCount", this.rewardsBackedCount - 1);
            console.log("unback: backedRewards");
            console.log(this.backedRewards);
          }
        })
        .catch(() => {
          this.$message({
            message: "An error occurred.",
            type: "warning"
          });
        });
    },
    donate(detail) {
      axios
        .put(`/project/donate`, detail)
        .then(res => {
          alert("Donate success!");
        })
        .catch(error => {
          alert(error);
        });
    },
    backProjectWithoutReward() {
      // TODO: provide front-end check on negative backs-amount
      axios
        .post(`/project/${this.project.project_name}/backNoReward`, {
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
        .catch(error => {
          this.$message({
            message: "An error occurred.",
            type: "warning"
          });

          alert(JSON.stringify(error));
        });
    },
    listBackings() {
      if (this.is_backed) {
        axios
          .get(
            `/project/${this.$route.params.projectName}/back/${this.$store.state.user.email}/list/headers`
          )
          .then(response => {
            var tempColumns = [];
            response.data.fields.forEach(element => {
              tempColumns.push({
                prop: element.name,
                label: element.name.replace(/_/g, " ")
              });
            });
            this.titles = tempColumns;
          })
          .catch(() => {});

        axios
          .get(
            `/project/${this.$route.params.projectName}/back/${this.$store.state.user.email}/list`
          )
          .then(response => {
            this.tableData = response.data;
          })
          .catch(error => {
            alert("listBackings()" + error);
          });
      }
    },
    isLiked() {
      axios
        .get(
          `/project/${this.$route.params.projectName}/islike/${this.$store.state.user.email}`
        )
        .then(response => {
          if (response.data.length == 0) {
            this.is_liked = false;
          } else {
            this.is_liked = true;
          }
        });
    },
    toggleLikeProject() {
      if (!this.is_liked) {
        axios
          .get(
            `/project/${this.$route.params.projectName}/unlike/${this.$store.state.user.email}`
          )
          .then(() => {
            this.is_liked = false;
          });
      } else {
        axios
          .get(
            `/project/${this.$route.params.projectName}/like/${this.$store.state.user.email}`
          )
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
    collectRefund() {
      alert("collect refund");
      axios
        .put("/project/collectRefund", {
          backer_email: this.$store.state.user.email,
          project_name: this.project.project_name
        })
        .then(res => {
          alert(res.data);
        })
        .catch(error => {
          alert(error);
        });
    },
    postFeedback() {
      axios
        .post(`/feedback/create`, {
          projectname: this.project.project_name,
          feedback_text: this.newFeedback,
          rating_number: this.rating,
          email: this.$store.state.user.email
        })
        .then(response => {
          if (response.data == "success") {
            alert("You have successfully feedbacked.");
          } else if (response.data.name == "error") {
            alert(
              "There is an error, you might have already feedbacked on the project."
            );
          }
        })
        .catch(error => {
          alert("loadFeedback()" + error);
        });
    }
  }
};
</script>

<style scoped>
.nav-bar {
  margin: 20px 0 20px 0;
}
</style>
