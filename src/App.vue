<template>
  <div id="app">
    <div id="chat-container">
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


<style lang="scss">
#app {
  height: 100vh;
  background: linear-gradient(to left, $color1-dark 0%, $color1-light 100%);

  display: flex;
  justify-content: center;
  align-items: center;
}

#chat-container {
  min-width: 800px;
  max-width: 1000px;
  max-height: 800px;
  height: 95vh;
  background: #fff;
  border-radius: 10px;

  flex-grow: 1;

  display: flex;
}

#page {
  display: flex;
  flex-grow: 1;
}

#side-bar {
  border-radius: 10px 10px 0 0;
  width: 300px;
  height: 100%;
}

#main-window {
  background-color: $color2-light;
  border-radius: 0 10px 10px 0;

  display: flex;
  flex-grow: 1;
}
</style>