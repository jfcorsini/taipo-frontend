<template>
  <div v-if="!loading" id="chat-page">
    <div>
      <h1 v-if="!chat.private">{{ chat.chatName }}</h1>
      <button
        v-if="!chat.private"
        v-on:click="toggleShowUsers"
        class="toggle"
      >{{ showUsers ? 'Hide users' : 'Show users' }}</button>
      <chat></chat>
    </div>

    <transition name="fade">
      <add-users-list
        id="chat-page-users"
        v-if="showUsers && !chat.private"
        v-on:members-added="handleNewMembers"
        v-bind:members="this.members"
        v-bind:chatId="this.chatId"
      ></add-users-list>
    </transition>
  </div>
</template>

<script>
import { API, graphqlOperation } from "aws-amplify";
import Chat from "../Chat";
import AddUsersList from "../AddUsersList";

const getChatConfigQuery = `query getChat($chatId: String!) {
  getChat(input: { chatId: $chatId }) {
    ... on ChatGroupConfig {
      chatId
      chatName
    }

    ... on ChatPrivateConfig {
      chatId
      private
    }
  }
}`;

const getChatMembersQuery = `query getChatMembers($chatId: String!) {
  getChatMembers(input: { chatId: $chatId }) {
    chatId
    username
  }
}`;

export default {
  name: "chat-page",

  async mounted() {
    await this.$apollo.provider.defaultClient.hydrated();
    await this.getChatConfig();
    await this.getChatMembers();
    this.loading = false;
  },

  props: ["chatId"],

  data() {
    return {
      loading: true,
      chat: null,
      members: [],
      showUsers: false
    };
  },

  watch: {
    // whenever usernameFilter changes, this function will run
    chatId: async function() {
      await this.getChatConfig();
      await this.getChatMembers();
    }
  },

  components: {
    Chat,
    AddUsersList
  },

  methods: {
    async getChatConfig() {
      const result = await API.graphql(
        graphqlOperation(getChatConfigQuery, {
          chatId: this.chatId
        })
      );
      this.chat = result.data.getChat;
    },

    async getChatMembers() {
      const res = await API.graphql(
        graphqlOperation(getChatMembersQuery, {
          chatId: this.chatId
        })
      );

      this.members = res.data.getChatMembers.map(member => member.username);
    },

    handleNewMembers(usernames) {
      usernames.forEach(username => {
        this.members.push(username);
      });
    },

    toggleShowUsers() {
      this.showUsers = !this.showUsers;
    }
  }
};
</script>

<style lang="scss">
#chat-page {
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
}

#chat-page-users {
  background-color: $color1-lighter;
}

.fade-enter-active,
.fade-leave-active {
  width: 150px;
  transition: width 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  width: 0px;
}
</style>