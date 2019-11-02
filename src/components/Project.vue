<template>
  <div>
    <b-jumbotron v-bind:header="project.project_name" v-if="this.$store.state.auth.isLoggedIn">
      <!-- Project Image  -->
      <b-card img-src="https://placekitten.com/300/300" img-alt="Card image" img-left class="mb-3">
        <b-card-text>
          <h1>$50,XXX CURRENT FUNDING</h1>
          <p>pledged of ${{project.project_funding_goal}} funding goal</p>
        </b-card-text>
        <b-card-text>
          <h3>3,xxx</h3>
          <p>backers</p>
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
          <b-container class="bv-example-row">
            <b-row>
              <b-col cols="8">
                <h2>Project Description</h2>
                <p>{{this.project.project_description}}}</p>
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

        </b-tab>
        <b-tab title="Updates">
          <!-- Project Update -->
          <b-container class="bv-example-row">
            <h2>Project Update</h2>
            <b-card
                    :title="update.project_title"
                    tag="article"
                    style="max-width: 60rem;"
                    class="mb-2"
                    v-for="(update, index) in updates"
                    :key="index"
            >
              <b-card-text>
                <h4>{{update.update_title}}</h4>
                <p>{{update.update_description}}</p>
              </b-card-text>
            </b-card>
          </b-container>
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



    <b-modal title="Manage Backings" id="backs-modal" hide-footer>
      <div>
      <b-input-group prepend="$" class="mt-3">
        <b-form-input v-model="backs_amount"></b-form-input>
        <b-input-group-append>
          <b-button variant="success" @click="backProject">Back!</b-button>
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
import CommentSection from "../sub-components/CommentSection";

export default {
  name: "Project",
  components: {
    CommentSection
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
      backDialogVisible: false,
      backs_amount: 0,
      is_backed: null,
      titles: null,
      tableData: null,
      is_liked: null,

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
    this.isBacked();
    this.isLiked();
  },
  computed: {
  },
  methods: {
    loadProject() {
      axios
        .get("http://localhost:3000/project/" + this.$route.params.projectName)
        .then(response => {
          // console.log(response.data);
          this.project = response.data;
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
        })
        .catch(error => {
          alert(error);
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
                alert(error);
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
                alert(error);
              });
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
                alert(error)
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
          alert(error);
        });
    },
    
    backProject() {
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
        .catch(() => {});
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