<template>
  <div v-if="hydrated" class="w-4/12 p-2 flex flex-col items-center border-solid border-gray-400 border-l-2">
    <div class="flex-grow overflow-y-hidden bg-white rounded-lg w-10/12">
      <div class="border-b-2 border-solid border-gray-400">
        <h3 class="text-lg mt-1 p-2">Current users</h3>
      </div>
      <div class="ml-2 mt-1">
        <div v-for="username in members" v-bind:key="username">
          <router-link tag="p" v-bind:to="'/users/' + username">
            <a class="text-base font-thin leading-6 underline">{{ username }}</a>
          </router-link>
        </div>
      </div>
    </div>

    <div class="flex-grow overflow-y-hidden bg-white rounded-lg w-10/12 mt-8">
      <div class="border-b-2 border-solid border-gray-400">
        <h3 class="text-lg mt-1 p-2">Add users</h3>
      </div>
      <div class="ml-2 mt-1">
        <input class="rounded-sm p-1 bg-gray-200 w-6/12" v-model="usernameFilter" placeholder="Filter" />
        <button class="ml-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline" @click="addMembers">
          Add
        </button>
        <div v-for="user in nonMembers" v-bind:key="user.username">
          <input type="checkbox" :id="user.username" :value="user.username" v-model="selectedUsers" />
          <label :for="user.username">{{ user.username }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { API, graphqlOperation } from "aws-amplify";
import { debounce } from "lodash";

const searchUsersQuery = `query searchUsers($username: String) {
  searchUsers(input: {username: $username}) {
    username
    email
  }
}`;

const addMembersMutation = `mutation putMembersToChat($chatId: ID!, $usernames: [String]!) {
    putMembersToChat(input: { chatId: $chatId, usernames: $usernames }) {
      chatId
      username
    }
  }`;

export default {
  name: "add-users-list",

  async mounted() {
    await this.$apollo.provider.defaultClient.hydrated();
    this.debouncedSearchUsers = debounce(this.searchUsers, 500);
    this.searchUsers();
    this.hydrated = true;
  },

  data() {
    return {
      hydrated: false,
      usernameFilter: "",
      usersFound: [],
      selectedUsers: []
    };
  },

  props: {
    members: Array,
    chatId: String
  },

  watch: {
    // whenever usernameFilter changes, this function will run
    usernameFilter: function() {
      this.debouncedSearchUsers();
    }
  },

  computed: {
    // Remove from the list the users that are already on the group
    nonMembers() {
      return this.usersFound.filter(
        ({ username }) => !this.members.includes(username)
      );
    }
  },

  methods: {
    async searchUsers() {
      const response = await API.graphql(
        graphqlOperation(searchUsersQuery, {
          username: this.usernameFilter || null
        })
      );

      this.usersFound = response.data.searchUsers;
    },

    async addMembers() {
      await API.graphql(
        graphqlOperation(addMembersMutation, {
          chatId: this.chatId,
          usernames: this.selectedUsers
        })
      );

      this.$emit("members-added", this.selectedUsers);
      this.usersFound = [];
      this.selectedUsers = [];
      this.usernameFilter = null;
    }
  }
};
</script>