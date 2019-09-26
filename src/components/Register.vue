<template>
  <div class="container">
    <b-form @submit="onSubmit" @reset="onReset">
      <h3>Basic Information</h3>
      <p>Tell us more about yourself</p>
      <div class="form-group">
        <label for="name">Full Name</label>
        <input type="text" class="form-control" v-model="form.name" id="name" placeholder="e.g. Abi Dabi">
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" class="form-control" v-model="form.email" id="email" aria-describedby="emailHelp" placeholder="e.g. abidabi@gmail.com">
      </div>
      <div class="form-group">
        <label for="contact">Contact number</label>
        <input type="number" class="form-control" id="contact" v-model="form.contact" placeholder="e.g. 91234567">
      </div>
      <div class="form-group">
        <label for="password">Password (8 - 16 characters)</label>
        <input type="password" class="form-control" id="password" v-model="form.password" placeholder="Enter your password here">
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input type="password" class="form-control" v-model="form.confirmPassword" id="confirmPassword" placeholder="Re-enter your password here">
      </div>

      <button type="submit" class="btn btn-primary">Submit</button>
    </b-form>
  </div>

</template>
<script>
export default {
  data() {
      return {
        form: {
          name: "",
          email: "",
          contact: "",
          password: "",
          confirmPassword: ""
      }
    }
  },
  methods : {
    onSubmit(evt) {
      evt.preventDefault();
      if(this.form.password !== this.form.confirmPassword) {
         alert("Your input passwords are different");
         return null;
      }
      return {
        email: this.form.email,
        password: this.form.password,
        contact: this.form.contact
      }
    },

    onReset(evt) {
      evt.preventDefault();
      this.form = {
        name: "",
        email: "",
        contact: "",
        password: "",
        confirmPassword: ""
      };
    }
  }

};
</script>
