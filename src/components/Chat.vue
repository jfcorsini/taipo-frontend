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
  </div>
</template>

<script>
import { components } from "aws-amplify-vue";

const chatId = "chatOne"; // Hardcoded until you can choose the chat name
const listChatMessagesQuery = `query listMessages {
  listMessages(input: {chatId: "${chatId}"}) {
    chatId
    message
    sortKey
    messageId
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
      hydrated: false
    };
  },

  components: {
    ...components
  },

  computed: {
    listChatMessagesQuery() {
      return this.$Amplify.graphqlOperation(listChatMessagesQuery);
    }
  }
};
</script>