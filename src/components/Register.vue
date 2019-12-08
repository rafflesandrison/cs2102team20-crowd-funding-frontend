<template>
  <div class="container">
    <b-form @submit="onSubmit" @reset="onReset">
      <h3>Basic Information</h3>
      <p>Tell us more about yourself</p>
      <div class="form-group">
        <label for="name">Full Name</label>
        <input
          type="text"
          class="form-control"
          v-model="form.name"
          id="name"
          placeholder="e.g. Abi Dabi"
        />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          class="form-control"
          v-model="form.email"
          id="email"
          aria-describedby="emailHelp"
          placeholder="e.g. abidabi@gmail.com"
        />
      </div>
      <div class="form-group">
        <label for="contact">Contact number</label>
        <input
          type="number"
          class="form-control"
          id="contact"
          v-model="form.contact"
          placeholder="e.g. 91234567"
        />
      </div>
      <div class="form-group">
        <label for="password">Password (8 - 16 characters)</label>
        <input
          type="password"
          class="form-control"
          id="password"
          v-model="form.password"
          placeholder="Enter your password here"
        />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
          type="password"
          class="form-control"
          v-model="form.confirmPassword"
          id="confirmPassword"
          placeholder="Re-enter your password here"
        />
      </div>

      <button type="submit" class="btn btn-primary">Submit</button>
    </b-form>
  </div>
</template>
<script>
import axios from "axios";

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
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      if (
        this.form.name === "" ||
        this.form.email === "" ||
        this.form.contact === "" ||
        this.form.password === "" ||
        this.form.confirmPassword == ""
      ) {
        alert("Please ensure all fields are filled in.");
        return null;
      }
      if (this.form.password !== this.form.confirmPassword) {
        alert("Your input passwords are different");
        return null;
      }
      axios
        .post("http://localhost:3000/users/register", {
          name: this.form.name,
          email: this.form.email,
          contact: this.form.contact,
          password: this.form.password
        })
        .then(response => {
          if (response.data == "success") {
            alert("User Account Created, redirecting to login page.");
            this.$router.push("/login");
          } else if (response.data.name == "error") {
            alert(
              "Account is not created, the email or phone number might have already been used."
            );
          }
          console.log(response);
        })
        .catch(error => {
          alert("There is an error with our servers, please try again later.");
        });
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
