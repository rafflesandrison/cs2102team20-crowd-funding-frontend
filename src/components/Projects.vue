<template>
  <div>
       Categories:
       <select v-model="selectedValue" v-on:change="changeCategory">
         <option disabled value="">Please select one</option>
         <option v-for="item in categories" :key="item" :value="item">{{item}}</option>
     </select>

  <b-table ref="table" striped hover :items="categories"></b-table>
  </div>


</template>
<script>
import axios from 'axios'

export default {
  data() {
    return {
      categories: [],
      selectedValue: null,
    }
  },

  beforeMount() {
    this.loadCategories();
  },

  methods: {
    changeCategory() {
      alert("Change category");
    },

    loadCategories() {
      axios
        .get("http://localhost:3000/categories")
        .then((response) => {
            this.categories = response.data;
          })
        .catch((error) => {
          // Failure
          alert(error);
        });
      this.$refs.table.refresh(); // Force a refresh
    }

  },

};
</script>
