<template>
  <div class="container">
    <h2>Sign In</h2>
    <b-form>
      <b-form-group id="signin-username-group" label="Username" label-for="signin-username">
        <b-form-input v-model="form.username" id="signin-username" required />
      </b-form-group>
      <b-form-group id="signin-password-group" label="Password" label-for="signin-password">
        <b-form-input v-model="form.password" id="signin-password" type="password" required />
      </b-form-group>
      <b-button v-on:click="signIn" type="submit">Sign In</b-button>
    </b-form>
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