<template>
  <div id="app">
    <div v-if="!signedIn">
      <router-view></router-view>
    </div>
    <div v-else class="nav">
      <router-link class="nav-item" tag="p" to="/">
        <a class="nav-link">Home</a>
      </router-link>
      <router-link class="nav-item" tag="p" to="/chats">
        <a class="nav-link">Chats</a>
      </router-link>
      <router-link class="nav-item" tag="p" to="/users">
        <a class="nav-link">Users</a>
      </router-link>
      <div class="sign-out">
        <button v-if="signedIn" v-on:click="signOut" class="button">Sign out</button>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { AmplifyEventBus } from "aws-amplify-vue";
import { Auth } from "aws-amplify";

const signOutConfig = {
  signOutButton: "Sign Out nooow" // type: string, default: 'Sign Out', required: false
};

export default {
  name: "app",

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

<style>
.nav {
  display: flex;
}
.nav p {
  padding: 0px 30px 0px 0px;
  font-size: 18px;
  color: #000;
}
.nav p:hover {
  opacity: 0.7;
}
.nav p a {
  text-decoration: none;
}
.signout {
  background-color: #38a31e;
  margin: 0;
  padding: 11px 0px 1px;
}
</style>