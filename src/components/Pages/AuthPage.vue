<template>
  <div class="auth" :style="{ backgroundImage: `url(${backgroundUrl})` }">
    <div class="auth-form">
      <sign-up :toggle="toggle" v-if="formState === 'signUp'"></sign-up>
      <sign-in v-if="formState === 'signIn'"></sign-in>

      <div v-on:click="toggle" class="toggle">
        <p v-if="formState === 'signUp'">
          Already sign up?
          <span>Sign In</span>
        </p>
        <p v-else>
          Need an account?
          <span>Sign Up</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import SignUp from "../SignUp";
import SignIn from "../SignIn";

import backgroundUrl from "@/assets/imgs/heather-lo--BjAQ218NaM-unsplash.jpg";

export default {
  name: "app",
  data() {
    return {
      formState: "signIn",
      backgroundUrl
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

<style lang="scss">
.auth {
  height: 100vh;
  max-width: 100%;

  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;

  button {
    background-color: $color1-dark;

    &:hover {
      background-color: $color1-light;
    }
  }

  .auth-form {
    min-height: 320px;
    max-height: 420px;
    width: 460px;
    margin: 20px 30px;
    margin: 0 auto;

    background-color: white;
    border-radius: 15px;

    .toggle {
      cursor: pointer;
      font-size: 12px;
      margin: 20px;

      span {
        color: $color1-dark;
      }
    }
  }
}
</style>