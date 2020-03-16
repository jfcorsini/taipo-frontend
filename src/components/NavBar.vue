<template>
  <div class="flex justify-around items-center bg-orange-200 h-8 rounded rounded-b-none">
    <nav-bar-item name="Home" to="/" icon="home"/>
    <nav-bar-item name="Chats" to="/chats" icon="comments"/>
    <nav-bar-item name="Users" to="/users" icon="users"/>
    <div v-if="signedIn" @click="signOut">
      <nav-bar-item name="Sign Out" to="/#" icon="sign-out-alt"/>
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

<style lang="scss">
#nav {
  display: flex;
  justify-content: space-between;

  align-items: center;

  background-color: $color1-lighter;

  border-radius: 10px 0 0 0;
  a {
    font-size: 18px;
    color: #fff;
    text-decoration: none;

    &:hover {
      opacity: 0.7;
    }
  }
}
</style>