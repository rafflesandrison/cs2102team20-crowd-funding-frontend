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
      </div>
    </el-row>
    <el-col>
      <data-tables :data="this.tableData" :action-col="actionCol" :filters="filters">
        <el-table-column
          v-for="title in titles"
          :prop="title.prop"
          :label="title.label"
          :key="title.prop"
          sortable="custom"
        />
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
      selectedValue: null,
      searchText: ""
    };
  },

  beforeMount() {
    this.loadProjects();
    this.loadHeaders();
    this.loadCategories();
  },

  methods: {
    changeCategory() {
      // alert("Change category");
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
          this.tableData = response.data;
          console.log(this.tableData);
        })
        .catch(error => {
          alert(error);
        });
    },

    triggerSearch() {
      this.filters[0].value = this.searchText;
      const email = this.$store.state.user.email;
      if (email == null || this.searchText === "") {
        return;
      }
      axios
        .post("/search", {
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

