<template>
  <div class="h-full">
    <div v-if="!loading" class="bg-white shadow-xs mb-2 mx-px font-light text-base cursor-pointer hover:bg-green-300 active:bg-green-400">
      <router-link tag="p" v-bind:to="'/chats/' + chatId" class="inline-block h-16 w-full" v-bind:activeClass="'bg-green-400 shadow-lg'">
      <div class="ml-4 mt-2" v-bind:class="{ 'ml-8 mt-6': !userIdentityId }">
        <user-image v-if="userIdentityId" class="h-12 w-12 rounded-full inline" v-bind:identityId="userIdentityId"/>
        <span>{{ chatName }}</span>
      </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { API, Auth, graphqlOperation } from "aws-amplify";
import UserImage from './UserImage';

const getChatQuery = `query getChat($chatId: String!) {
  getChat(input: { chatId: $chatId }) {
    ... on ChatGroupConfig {
      chatId
      chatName
    }

    ... on ChatPrivateConfig {
      chatId
      sortKey
      private
      usernames
    }
  }
}`;

const getUserQuery = `query getUser($username: String!) {
  getUser(input: {username: $username}) {
    identityId
  }
}`;

export default {
  name: "chat-element",

  props: ["chatId"],

  data() {
    return {
      loading: true,
      userIdentityId: null,
      chatName: ""
    };
  },

  components: {
    UserImage,
  },

  async mounted() {
    await this.$apollo.provider.defaultClient.hydrated();
    const user = await Auth.currentAuthenticatedUser();

    const response = await API.graphql(
      graphqlOperation(getChatQuery, { chatId: this.chatId })
    );
    const chat = response.data.getChat || {};

    if (!chat.private) {
      this.chatName = chat.chatName;
      this.loading = false;
      return;
    }

    const usernames = chat.usernames;
    let chatWith = usernames[0];
    if (chatWith === user.username) {
      chatWith = usernames[1];
    }
    this.chatName = chatWith;
    this.loading = false;

    const userResponse = await API.graphql(
      graphqlOperation(getUserQuery, { username: chatWith })
    );
    this.userIdentityId = userResponse.data.getUser.identityId;
  }
};
</script>
