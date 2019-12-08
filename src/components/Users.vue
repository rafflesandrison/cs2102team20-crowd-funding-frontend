<template>
  <div>
    <el-input
      class="mt-4 mb-4 ml-4"
      placeholder="Search email"
      v-model="searchText"
      style="width:30%"
    ></el-input>
    <b-button v-on:click="triggerSearch" class="mr-4" variant="primary">Search</b-button>
    <div>
      Featured Backers :
      <span
        class="mr-1"
        v-for="result in featuredBackers"
        v-bind:key="result.email"
      >{{result.email}},</span>
    </div>
    <div>
      Featured Creators :
      <span
        class="mr-1"
        v-for="result in featuredCreators"
        v-bind:key="result.email"
      >{{result.email}},</span>
    </div>

    <data-tables :data="this.dataTable" :action-col="actionCol">
      <el-table-column label="Name" prop="full_name" sortable="custom"></el-table-column>
      <el-table-column label="Email" prop="email" sortable="custom"></el-table-column>
    </data-tables>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      fields: ["full_name", "email", "action"],
      users: [],
      dataTable: [],
      searchText: "",
      actionCol: {
        props: {
          label: ""
        },
        buttons: [
          {
            props: {
              type: "primary"
            },
            handler: row => {
              this.$router.push(`profile/${row.email}`);
            },
            label: "Select"
          }
        ]
      },
      featuredBackers: [],
      featuredCreators: []
    };
  },
  mounted() {
    this.loadUsers();
    this.loadFeaturedBackers();
    this.loadFeaturedCreators();
  },
  methods: {
    loadUsers() {
      axios
        .get("http://localhost:3000/users")
        .then(res => {
          this.users = res.data;
          this.dataTable = this.users;
          console.log(res.data);
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
          alert(error);
        });
    },
    triggerSearch() {
      if (this.searchText === "") {
        this.dataTable = this.users;
        return;
      }
      axios
        .get("http://localhost:3000/search/user/" + this.searchText)
        .then(res => {
          this.dataTable = res.data;
        })
        .catch(error => {
          alert(error);
        });
    },
    loadFeaturedBackers() {
      axios
        .get("http://localhost:3000/users/featuredbackers")
        .then(res => {
          this.featuredBackers = res.data;
        })
        .catch(error => {
          alert(error);
        });
    },
    loadFeaturedCreators() {
      axios
        .get("http://localhost:3000/users/featuredcreators")
        .then(res => {
          this.featuredBackers = res.data;
        })
        .catch(error => {
          alert(error);
        });
    }
  }
};
</script>

<style>
.userRow {
  margin-bottom: 10px;
}
</style>