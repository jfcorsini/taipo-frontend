<template>
  <div class="h-screen flex justify-center items-center bg-gray-200">
    <div v-if="!signedIn">
        <router-view></router-view>
    </div>
    <div v-else class="w-10/12 border border-gray-700 shadow shadow-xl rounded-md">
      <div class="bg-white py-2 pr-2 rounded-lg">
        <div id="main" class="bg-gray-200 flex h-screen">
            <nav-bar class="flex-grow-0"/>
            <router-view class="flex-grow"></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AmplifyEventBus } from "aws-amplify-vue";
import { Auth } from "aws-amplify";
import NavBar from "./components/NavBar";

const signOutConfig = {
  signOutButton: "Sign Out nooow" // type: string, default: 'Sign Out', required: false
};

export default {
  name: "app",

  components: {
    NavBar
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
#main {
  height: 80vh;
}
</style>
