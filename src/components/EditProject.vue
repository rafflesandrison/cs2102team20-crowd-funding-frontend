<template>
  <div class="create-form container fluid" v-if="this.$store.state.auth.isLoggedIn">
    <edit-project-form
            @edit:project="editProject"
            v-bind:projectNames="projectNames"
            v-bind:project="project"
            v-bind:rewards="rewards"
    />
    <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ form }}</pre>
    </b-card>
  </div>
  <div v-else>
    <p>You are not logged in. Please log in to create a project.</p>
  </div>
</template>

<script>
import axios from "axios";
import EditProjectForm from "../sub-components/EditProjectForm";

export default {
  data() {
    return {
      projectNames: [],
        project: null,
        rewards: null,
    };
  },
  components: {
    EditProjectForm
  },
  mounted() {
    this.loadProjectNames();
    this.loadProject();
    this.loadRewards();
  },
  methods: {
    loadProjectNames() {
      axios
        .get("http://localhost:3000/create")
        .then(res => {
          this.projectNames = res.data.map(project => project.project_name);
        })
        .catch(error => {
          alert(error);
        });
    },
    loadProject() {
        axios
            .get("http://localhost:3000/project/" + this.$route.params.projectName)
            .then(response => {
                this.project = response.data;

                this.project.project_deadline = this.project.project_deadline
                    .substr(0, this.project.project_deadline.indexOf("T"));
                console.log(this.project)
            })
            .catch(error => {
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
                  console.log("Edit project rewards:")
                  console.log(response.data);
                  this.rewards = response.data;
              })
              .catch(error => {
                  alert("loadReward()" + error);
              });
      },
    updateProject(form) {
      axios
        .put("http://localhost:3000/updateProject", {
          projectName: form.projectName,
          projectCategory: form.projectCategory,
          projectImageUrl: form.projectImageUrl,
          projectDeadline: form.projectDeadline,
          projectFundingGoal: form.projectFundingGoal,
          projectDescription: form.projectDescription,
          projectRewards: form.projectRewards,
          creatorEmail: this.$store.state.user.email
        })
        .then(response => {
          //this.$set(this.projectNames, 0, parsedProjectName)
          //this.projectNames.push(parsedProjectName)
          //console.log(this.projectNames.toString());
          alert("Project ~Test~ Created!");
          // this.$router.push("/project/" + form.projectName);
        })
        .catch(error => {
          // console.log(error.response.data);
          alert(error.response.data);
        });
    }
  }
};
</script>

<style>
.create-form {
  text-align: left;
}

.reward {
  padding: 30px;
  margin-bottom: 16px;
}
</style>