<template>
  <div class="home" v-if="hydrated">
    <amplify-connect :query="listChatsQuery">
      <template slot-scope="{loading, data, errors}">
        <div v-if="loading">Loading...</div>

        <div v-else-if="errors.length > 0"></div>
        <div v-else-if="data">
          <div v-for="item in data.listChats" v-bind:key="item.chatId">
            <router-link tag="p" v-bind:to="'/chats/' + item.chatId">
              <a>{{ item.chatName }}</a>
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
import { components } from "aws-amplify-vue";

const listChatsQuery = `query listChats {
  listChats {
    chatId
    chatName
  }
}`;

const createChatMutation = `mutation createChat($chatName: String!) {
    createChat(input: { chatName: $chatName }) {
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
      chatName: ""
    };
  },

  components: {
    ...components
  },

  computed: {
    listChatsQuery() {
      return this.$Amplify.graphqlOperation(listChatsQuery);
    },
    createChatMutation() {
      return this.$Amplify.graphqlOperation(createChatMutation, {
        chatName: this.chatName
      });
    }
  },

  methods: {
    onCreateFinished() {
      console.log("Chat created!");
    }
  }
};
</script>