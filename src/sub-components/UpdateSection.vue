<template>
  <b-container class="bv-example-row">
    <h2>Project Update</h2>
    <b-button v-if="isNewUpdatePossible" v-b-modal.modal-add-update>Add Update</b-button>
    <b-modal @ok="createNewUpdate" id="modal-add-update" centered title="Add an Update">
      <b-container>
        <b-row align-v="center">
          <b-col sm="3">
            <label for="updateTitle">Update Title</label>
          </b-col>
          <b-col>
            <b-input-group>
              <b-form-input v-model="new_update_title" id="updateTitle"></b-form-input>
            </b-input-group>
          </b-col>
        </b-row>
        <b-row class="mt-1" align-v="center">
          <b-col sm="3">
            <label for="updateDescription">Update Title</label>
          </b-col>
          <b-col>
            <b-input-group>
              <b-form-textarea
                v-model="new_update_description"
                id="updateDescription"
                placeholder="Enter something..."
              ></b-form-textarea>
            </b-input-group>
          </b-col>
        </b-row>
      </b-container>
    </b-modal>
    <b-card
      :title="update.project_title"
      tag="article"
      style="max-width: 60rem;"
      class="mb-2"
      v-for="(update, index) in updates"
      :key="index"
    >
      <b-card-text>
        <h4>{{update.update_title}}</h4>
        <p>{{update.update_description}}</p>
      </b-card-text>
    </b-card>
  </b-container>
</template>

<script>
import axios from "axios";
export default {
  name: "UpdateSection",
  data() {
    return {
      isNewUpdatePossible: false,
      new_update_title: "",
      new_update_description: ""
    };
  },
  beforeMount() {
    this.checkIfCreator();
  },
  props: {
    updates: Array
  },
  methods: {
    createNewUpdate(bvModalEvt) {
      bvModalEvt.preventDefault();
      axios.post("http://localhost:3000/update/create", {
        project_name: this.$route.params.projectName,
        update_title: this.new_update_title,
        update_description: this.new_update_description
      });

      this.resetNewUpdateModal();
    },
    resetNewUpdateModal() {
      this.new_update_title = "";
      this.new_update_description = "";
    },
    checkIfCreator() {
      axios
        .post("http://localhost:3000/projects/creator", {
          project_name: this.$route.params.projectName
        })
        .then(creator => {
          if (creator.data.email === this.$store.state.user.email) {
            this.isNewUpdatePossible = true;
          }
        })
        .catch(() => alert("Error Determining Creator of Project."));
    }
  }
};
</script>

<style scoped>
</style>
