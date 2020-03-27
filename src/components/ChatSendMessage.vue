<template>
    <div class="flex flex-grow w-full">
      <amplify-connect :mutation="createMessageMutation" class="mt-auto mb-1 ml-1 w-full">
        <template slot-scope="{ loading, mutate }">
          <input class="w-9/12 rounded-sm p-3" v-model="message" v-on:keyup.enter="sendMessage(mutate)" placeholder="Send message" />
          <button class="ml-4 bg-green-400 hover:bg-green-600 text-white py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline" :disabled="loading" @click="sendMessage(mutate)">Send</button>
        </template>
      </amplify-connect>
  </div>
</template>

<script>
/* eslint-disable no-console */
import { Auth } from "aws-amplify";
import { components } from "aws-amplify-vue";

let username;

const createMessageMutation = `mutation createMessage($chatId: String!, $message: String!, $username: String!) {
    createMessage(input: { chatId: $chatId, message: $message, username: $username }) {
      chatId
      message
      sortKey
      messageId
      username
    }
  }`;

export default {
  name: "chat-send-message",

  async mounted() {
    await this.$apollo.provider.defaultClient.hydrated();
    this.hydrated = true;

    username = (await Auth.currentAuthenticatedUser()).username;
  },

  data() {
    return {
      hydrated: false,
      message: ""
    };
  },

  components: {
    ...components,
  },

  props: ['username'],

  computed: {
    createMessageMutation() {
      return this.$Amplify.graphqlOperation(createMessageMutation, {
        chatId: this.$route.params.chatId,
        message: this.message,
        username,
      });
    },
  },

  methods: {
    sendMessage(mutateFn) {
      this.message = '';
      mutateFn();
    },
  },
};
</script>