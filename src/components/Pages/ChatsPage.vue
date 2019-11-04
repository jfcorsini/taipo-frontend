<template>
  <div v-if="hydrated" id="page">
    <div id="side-bar">
      <nav-bar></nav-bar>
      <div>
        <amplify-connect :query="listSelfChatMembersQuery">
          <template slot-scope="{loading, data, errors}">
            <div v-if="loading">Loading...</div>

            <div v-else-if="errors.length > 0"></div>
            <div v-else-if="data">
              <div v-for="item in data.listSelfChatMembers" v-bind:key="item.chatId">
                <chat-element :chatId="item.chatId"></chat-element>
              </div>
            </div>
          </template>
        </amplify-connect>
      </div>
      <div id="create-chat">
        <amplify-connect :mutation="createChatMutation" @done="onCreateFinished">
          <template slot-scope="{ loading, mutate }">
            <input v-model="chatName" placeholder="Chat name" />
            <button :disabled="loading" @click="mutate">Create chat</button>
          </template>
        </amplify-connect>
      </div>
    </div>
    <div id="main-window">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import ChatElement from "../ChatElement";
import NavBar from "../NavBar";
import { components } from "aws-amplify-vue";

const listSelfChatMembersQuery = `query listSelfChatMembers {
  listSelfChatMembers {
    chatId
  }
}`;

const createChatMutation = `mutation createChatGroupWithMembers($chatName: String!) {
    createChatGroupWithMembers(input: { chatName: $chatName, usernames: [] }) {
      chatId
      chatName
    }
  }`;

export default {
  name: "chat-page",

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
    ...components,
    ChatElement,
    NavBar
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
      const chatId = mutationResponse.data.createChatGroupWithMembers.chatId;
      this.$router.push(`/chats/${chatId}`);
    }
  }
};
</script>

<style lang="scss">
#create-chat {
  margin-top: auto;
  flex-grow: 1;
}
</style>