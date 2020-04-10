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
      <div v-if="chatId && !loading" class="h-full overflow-x-hidden overflow-y-auto flex justify-between">
        <div class="w-full flex flex-col justify-center align-bottom">
          <div v-if="!chat.private">
            <h1 class="font-light text-3xl text-center leading-8">
              {{ chat.chatName }}
              <span
                class="text-sm underline cursor-pointer"
                v-on:click="toggleShowUsers"
              >
                {{ showUsers ? 'Hide users' : 'Show users' }}
              </span>
            </h1>
          </div>
          <chat v-bind:isPrivate="chat.private"/>
        </div>

        <transition name="slide-fade">
          <add-users-list
            id="chat-page-users"
            v-if="showUsers && !chat.private"
            v-on:members-added="handleNewMembers"
            v-bind:members="this.members"
            v-bind:chatId="this.chatId"
          ></add-users-list>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { API, graphqlOperation } from "aws-amplify";
import ChatElement from "../ChatElement";
import Chat from "../Chat";
import AddUsersList from "../AddUsersList";
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

const getChatConfigQuery = `query getChat($chatId: String!) {
  getChat(input: { chatId: $chatId }) {
    ... on ChatGroupConfig {
      chatId
      chatName
    }

    ... on ChatPrivateConfig {
      chatId
      private
    }
  }
}`;

const getChatMembersQuery = `query getChatMembers($chatId: String!) {
  getChatMembers(input: { chatId: $chatId }) {
    chatId
    username
  }
}`;

export default {
  name: "chat-page",

  async mounted() {
    await this.$apollo.provider.defaultClient.hydrated();
    this.hydrated = true;

    await this.getAllChatsFromUser();
    this.loading = false;
    if (this.chatId) {
      await this.getChatConfig();
      await this.getChatMembers();
    }
  },

  data() {
    return {
      hydrated: false,
      chatIds: [],
      newChatName: "",
      loading: true,
      chat: null,
      members: [],
      showUsers: false
    };
  },

  watch: {
    // whenever usernameFilter changes, this function will run
    chatId: async function() {
      await this.getChatConfig();
      await this.getChatMembers();
    }
  },

  props: ["chatId"],

  components: {
    ...components,
    ChatElement,
    Chat,
    AddUsersList
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
      // eslint-disable-next-line no-console
      console.log(response);

      this.chatIds = response.data.listSelfChatMembers.map(i => i.chatId);
    },

    onCreateChat(mutateFn){
      this.newChatName = '';
      mutateFn();
    },

    async getChatConfig() {
      const result = await API.graphql(
        graphqlOperation(getChatConfigQuery, {
          chatId: this.chatId
        })
      );
      this.chat = result.data.getChat;
    },

    async getChatMembers() {
      const res = await API.graphql(
        graphqlOperation(getChatMembersQuery, {
          chatId: this.chatId
        })
      );

      this.members = res.data.getChatMembers.map(member => member.username);
    },

    handleNewMembers(usernames) {
      usernames.forEach(username => {
        this.members.push(username);
      });
    },

    toggleShowUsers() {
      this.showUsers = !this.showUsers;
    }
  }
};
</script>
