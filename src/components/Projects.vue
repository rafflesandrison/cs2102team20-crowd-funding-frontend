<template>
  <div>
       Categories:
       <select v-model="selectedValue" v-on:change="changeCategory">
         <option disabled value="">Please select one</option>
         <option v-for="item in categories" :key="item" :value="item">{{item}}</option>
     </select>

  <b-table ref="table" hover
    :items="tableData"
    :fields="fields"
    :filter="filter"
    :sort-by.sync="sortBy"
    :sort-desc.sync="sortDesc"
    responsive="sm"
    />
  </div>


</template>
<script>
import axios from 'axios'

export default {
  
  data() {
    return {
      fields: null,
      filter: null,
      sortBy: 'age',
      sortDesc: false,
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
        .get("http://localhost:3000/categories")
        .then((response) => {
          var tempFields = [];
          response.data.fields.forEach((field) => {
            tempFields.push({
              key: field.name,
              sortable: true
            })
            this.fields = tempFields;
          })
        })
        .catch((error) => {
          // Failure
          alert(error);
        });
      // this.$refs.table.refresh(); // Force a refresh
    },

    loadProjects() {
      axios
        .get("http://localhost:3000/projects")
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
