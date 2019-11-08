<template>
  <div class="create-form container fluid" v-if="this.$store.state.auth.isLoggedIn">
    <edit-project-form
            @edit:project="editProject"
            @edit:reward="editReward"
            v-bind:projectNames="projectNames"
            v-bind:project="project"
            v-bind:rewards="rewards"
    />
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
        oldProjectName: null,
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
                this.oldProjectName = response.data.project_name
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
    editProject(form) {
      alert("Editing project")
      axios
        .put("http://localhost:3000/editProject/" + this.oldProjectName, {
          oldProjectName: this.oldProjectName,
          projectName: form.projectName,
          projectCategory: form.projectCategory,
          projectImageUrl: form.projectImageUrl,
          projectDescription: form.projectDescription,
          creatorEmail: this.$store.state.user.email
        })
        .then(response => {
          //this.$set(this.projectNames, 0, parsedProjectName)
          //this.projectNames.push(parsedProjectName)
          //console.log(this.projectNames.toString());
          alert("Project Updated!");
          this.$router.push("/profile/" + this.$store.state.user.email);
        })
        .catch(error => {
          alert(error.response.data);
        });
    },
    editReward(reward) {
      alert("Editing reward")
      axios
              .put("http://localhost:3000/editReward", reward)
              .then(response => {
                alert("Reward Updated!");
                this.$router.push("/profile/" + this.$store.state.user.email);
              })
              .catch(error => {
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