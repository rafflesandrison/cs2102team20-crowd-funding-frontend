<template>
  <div class="create-form container fluid">
    <b-form @submit="onSubmit" @reset="onReset">
      <b-form-group id="input-group-project-name" label="Project Name:" label-for="input-project-title">
        <b-form-input
                id="input-project-title"
                v-model="form.projectName"
                type="text"
                required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-category" label="Category:" label-for="input-category">
        <b-form-select
                id="input-category"
                v-model="form.projectCategory"
                :options="categories"
                required
        ></b-form-select>
      </b-form-group>

      <b-form-group id="input-group-image-url" label="Image Url:" label-for="input-image-url">
        <b-form-input
                id="input-image-url"
                v-model="form.projectImageUrl"
                placeholder="E.g. https://unsplash.com/photos/hD5HgJzhjG4"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-deadline" label="Project End Date:" label-for="input-deadline">
        <b-form-input
                id="input-deadline"
                v-model="form.projectDeadline"
                type="date"
                required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-funding-goal" label="Funding Goal: " label-for="input-funding-goal">
        <b-form-input
                id="input-funding-goal"
                v-model="form.projectFundingGoal"
                type="number"
                required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-description" label="Project Description: " label-for="textarea-description">
        <b-form-textarea
                id="textarea-description"
                v-model="form.projectDescription"
                placeholder="Tell us more about your project..."
                rows="3"
                max-rows="16"
        ></b-form-textarea>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
    <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ form }}</pre>
    </b-card>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    data() {
      return {
        // Convenience population of data, to be removed before production
        form: {
          projectName: 'Aer',
          projectCategory: 'Crafts',
          projectImageUrl: 'image.com',
          projectDeadline: "2019-10-15",
          projectFundingGoal: '45000',
          projectDescription: 'Good bag that is good'
        },
        categories: ['Arts', 'Crafts', 'Electronics', 'Games']
      }
    },
    methods: {
      onSubmit(evt) {
        evt.preventDefault()
        axios
                .post("http://localhost:3000/create", {
                  projectName: this.form.projectName,
                  projectCategory: this.form.projectCategory,
                  projectImageUrl: this.form.projectImageUrl,
                  projectDeadline: this.form.projectDeadline,
                  projectFundingGoal: this.form.projectFundingGoal,
                  projectDescription: this.form.projectDescription,
                })
                .then(
                        function(response) {
                          alert("Project Created!");
                        },
                        function(response) {
                          alert("Unable to create project");
                        }
                );
      },
      onReset(evt) {
        evt.preventDefault()
        // Reset our form values
        this.form.projectName = ''
        this.form.projectCategory = ''
        this.form.projectImageUrl = ''
        this.form.projectDeadline = ''
        this.form.projectFundingGoal = ''
        this.form.projectDescription = ''
      }
    }
  }
</script>

<style>
  .create-form {
    text-align: left;
  }
</style>