<template>
  <div v-if="hydrated">
    <div>
      <h2>Current users</h2>
      <ul>
        <li v-for="username in members" v-bind:key="username">{{ username }}</li>
      </ul>
    </div>
    <div>
      <h2>Add users to this chat</h2>
      <input v-model="usernameFilter" placeholder="Filter by username" />
      <button @click="addMembers">Add members</button>
      <div v-for="user in nonMembers" v-bind:key="user.username">
        <input type="checkbox" :id="user.username" :value="user.username" v-model="selectedUsers" />
        <label :for="user.username">{{ user.username }}</label>
      </div>
    </div>
  </div>
</template>

<script>
import { API, Auth, graphqlOperation } from "aws-amplify";
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

let user;

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
    usernameFilter: function(username) {
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