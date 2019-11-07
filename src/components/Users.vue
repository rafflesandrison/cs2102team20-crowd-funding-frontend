<template>
  <b-container class="bv-example-row">
    <b-row>
      <b-col cols="5">Name</b-col>
      <b-col cols="5">Email</b-col>
      <b-col cols="2">Action</b-col>
    </b-row>
    <br>
    <div v-for="(user, index) in users" :key="index">
      <b-row class="userRow" v-if="isUser(user.email) == false">
        <b-col cols="5">{{user.full_name}}</b-col>
        <b-col cols="5">{{user.email}}</b-col>
        <b-col cols="2">
          <b-button variant="success" @click="goProfilePage(user.email)">View Profile</b-button>
        </b-col>
      </b-row>
    </div>

  </b-container>
</template>

<script>
  import axios from "axios";

  export default {
    data() {
      return {
        fields: ['full_name', 'email', 'action'],
        users: []
      }
    },
    mounted() {
      this.loadUsers()
    },
    methods: {
      loadUsers() {
        axios
                .get("http://localhost:3000/users")
                .then(res => {
                  this.users = res.data
                  console.log(res.data)
                  /*res.data.forEach(user => {
                    this.users.push({
                      name: user.full_name,
                      email: user.email
                    })
                  })
                  console.log(this.users)
                  this.$set(this.users)*/
                })
                .catch(error => {
                  alert(error)
                })
      },
      goProfilePage(destinationUserProfileEmail) {
        this.$router.push("/profile/" + destinationUserProfileEmail)
      },
      isUser(email) {
        return this.$store.state.user.email === email
      }
    }
  }
</script>

<style>
  .userRow {
    margin-bottom: 10px
  }
</style>