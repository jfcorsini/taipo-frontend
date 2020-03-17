<template>
  <div v-if="hydrated" class="h-full flex">
    <div class="w-3/12 border border-solid border-gray-300 shadow shadow-sm h-full overflow-y-auto">
      <div class="h-8">
        <div class="flex m-1">
          <amplify-connect :mutation="createChatMutation" @done="onCreateFinished">
            <template slot-scope="{ loading, mutate }" class="h-full">
              <input class="inline text-gray-700 text-sm font-bold mb-2 h-full" v-model="chatName" placeholder="Chat name" />
              <button :disabled="loading" @click="mutate" class="ml-2 bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded">Create chat</button>
            </template>
          </amplify-connect>
        </div>
      </div>
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
    </div>
    <div class="w-9/12">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
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
