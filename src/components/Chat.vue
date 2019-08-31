<template>
  <div v-if="hydrated">
    <amplify-connect
      :query="listChatMessagesQuery"
      :subscription="createMessageSubscription"
      :onSubscriptionMsg="onCreateMessage"
    >
      <template slot-scope="{loading, data, errors}">
        <div v-if="loading">Loading...</div>

        <div v-else-if="errors.length > 0"></div>
        <div v-else-if="data">
          <div v-for="item in data.listMessages" v-bind:key="item.messageId">
            <p>
              <b>{{ item.username }}</b>
              says: {{ item.message }}
            </p>
          </div>
        </div>
      </template>
    </amplify-connect>
    <div class="panel-body">
      <amplify-connect :mutation="createMessageMutation">
        <template slot-scope="{ loading, mutate }">
          <input v-model="message" placeholder="message" />
          <button :disabled="loading" @click="mutate">Send message</button>
        </template>
      </amplify-connect>
    </div>
  </div>
</template>

<script>
import { Auth } from "aws-amplify";
import { components } from "aws-amplify-vue";

const listChatMessagesQuery = `query listMessages($chatId: String!) {
  listMessages(input: {chatId: $chatId}) {
    chatId
    message
    sortKey
    messageId
    username
  }
}`;

const OnCreateMessageSubscription = `subscription createdMessage($chatId: String!) {
    createdMessage (chatId: $chatId) {
      chatId
      message
      sortKey
      messageId
      username
    }
  }`;

const createMessageMutation = `mutation createMessage($chatId: String!, $message: String!, $username: String!) {
    createMessage(input: { chatId: $chatId, message: $message, username: $username }) {
      chatId
      message
      sortKey
      messageId
      username
    }
  }`;

let user;

export default {
  name: "chat",

  async mounted() {
    await this.$apollo.provider.defaultClient.hydrated();
    this.hydrated = true;

    user = await Auth.currentAuthenticatedUser();
  },

  data() {
    return {
      hydrated: false,
      message: ""
    };
  },

  components: {
    ...components
  },

  computed: {
    listChatMessagesQuery() {
      return this.$Amplify.graphqlOperation(listChatMessagesQuery, {
        chatId: this.$route.params.chatId
      });
    },
    createMessageSubscription() {
      return this.$Amplify.graphqlOperation(OnCreateMessageSubscription, {
        chatId: this.$route.params.chatId
      });
    },
    createMessageMutation() {
      return this.$Amplify.graphqlOperation(createMessageMutation, {
        chatId: this.$route.params.chatId,
        message: this.message,
        username: user ? user.username : null // Should fail if no user
      });
    }
  },

  methods: {
    onCreateMessage(prevData, newData) {
      const newMessage = newData.createdMessage;
      prevData.data.listMessages.push(newMessage);
      return prevData.data;
    }
  }
};
</script>