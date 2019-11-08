<template>
  <div>
    <el-row>
      <div style="margin-bottom: 10px">
        <el-col>
          <el-input
            class="mt-4 mb-4 ml-4"
            placeholder="Search name"
            v-model="searchText"
            style="width:30%"
          ></el-input>
          <b-button v-on:click="triggerSearch()" class="mr-4" variant="primary">Search</b-button>
          <el-select v-model="filters[1].value" placeholder="Select category" multiple="multiple">
            <el-option
              v-for="category in categories"
              :label="category.project_category"
              :key="category.project_category"
              :value="category.project_category"
            ></el-option>
          </el-select>
        </el-col>
        <div>
          Top Searches of all time :
          <span
            class="mr-1"
            v-for="result in popularSearches"
            v-bind:key="result.search_text"
          >{{result.search_text}},</span>
        </div>
        <div>
          Featured Projects :
          <span
            class="mr-1"
            v-for="result in hyperProjects"
            v-bind:key="result.project_name"
          >{{result.project_name}},</span>
        </div>
        <div>
          Fast funded projects :
          <span
            class="mr-1"
            v-for="result in fastFunded"
            v-bind:key="result.project_name"
          >{{result.project_name}} in {{result.timetaken}},</span>
        </div>
      </div>
    </el-row>
    <el-col>
      <data-tables :data="this.tableData" :action-col="actionCol" :filters="filters">
        <el-table-column label="Name" prop="project_name" sortable="custom"></el-table-column>
        <el-table-column label="Category" prop="project_category" sortable="custom"></el-table-column>
        <el-table-column label="Creator" prop="email" sortable="custom"></el-table-column>
      </data-tables>
    </el-col>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      titles: null,
      filters: [
        {
          prop: "project_name",
          value: ""
        },
        {
          prop: "project_category",
          value: ""
        }
      ],
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
              this.$router.push(`project/${row.project_name}`);
            },
            label: "Select"
          }
        ]
      },
      selectedRow: [],
      categories: [],
      tableData: [],
      projects: [],
      selectedValue: null,
      searchText: "",
      popularSearches: [],
      hyperProjects: [],
      fastFunded: []
    };
  },

  beforeMount() {
    this.loadProjects();
    this.loadCategories();
    this.getPopularSearches();
    this.loadHyperProjects();
    this.loadFastFundedProjects();
  },

  methods: {
    loadFastFundedProjects() {
      axios
        .get("/projects/fastfund")
        .then(response => {
          this.fastFunded = response.data.rows;
        })
        .catch(error => {
          // Failure
          alert(error);
        });
      // this.$refs.table.refresh(); // Force a refresh
    },
    loadHyperProjects() {
      axios
        .get("/projects/hyper")
        .then(response => {
          this.hyperProjects = response.data.rows;
        })
        .catch(error => {
          // Failure
          alert(error);
        });
      // this.$refs.table.refresh(); // Force a refresh
    },
    loadCategories() {
      axios
        .get("/categories/list")
        .then(response => {
          this.categories = response.data.rows;
        })
        .catch(error => {
          // Failure
          alert(error);
        });
      // this.$refs.table.refresh(); // Force a refresh
    },
    getPopularSearches() {
      axios
        .get("/search/popsearches")
        .then(response => {
          console.log("popular searches:" + this.popularSearches);
          this.popularSearches = response.data;
        })
        .catch(error => {
          // Failure
          alert(error);
        });
    },

    loadHeaders() {
      axios
        .get("/categories/headers")
        .then(response => {
          var tempColumns = [];
          response.data.fields.forEach(element => {
            tempColumns.push({
              prop: element.name,
              label: element.name
                .replace(/_/g, " ")
                .replace("project", "")
                .replace("email", "Created by")
                .toUpperCase()
            });
          });
          this.titles = tempColumns;
        })
        .catch(error => {
          // Failure
          alert(error);
        });
      // this.$refs.table.refresh(); // Force a refresh
    },

    loadProjects() {
      axios
        .get("/projects")
        .then(response => {
          this.projects = response.data;
          this.tableData = this.projects;
        })
        .catch(error => {
          alert(error);
        });
    },

    triggerSearch() {
      //if search for nothing just return the list of projects
      if (this.searchText === "") {
        this.tableData = this.projects;
        return;
      } else {
        axios
          .get("/search/project/" + this.searchText)
          .then(response => {
            this.tableData = response.data;
            getPopularSearches();
            console.log(this.tableData);
          })
          .catch(error => {
            alert(error);
          });
      }

      const email = this.$store.state.user.email;
      if (email == null || this.searchText === "") {
        return;
      }

      axios
        .post("/search/add", {
          email: email,
          search_text: this.searchText
        })
        .then(response => {
          console.log(response);
          if (response.data == "success") {
            alert("You have searched for " + this.searchText);
          } else if (response.data.name == "error") {
            alert("Server error");
          }
        })
        .catch(error => {
          alert(error);
        });
    }
  }
};
</script>

