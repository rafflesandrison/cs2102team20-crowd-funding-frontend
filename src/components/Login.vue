<template>
  <div class="container mx-auto mt-5" @submit="onSubmit" @reset="onReset">
    <b-form inline class="form-group">

      <label class="sr-only" for="inline-form-input-name">Email</label>
      <b-input
        id="inline-form-input-name"
        class="mb-2 mr-sm-2 mb-sm-0"
        v-model="form.email"
        placeholder="abcde@gmail.com"
      ></b-input>

      <label class="sr-only" for="inline-form-input-username">Password</label>
      <b-input-group prepend="" class="mb-2 mr-sm-2 mb-sm-0">
        <b-input id="inline-form-input-username" v-model="form.password" placeholder="Password" type="password"></b-input>
      </b-input-group>

      <b-button type="submit" variant="primary">Login</b-button>
      <b-button variant="primary" class="ml-2" @click="showModal">Sign-up</b-button>

    </b-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          username: '',
          password: '',
        }
      }
    },
    methods: {
      onSubmit(evt) {
        evt.preventDefault();
        return {
          email: this.form.email,
          password: this.form.password
        }
      },
      onReset(evt) {
        evt.preventDefault()
        // Reset our form values
        this.form.email = '';
        this.form.password = '';
      }
    }
  }
</script>
