<template>
  <div class="container">
    <form v-if="formState === 'signUp'">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
          Username
        </label>
        <input v-model="form.username" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username">
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
          Email
        </label>
        <input v-model="form.email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Email">
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
          Password
        </label>
        <input v-model="form.password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Password">
      </div>
      <div class="text-center">
        <button v-on:click="signUp" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
          Sign Up
        </button>
      </div>
    </form>
    <form v-if="formState === 'confirmSignUp'">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="signup-authorization">
          Code
        </label>
        <input v-model="form.authCode" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="signup-authorization" type="text" placeholder="Authorization code">
      </div>
      <div class="text-center">
        <button v-on:click="confirmSignUp" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
          Confirm
        </button>
      </div>
    </form>
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
