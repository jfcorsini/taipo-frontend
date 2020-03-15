<template>
    <div  class="w-full max-w-xs bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 min-h-full">
      <h2 class="text-2xl font-light pb-6 text-center">
        <span v-on:click="toggle" v-bind:class="{ 'underline text-blue-600': formState === 'signIn', 'cursor-pointer': formState !== 'signIn' }">Sign In</span>
        /
        <span v-on:click="toggle" v-bind:class="{ 'underline text-blue-600': formState === 'signUp', 'cursor-pointer': formState !== 'signUp'}">Sign Up</span>
      </h2>
      <sign-up :toggle="toggle" v-if="formState === 'signUp'"></sign-up>
      <sign-in v-if="formState === 'signIn'"></sign-in>
    </div>
</template>

<script>
import SignUp from "../SignUp";
import SignIn from "../SignIn";

export default {
  name: "app",
  data() {
    return {
      formState: "signIn",
    };
  },
  methods: {
    toggle() {
      this.formState === "signUp"
        ? (this.formState = "signIn")
        : (this.formState = "signUp");
    }
  },
  components: {
    SignUp,
    SignIn
  }
};
</script>