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
        <input v-model="form.password" v-on:keyup.enter="signIn"  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Password">
      </div>
      <div class="text-center">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" v-on:click="signIn" type="button">
          Sign In
        </button>
      </div>
      <p v-if="error" class="text-sm mt-2 text-red-600">
        {{ error }}
      </p>
    </form>
  </div>
</template>

<script>
import { Auth, API, graphqlOperation } from "aws-amplify";
import { AmplifyEventBus } from "aws-amplify-vue";
import NProgress from 'nprogress';

const putUserMutationQuery = `mutation putUser($username: String!, $email: String!, $identityId: String!) {
  putUser(input: { username: $username, email: $email, identityId: $identityId }) {
    username
  }
}`;

export default {
  name: "sign-in",

  data() {
    return {
      error: null,
      form: {
        username: "",
        password: ""
      }
    };
  },

  methods: {
    async signIn() {
      NProgress.start();
      const { username, password } = this.form;

      try {
        const { attributes } = await Auth.signIn(username, password);
        const { identityId } = await Auth.currentCredentials();

        await API.graphql(
          graphqlOperation(putUserMutationQuery, {
            email: attributes.email,
            username,
            identityId
          })
        );

        AmplifyEventBus.$emit("authState", "signedIn");
        this.$router.push("/chats");
      } catch (error) {
        this.error = error.message;
      } finally {
        NProgress.done();

      }
    }
  }
};
</script>