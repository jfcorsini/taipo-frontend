<template>
  <div>
    <div v-if="!loading">
      <router-link tag="p" v-bind:to="'/chats/' + chatId">
        <a>{{ chatName }}</a>
      </router-link>
    </div>
  </div>
</template>

<script>
import { API, Auth, graphqlOperation } from "aws-amplify";

const getChatQuery = `query getChat($chatId: String!) {
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

export default {
  name: "chat-element",

  props: ["chatId"],

  data() {
    return {
      loading: true,
      chatName: ""
    };
  },

  async mounted() {
    await this.$apollo.provider.defaultClient.hydrated();
    const user = await Auth.currentAuthenticatedUser();

    const response = await API.graphql(
      graphqlOperation(getChatQuery, { chatId: this.chatId })
    );
    const chat = response.data.getChat || {};

    if (chat.private) {
      const usernames = chat.chatId.split("_");
      let chatWith = usernames[0];
      if (chatWith === user.username) {
        chatWith = usernames[1];
      }

      this.chatName = `Private chat with ${chatWith}`;
    } else {
      this.chatName = chat.chatName;
    }
    this.loading = false;
  }
};
</script>
