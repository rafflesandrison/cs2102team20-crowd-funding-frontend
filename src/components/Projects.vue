<template>
  <div>
      <el-row>
        <div style="margin-bottom: 10px">
        <el-col>
          <el-input placeholder="Search category" v-model="filters[0].value"></el-input>
        </el-col>
            </div>
      </el-row>
        <el-col>
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
        </el-col>
  </div>


</template>
<script>
import axios from 'axios'

export default {
  
  data() {
    return {
      titles: null,
      filters: [{
        prop: 'project_category',
        value: ''
      }],
      actionCol: {
        props: {
          label: 'Actions',
        },
        buttons: [{
          props: {
            type: 'primary'
          },
          handler: row => {
            this.$router.push(`project/${row.project_name}`)
          },
          label: 'Select'
        }]
      },
      selectedRow: [],
      categories: [],
      tableData: {},
      selectedValue: null,
      
    }
  },

  beforeMount() {
    this.loadProjects();
    this.loadCategories();
  },

  methods: {
    changeCategory() {
      // alert("Change category");
    },

    loadCategories() {
      axios
        .get("/categories")
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
        .catch((error) => {
          // Failure
          alert(error);
        });
      // this.$refs.table.refresh(); // Force a refresh
    },

    loadProjects() {
      axios
        .get("/projects")
        .then((response) => {
          this.tableData = response.data;
        })
        .catch((error) => {
          alert(error);
        });
    },

  },

};
</script>

