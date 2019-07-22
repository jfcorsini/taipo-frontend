<template>
  <div class="home" v-if="hydrated">
    <amplify-connect :query="listChatMessagesQuery">
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
      <amplify-connect :mutation="createTodoMutation" @done="onCreateFinished">
        <template slot-scope="{ loading, mutate, errors }">
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

const createTodoMutation = `mutation putMessage($chatId: String!, $message: String!) {
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
      chatId: "chatOne",
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
        chatId: this.chatId
      });
    },
    createTodoMutation() {
      return this.$Amplify.graphqlOperation(createTodoMutation, {
        chatId: this.chatId,
        message: this.message
      });
    }
  },

  methods: {
    onCreateFinished() {
      console.log("Todo created!");
    }
  }
};
</script>