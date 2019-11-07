<template>
  <b-form @submit="editProject" @reset="onReset">
    <b-form-group
      id="input-group-project-name"
      label="Project Name:"
      label-for="input-project-title"
    >
      <b-form-input
        id="input-project-title"
        v-model="project.project_name"
        type="text"
        required
        @focus="clearStatus"
        @keypress="clearStatus"
        :class="{'is-invalid': formStatus.nameError}"
      ></b-form-input>
      <small
        v-if="formStatus.nameError"
        id="passwordHelp"
        class="text-danger col-sm-3"
      >Project name already exists. Please choose another name.</small>
    </b-form-group>

    <b-form-group id="input-group-category" label="Category:" label-for="input-category">
      <b-form-select
        id="input-category"
        v-model="project.project_category"
        :options="categories"
        required
      ></b-form-select>
    </b-form-group>

    <b-form-group id="input-group-image-url" label="Image Url:" label-for="input-image-url">
      <b-form-input
        id="input-image-url"
        v-model="project.project_image_url"
        placeholder="E.g. https://unsplash.com/photos/hD5HgJzhjG4"
      ></b-form-input>
    </b-form-group>

    <b-form-group id="input-group-deadline" label="Project End Date:" label-for="input-deadline">
      <b-form-input id="input-deadline" v-model="project.project_deadline" type="date" required></b-form-input>
    </b-form-group>

    <b-form-group
      id="input-group-funding-goal"
      label="Funding Goal: "
      label-for="input-funding-goal"
    >
      <b-form-input
        id="input-funding-goal"
        v-model="project.project_funding_goal"
        type="number"
        required
      ></b-form-input>
    </b-form-group>

    <b-form-group
      id="input-group-description"
      label="Project Description: "
      label-for="textarea-description"
    >
      <b-form-textarea
        id="textarea-description"
        v-model="project.project_description"
        placeholder="Tell us more about your project..."
        rows="3"
        max-rows="16"
      ></b-form-textarea>
    </b-form-group>

    <h3>Rewards</h3>
    <div v-for="(reward, index) in rewards" :key="index" class="card reward">
      <b-form-group id="input-reward-name" label="Reward Name:" label-for="input-reward-name">
        <b-form-input id="input-reward-name" v-model="reward.reward_name" type="text" required></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-reward-pledge-amount"
        label="Reward Pledge Amount:"
        label-for="input-reward-pledge-amount"
      >
        <b-form-input
          id="input-reward-pledge-amount"
          v-model="reward.reward_pledge_amount"
          type="number"
          step=".01"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-reward-description"
        label="Reward Description: "
        label-for="textarea-reward-description"
      >
        <b-form-textarea
          id="textarea-reward-description"
          v-model="reward.reward_description"
          placeholder="Tell us more about the reward..."
          rows="3"
          max-rows="16"
        ></b-form-textarea>
      </b-form-group>
    </div>
    <b-button variant="success" @click="addMoreReward">Add More Reward</b-button>
    <b-button type="submit" variant="primary">Submit</b-button>
  </b-form>
</template>

<script>
export default {
  name: "EditProjectForm",
  props: {
    project: Object,
      rewards: Array,
  },
  data() {
    return {
      // Convenience population of data, to be removed before production
      form: {
        projectName: "",
        projectCategory: "",
        projectImageUrl: "",
        projectDeadline: "",
        projectFundingGoal: "",
        projectDescription: "",
        projectRewards: []
      },
      formStatus: {
        nameError: false
      },
      categories: ["Arts", "Crafts", "Electronics", "Games"]
    };
  },
  methods: {
    onReset() {
      // Reset our form values
      this.form.projectName = "";
      this.form.projectCategory = "";
      this.form.projectImageUrl = "";
      this.form.projectDeadline = "";
      this.form.projectFundingGoal = "";
      this.form.projectDescription = "";
    },
    editProject() {
      // replace multi whitespaces with single space and remove extra space on both ends
      var parsedProjectName = this.project.project_name
          .replace(/\s+\s/g, " ")
          .trim();
      //console.log(this.projectNames.toString())
      //console.log(parsedProjectName)
      //console.log(this.projectNames.indexOf(parsedProjectName));
      if (this.projectNames.indexOf(parsedProjectName) >= 0) {
        this.formStatus.nameError = true;
        return;
      }
      this.form.projectName = parsedProjectName;
      this.$emit("create:project", {
          project_name: this.project.project_name,
          projectCategory: this.project.project_category,
          projectImageUrl: this.project.project_image_url,
          projectDeadline: this.project.project_deadline,
          projectFundingGoal: this.project.project_funding_goal,
          projectDescription: this.project.project_description,
          projectRewards: this.rewards
      });
    },
    addMoreReward() {
      this.form.projectRewards.push({
        rewardName: "",
        rewardPledgeAmount: "",
        rewardDescription: ""
      });
    },
    clearStatus() {
      this.formStatus.nameError = false;
    }
  }
};
</script>

<style scoped>
</style>