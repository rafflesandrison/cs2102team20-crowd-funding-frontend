<script src="https://unpkg.com/axios/dist/axios.min.js"></script>

<template>
  <b-container fluid>
    <b-row>
      <b-col sm="5" style="margin-top: 120px">
        <h1 style="font-size: 70px">It's good to see you again!</h1>
      </b-col>
    </b-row>
    <b-row align-h="center">
      <b-col
        style="margin-top: 240px; max-width: 700px"
        align-self="center"
        xl="5"
        lg="6"
        md="7"
        sm="9"
      >
        <b-form @submit="onSubmit" @reset="onReset">
          <b-form-group id="email-group" label="Email address:" label-for="email">
            <b-form-input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="Enter email"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="password-group" label="Password:" label-for="password">
            <b-form-input
              id="password"
              v-model="form.password"
              type="password"
              required
              placeholder="Password"
            ></b-form-input>
          </b-form-group>

          <b-button style="margin: 2px" type="submit" variant="primary">Log In</b-button>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import axios from 'axios';
  export default {
    data() {
      return {
        form: {
          username: '',
          password: '',
        }
      }
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      alert(this.form.email + " " + this.form.password);
      return {
        email: this.form.email,
        password: this.form.password
      };
    },
    methods: {
      onSubmit(evt) {
        evt.preventDefault();
        axios.post('http://localhost:3000/login', {
          username: this.form.email,
          password: this.form.password
        })
          .then(function(response) {
            alert(response);
          });
      },
      onReset(evt) {
        evt.preventDefault()
        // Reset our form values
        this.form.email = '';
        this.form.password = '';
      }
    }
  }
};
</script>
