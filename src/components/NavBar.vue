<template>
  <div id="nav">
    <router-link class="nav-item" tag="p" to="/">
      <a class="nav-link">
        <font-awesome-icon icon="home" />
      </a>
    </router-link>
    <router-link class="nav-item" tag="p" to="/chats">
      <a class="nav-link">
        <font-awesome-icon icon="comments" />
      </a>
    </router-link>
    <router-link class="nav-item" tag="p" to="/users">
      <a class="nav-link">
        <font-awesome-icon icon="users" />
      </a>
    </router-link>
    <router-link class="nav-item" tag="p" to="/#" v-if="signedIn" v-on:click.native="signOut">
      <a class="nav-link">
        <font-awesome-icon icon="sign-out-alt" />
      </a>
    </router-link>
  </div>
</template>

<script>
import { AmplifyEventBus } from "aws-amplify-vue";
import { Auth } from "aws-amplify";

const signOutConfig = {
  signOutButton: "Sign Out nooow" // type: string, default: 'Sign Out', required: false
};

export default {
  name: "nav-bar",

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