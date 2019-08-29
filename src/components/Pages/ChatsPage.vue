<template>
  <div class="home" v-if="hydrated">
    <amplify-connect :query="listSelfChatMembersQuery">
      <template slot-scope="{loading, data, errors}">
        <div v-if="loading">Loading...</div>

        <div v-else-if="errors.length > 0"></div>
        <div v-else-if="data">
          <div v-for="item in data.listSelfChatMembers" v-bind:key="item.chatId">
            <!-- Chat details. Move to own component -->
            <router-link tag="p" v-bind:to="'/chats/' + item.chatId">
              <!-- <a>Private chat: {{ item.chatId }}</a> -->
              <a>{{ getChatName(item.chatId) }}</a>
            </router-link>
          </div>
        </div>
      </template>
    </amplify-connect>
    <div class="panel-body">
      <amplify-connect :mutation="createChatMutation" @done="onCreateFinished">
        <template slot-scope="{ loading, mutate }">
          <input v-model="chatName" placeholder="Chat name" />
          <button :disabled="loading" @click="mutate">Create chat</button>
        </template>
      </amplify-connect>
    </div>
  </div>
</template>

<script>
import { API, graphqlOperation } from "aws-amplify";
import { components } from "aws-amplify-vue";

const listSelfChatMembersQuery = `query listSelfChatMembers {
  listSelfChatMembers {
    chatId
  }
}`;

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

const createChatMutation = `mutation createChatGroupWithMembers($chatName: String!) {
    createChatGroupWithMembers(input: { chatName: $chatName, usernames: [] }) {
      chatId
      chatName
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
      hydrated: false,
      chatIds: [],
      chatName: ""
    };
  },

  components: {
    ...components
  },

  computed: {
    listSelfChatMembersQuery() {
      return this.$Amplify.graphqlOperation(listSelfChatMembersQuery);
    },
    createChatMutation() {
      return this.$Amplify.graphqlOperation(createChatMutation, {
        chatName: this.chatName
      });
    }
  },

  methods: {
    onCreateFinished(mutationResponse) {
      console.log("Chat created!", mutationResponse);
      const chatId = mutationResponse.data.createChatGroupWithMembers.chatId;
      this.$router.push(`/chats/${chatId}`);
    },
    async getChatName(chatId) {
      const response = await API.graphql(
        graphqlOperation(getChatQuery, { chatId })
      );

      const chat = response.data.getChat || {};

      if (chat.private) {
        const chatWith = chat.chatId;
        return `Private chat with ${chatWith}`;
      }

      return chat.chatName;
    }
  }
};
</script>