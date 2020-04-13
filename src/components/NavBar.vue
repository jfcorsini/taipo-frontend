<template>
  <div class="flex flex-col justify-between items-center bg-white rounded rounded-r-none w-24">
    <div>
      <nav-bar-item to="home" icon="home"/>
    </div>
    <div class="justify-around">
      <nav-bar-item to="chats" icon="comments"/>
      <nav-bar-item to="users" icon="users"/>
      <nav-bar-item to="notifications" icon="bell"/>
    </div>
    <div>
      <div v-if="signedIn" @click="signOut">
        <nav-bar-item  to="auth" icon="sign-out-alt"/>
      </div>
    </div>
  </div>
</template>

<script>
import { AmplifyEventBus } from "aws-amplify-vue";
import { Auth } from "aws-amplify";
import NavBarItem from './NavBarItem'

const signOutConfig = {
  signOutButton: "Sign Out nooow" // type: string, default: 'Sign Out', required: false
};

export default {
  name: "nav-bar",

  components: {
    NavBarItem,
  },

  data() {
    return {
      signedIn: false,
      signOutConfig
    };
  },
  methods: {
    async signOut() {
      await Auth.signOut();
      AmplifyEventBus.$emit("authState", "signedOut");
      this.$router.push("/");
    }
  },
  async beforeCreate() {
    try {
      await Auth.currentAuthenticatedUser();
      this.signedIn = true;
    } catch (err) {
      this.signedIn = false;
    }
    AmplifyEventBus.$on("authState", info => {
      if (info === "signedIn") {
        this.signedIn = true;
      } else {
        this.signedIn = false;
      }
    });
  }
};
</script>