<template>
  <div class="home" v-if="hydrated">
    <input v-model="usernameFilter" placeholder="Filter by username" />
    <amplify-connect :query="searchUsersQuery">
      <template slot-scope="{loading, data, errors}">
        <div v-if="loading">Loading...</div>

        <div v-else-if="errors.length > 0"></div>
        <div v-else-if="data">
          <ul>
            <div v-for="item in data.searchUsers" v-bind:key="item.username">
              <li>{{ item.username }}</li>
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

let user;

export default {
  name: "chat",

  async mounted() {
    await this.$apollo.provider.defaultClient.hydrated();
    this.hydrated = true;
  },

  data() {
    return {
      hydrated: false,
      usernameFilter: ""
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