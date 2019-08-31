<template>
  <div class="home" v-if="hydrated">
    <input v-model="usernameFilter" placeholder="Filter by username" />
    <amplify-connect :query="searchUsersQuery">
      <template slot-scope="{loading, data, errors}">
        <div v-if="loading">Loading...</div>

        <div v-else-if="errors.length > 0"></div>
        <div v-else-if="data">
          <ul>
            <!-- eslint-disable vue/no-use-v-if-with-v-for -->
            <div
              v-for="item in data.searchUsers"
              v-bind:key="item.username"
              v-if="item.username !== authUsername"
            >
              <router-link tag="p" v-bind:to="'/users/' + item.username">
                <a>{{ item.username }}</a>
              </router-link>
            </div>
          </ul>
        </div>
      </template>
    </amplify-connect>
  </div>
</template>

<script>
import { Auth } from "aws-amplify";
import { components } from "aws-amplify-vue";

const searchUsersQuery = `query searchUsers($username: String) {
  searchUsers(input: {username: $username}) {
    username
    email
  }
}`;

export default {
  name: "users-page",

  async mounted() {
    await this.$apollo.provider.defaultClient.hydrated();
    this.authUsername = (await Auth.currentAuthenticatedUser()).username;
    this.hydrated = true;
  },

  data() {
    return {
      hydrated: false,
      usernameFilter: "",
      authUsername: null
    };
  },

  components: {
    ...components
  },

  computed: {
    searchUsersQuery() {
      return this.$Amplify.graphqlOperation(searchUsersQuery, {
        username: this.usernameFilter || null
      });
    }
  }
};
</script>