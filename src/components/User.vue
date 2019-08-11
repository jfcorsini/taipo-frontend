<template>
  <div class="home" v-if="hydrated">
    <amplify-connect :query="getUser">
      <template slot-scope="{loading, data, errors}">
        <div v-if="loading">Loading...</div>

        <div v-else-if="errors.length > 0"></div>
        <div v-else-if="data">
          <h1>{{ data.getUser.username }}</h1>
          <h3>Email: {{ data.getUser.email }}</h3>
          <p>Last login: {{ data.getUser.lastLogin }}</p>
        </div>
      </template>
    </amplify-connect>
  </div>
</template>

<script>
import { Auth } from "aws-amplify";
import { components } from "aws-amplify-vue";

const getUser = `query getUser($username: String!) {
  getUser(input: {username: $username}) {
    username
    email
    lastLogin
  }
}`;

export default {
  name: "chat",

  async mounted() {
    await this.$apollo.provider.defaultClient.hydrated();
    this.hydrated = true;
  },

  data() {
    return {
      hydrated: false
    };
  },

  components: {
    ...components
  },

  computed: {
    getUser() {
      return this.$Amplify.graphqlOperation(getUser, {
        username: this.$route.params.username
      });
    }
  }
};
</script>