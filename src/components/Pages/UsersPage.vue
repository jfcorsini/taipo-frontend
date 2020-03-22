<template>
  <div v-if="hydrated" class="h-full flex">
    <div class="w-3/12 border border-solid border-gray-300 shadow shadow-sm h-full overflow-y-auto">
      <amplify-connect :query="searchUsersQuery">
        <template slot-scope="{loading, data, errors}">
          <div class="m-1 h-8">
            <input
              class="text-gray-700 text-sm h-full w-10/12 py-2 px-1"
              v-model="usernameFilter" placeholder="Filter by username"
            />
          </div>
          <div v-if="loading">Loading...</div>

          <div v-else-if="errors.length > 0"></div>
          <div v-else-if="data">
            <div v-for="item in data.searchUsers" v-bind:key="item.username">
              <div v-if="item.username !== authUsername" class="bg-white shadow-xs mb-2 mx-px font-light text-base cursor-pointer hover:bg-green-300 active:bg-green-400">
                <router-link tag="p" v-bind:to="'/users/' + item.username" class="inline-block h-16 w-full">
                <div class="ml-8 mt-6">
                  {{ item.username }}
                </div>
                </router-link>
              </div>
            </div>
          </div>
        </template>
      </amplify-connect>
    </div>
    <div class="w-9/12">
      <router-view></router-view>
    </div>
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
    ...components,
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