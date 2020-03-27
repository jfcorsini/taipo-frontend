<template>
  <div v-if="hydrated" class="h-full flex">
    <div class="w-3/12 border border-solid border-gray-300 shadow shadow-sm h-full overflow-y-auto">
      <div class="h-8">
        <div class="flex m-1">
          <amplify-connect :mutation="createChatMutation" @done="onCreateFinished">
            <template slot-scope="{ loading, mutate }" class="h-full">
              <input class="inline text-gray-700 text-sm mb-2 h-full" v-model="newChatName" v-on:keyup.enter="onCreateChat(mutate)" placeholder="Chat name" />
              <button :disabled="loading" @click="onCreateChat(mutate)" class="ml-2 bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded">Create chat</button>
            </template>
          </amplify-connect>
        </div>
      </div>
      <div>
        <div v-for="chatId in chatIds" v-bind:key="chatId">
          <chat-element :chatId="chatId"></chat-element>
        </div>
      </div>
    </div>
    <div class="w-9/12">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { API, graphqlOperation } from "aws-amplify";
import ChatElement from "../ChatElement";
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

    await this.getAllChatsFromUser();
  },

  data() {
    return {
      hydrated: false,
      chatIds: [],
      newChatName: ""
    };
  },

  components: {
    ...components,
    ChatElement,
  },

  computed: {
    createChatMutation() {
      return this.$Amplify.graphqlOperation(createChatMutation, {
        chatName: this.newChatName
      });
    }
  },

  methods: {
    onCreateFinished(mutationResponse) {
      const chatId = mutationResponse.data.createChatGroupWithMembers.chatId;
      this.chatIds.unshift(chatId);

      this.$router.push(`/chats/${chatId}`);
    },

    async getAllChatsFromUser() {
      const response = await API.graphql(
        graphqlOperation(listSelfChatMembersQuery)
      );

      this.chatIds = response.data.listSelfChatMembers.map(i => i.chatId);
    },

    onCreateChat(mutateFn){
      this.newChatName = '';
      mutateFn();
    }
  }
};
</script>
