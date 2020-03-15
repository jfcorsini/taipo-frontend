<template>
  <div>
    <form>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
          Username
        </label>
        <input v-model="form.username" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username">
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
          Password
        </label>
        <input v-model="form.password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Password">
      </div>
      <div class="text-center">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" v-on:click="signIn" type="button">
          Sign In
        </button>
      </div>
    </form>
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