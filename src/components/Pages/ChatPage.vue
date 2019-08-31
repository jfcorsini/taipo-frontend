<template>
  <div v-if="!loading">
    <h1>{{ chat.chatName }}</h1>

    <div class="row">
      <chat class="col-4"></chat>
      <add-users-list
        class="col-8"
        v-if="!chat.private"
        v-on:members-added="handleNewMembers"
        v-bind:members="this.members"
        v-bind:chatId="this.chatId"
      ></add-users-list>
    </div>
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

  data() {
    return {
      loading: true,
      chatId: this.$route.params.chatId,
      chat: null,
      members: []
    };
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
    }
  }
};
</script>