<template>
  <div>
    <h2>Sign In</h2>
    <div class="formcontainer">
      <input v-model="form.username" class="input" placeholder="Username" />
      <input type="password" v-model="form.password" class="input" placeholder="Password" />
      <button v-on:click="signIn" class="button">Sign In</button>
    </div>
  </div>
</template>

<script>
import { Auth, API, graphqlOperation } from "aws-amplify";
import { AmplifyEventBus } from "aws-amplify-vue";

const putUserMutationQuery = `mutation putUser($username: String!, $email: String!) {
  putUser(input: { username: $username, email: $email }) {
    username
  }
}`;

export default {
  name: "home",

  data() {
    return {
      form: {
        username: "",
        password: ""
      }
    };
  },

  methods: {
    async signIn() {
      const { username, password } = this.form;
      const { attributes } = await Auth.signIn(username, password);

      await API.graphql(
        graphqlOperation(putUserMutationQuery, {
          email: attributes.email,
          username
        })
      );

      AmplifyEventBus.$emit("authState", "signedIn");
      this.$router.push("/chats");
    }
  }
};
</script>