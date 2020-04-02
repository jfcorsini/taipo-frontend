<template>
  <amplify-connect v-if="hydrated" :query="getChatPrivate">
    <template slot-scope="{loading, data, errors}">
      <div v-if="loading">Checking for chat...</div>

      <div v-else-if="errors.length > 0"></div>
      <div v-else-if="data">
        <div v-if="hasPrivateChat(data)">
          <router-link v-bind:to="'/chats/' + data.getChatPrivate.chatId">
            <button class="ml-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
              Go to chat
            </button>

          </router-link>
        </div>
        <div v-else>
          <amplify-connect :mutation="createChat" @done="onCreateChatFinished">
            <template slot-scope="{ loading, mutate }">
              <button :disabled="loading" @click="mutate" class="ml-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
                Start chatting
              </button>
            </template>
          </amplify-connect>
        </div>
      </div>
    </template>
  </amplify-connect>
</template>

<script>
import { components } from "aws-amplify-vue";

const getChatPrivateQuery = `query getChatPrivate($username: String!) {
  getChatPrivate(input: {username: $username}) {
    chatId
  }
}`;

const createChatPrivateMutation = `mutation createChatPrivate($username: String!) {
    createChatPrivate(input: { username: $username }) {
      chatId
    }
  }`;

export default {
  name: "chat-with-users",

  async mounted() {
    await this.$apollo.provider.defaultClient.hydrated();
    this.hydrated = true;
  },

  data() {
    return {
      hydrated: false,
    };
  },

  props: ["username"],

  components: {
    ...components
  },

  computed: {
    getChatPrivate() {
      return this.$Amplify.graphqlOperation(getChatPrivateQuery, {
        username: this.username
      });
    },
    createChat() {
      return this.$Amplify.graphqlOperation(createChatPrivateMutation, {
        username: this.username
      });
    }
  },

  methods: {
    onCreateChatFinished(mutationResponse) {
      const chatId = mutationResponse.data.createChatPrivate.chatId;
      this.$router.push(`/chats/${chatId}`);
    },
    hasPrivateChat(result) {
      return result.getChatPrivate && result.getChatPrivate.chatId;
    },
  }
};
</script>