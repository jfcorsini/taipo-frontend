<template>
  <div class="home" v-if="hydrated">
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
            <p>Message: {{ item.message }}</p>
          </div>
        </div>
      </template>
    </amplify-connect>
    <div class="panel-body">
      <amplify-connect :mutation="createMessageMutation" @done="onCreateFinished">
        <template slot-scope="{ loading, mutate }">
          <input v-model="message" placeholder="message" />
          <button :disabled="loading" @click="mutate">Send message</button>
        </template>
      </amplify-connect>
    </div>
  </div>
</template>

<script>
import { components } from "aws-amplify-vue";

const listChatMessagesQuery = `query listMessages($chatId: String!) {
  listMessages(input: {chatId: $chatId}) {
    chatId
    message
    sortKey
    messageId
  }
}`;

const OnCreateMessageSubscription = `subscription createdMessage {
    createdMessage {
      chatId
      message
      sortKey
      messageId
    }
  }`;

const createMessageMutation = `mutation putMessage($chatId: String!, $message: String!) {
    putMessage(input: { chatId: $chatId, message: $message }) {
      chatId
      message
      sortKey
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
      return this.$Amplify.graphqlOperation(OnCreateMessageSubscription);
    },
    createMessageMutation() {
      return this.$Amplify.graphqlOperation(createMessageMutation, {
        chatId: this.$route.params.chatId,
        message: this.message
      });
    }
  },

  methods: {
    onCreateFinished() {
      console.log("Message created!");
    },
    onCreateMessage(prevData, newData) {
      const newMessage = newData.createdMessage[0]; // Returns a list at the moment
      console.log("NEW MESSAGE", newMessage);
      prevData.data.listMessages.push(newMessage);
      return prevData.data;
    }
  }
};
</script>