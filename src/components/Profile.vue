<template>
  <b-container class="bv-example-row">
    <br>
    <b-row class="text-center">
      <b-col cols="12">
          <b-img
                  src="https://picsum.photos/seed/picsum/200/300"
                  v-bind="mainProps" rounded="circle" alt="Center Circle image"
          ></b-img>
        <b-button
                v-if="isUser == false && isFollowed == false"
                variant="success"
                @click="follow">Follow</b-button>
        <b-button
                v-if="isUser == false && isFollowed == true"
                variant="danger"
                @click="unfollow">Unfollow</b-button>
      </b-col>
    </b-row>
    <br><br>
    <b-row class="text-center">
      <b-col><h3>Created {{numOfCreatedProjects}} projects</h3></b-col>
      <b-col><h3>Backed {{numOfBackedProjects}} projects</h3></b-col>
      <b-col><h3>Joined since XXXXX</h3></b-col>
    </b-row>

    <br><br>
    <div v-if="this.$store.state.auth.isLoggedIn">
      <b-tabs content-class="mt-3" fill>
        <b-tab title="About" active>
          <!-- About: general information about user -->
          <p>About</p>
        </b-tab>
        <b-tab title="Projects Backed">
          <!-- Project Backed -->
          <projects-backed-section
                  v-bind:backedProjects="backedProjects"
          />
        </b-tab>
        <b-tab title="Projects Created">
          <!-- Projects Created -->
          <projects-created-section
                  v-bind:createdProjects="createdProjects"
                  @delete:createdProject="deleteCreatedProject"
          />
        </b-tab>
      </b-tabs>
    </div>

    <div v-else>
      <p>Please log in dude.</p>
    </div>
  </b-container>

</template>
<script>
  import axios from "axios";
  import ProjectsBackedSection from "../sub-components/ProjectsBackedSection";
  import ProjectsCreatedSection from "../sub-components/ProjectsCreatedSection";

export default {
  name: "Profile",
  components: {
    ProjectsBackedSection,
    ProjectsCreatedSection,
  },
  data() {
    return {
      mainProps: { blank: false, blankColor: '#777', width: 250, height: 250, class: 'm1' },
      backedProjects: [],
      createdProjects: [],
      isFollowed: null,
    }
  },
  mounted() {
    this.loadIsFollowed()
    this.loadBackedProjects()
    this.loadCreatedProjects()
  },
  computed: {
    numOfBackedProjects() {
      return this.backedProjects.length
    },
    numOfCreatedProjects() {
      return this.createdProjects.length
    }
    ,
    isUser() {
      return this.$store.state.user.email == this.$route.params.email
    }
  },
  methods: {
    loadIsFollowed() {
      console.log("http://localhost:3000/profile/follows/" + this.$store.state.user.email + "/" + this.$route.params.email)
      axios
              .get("http://localhost:3000/profile/follows/" + this.$store.state.user.email + "/" + this.$route.params.email)
              .then(res => {
                this.isFollowed = Object.entries(res.data).length > 0
                console.log(res.data)
              })
              .catch(error => {
                alert(error)
              })
    },
    loadBackedProjects() {
      axios
              .get(
                      "http://localhost:3000/profile/" +
                      this.$route.params.email +
                      "/backedProjects"
              )
              .then(response => {
                // console.log(response.data);
                this.backedProjects = response.data;
                console.log(this.backedProjects)
              })
              .catch(error => {
                alert(error);
              });
    },
    loadCreatedProjects() {
      axios
              .get(
                      "http://localhost:3000/profile/" +
                      this.$route.params.email +
                      "/createdProjects"
              )
              .then(response => {
                // console.log(response.data);
                this.createdProjects = response.data;
                console.log(this.createdProjects)
              })
              .catch(error => {
                alert(error);
              });
    },
    deleteCreatedProject(projectName) {
      axios
              .delete("http://localhost:3000/profile/deleteCreatedProject/" + this.$store.state.user.email
                      + "/" + projectName)
              .then(response => {
                //this.$set(this.projectNames, 0, parsedProjectName)
                //this.projectNames.push(parsedProjectName)
                //console.log(this.projectNames.toString());
                alert(response.data);
                // this.$router.push("/project/" + form.projectName);
                for (let i = 0; i < this.createdProjects.length; i++) {
                  if (this.createdProjects[i].project_name == projectName) {
                    this.$delete(this.createdProjects,i)
                    break;
                  }
                }
              })
              .catch(error => {
                // console.log(error.response.data);
                alert(error.response.data);
              });
    },
    follow() {
      alert(this.$route.params.email)
      axios
              .post("http://localhost:3000/profile/follows", {
                follower_id: this.$store.state.user.email,
                following_id: this.$route.params.email
              })
              .then(response => {
                //this.$set(this.projectNames, 0, parsedProjectName)
                //this.projectNames.push(parsedProjectName)
                //console.log(this.projectNames.toString());
                alert("Followed !");
                this.isFollowed = !this.isFollowed;
              })
              .catch(error => {
                // console.log(error.response.data);
                alert(error.response.data);
              });
    },
    unfollow() {
      axios
              .delete("http://localhost:3000/profile/follows/"+ this.$store.state.user.email + "/" + this.$route.params.email)
              .then(response => {
                //this.$set(this.projectNames, 0, parsedProjectName)
                //this.projectNames.push(parsedProjectName)
                //console.log(this.projectNames.toString());
                alert("Unfollowed !");
                this.isFollowed = !this.isFollowed;
              })
              .catch(error => {
                // console.log(error.response.data);
                alert(error.response.data);
              });
    },
  }
};
</script>

<style>

</style>