<template>
  <div class="container">
    <h2>{{ formState === 'signUp' ? 'Create account' : 'Confirm Sign Up' }}</h2>
    <b-form v-if="formState === 'signUp'">
      <b-form-group id="signup-username-group" label="Username" label-for="signup-username">
        <b-form-input id="signup-username" v-model="form.username" />
      </b-form-group>
      <b-form-group id="signup-password-group" label-for="signup-password" label="Password">
        <b-form-input id="signup-password" type="password" v-model="form.password" required />
      </b-form-group>
      <b-form-group id="signup-email-group" label="Email" label-for="signup-email">
        <b-form-input id="signup-email" v-model="form.email" />
      </b-form-group>
      <b-button v-on:click="signUp">Sign Up</b-button>
    </b-form>
    <b-form v-if="formState === 'confirmSignUp'">
      <b-form-group
        id="signup-authorization-group"
        label="Authorization code"
        label-for="signup-authorization"
      >
        <b-form-input v-model="form.authCode" id="signup-authorization" />
      </b-form-group>
      <b-button v-on:click="confirmSignUp">Confirm Sign Up</b-button>
    </b-form>
  </div>
</template>

<script>
import { Auth } from "aws-amplify";

export default {
  name: "home",
  props: ["toggle"],
  data() {
    return {
      formState: "signUp",
      form: {
        username: "",
        password: "",
        email: "",
        authCode: ""
      }
    };
  },
  methods: {
    async signUp() {
      const { username, password, email } = this.form;
      await Auth.signUp({
        username,
        password,
        attributes: { email }
      });
      this.formState = "confirmSignUp";
    },
    async confirmSignUp() {
      const { username, authCode } = this.form;
      await Auth.confirmSignUp(username, authCode);
      alert("successfully signed up! Sign in to view the app.");
      this.toggle();
    }
  }
};
</script>
