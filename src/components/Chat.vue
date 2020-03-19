<template>
  <div class="h-full flex flex-col">
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
              <chat-message
                v-bind:username="item.username"
                v-bind:message="item.message"
                v-bind:isPrivate="isPrivate"
                v-bind:isSender=isSenderMessage(item)
              />
            </div>
          </div>
        </template>
      </amplify-connect>
    </div>

    <chat-send-message/>
  </div>
</template>

<script>
import { Auth } from "aws-amplify";
import { components } from "aws-amplify-vue";
import ChatMessage from './ChatMessage';
import ChatSendMessage from './ChatSendMessage';

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
    ...components,
    ChatMessage,
    ChatSendMessage,
  },

  props: ['isPrivate'],

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
  },

  methods: {
    onCreateMessage(prevData, newData) {
      const newMessage = newData.createdMessage;
      prevData.data.listMessages.push(newMessage);
      return prevData.data;
    },
    isSenderMessage(message) {
      return message.username === user.username;
    }
  },
};
</script>