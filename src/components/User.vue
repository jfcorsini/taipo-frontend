<template>
  <div class="home" v-if="hydrated">
    <amplify-connect :query="getUser">
      <template slot-scope="{loading, data, errors}">
        <div v-if="loading">Loading...</div>

        <div v-else-if="errors.length > 0"></div>
        <div v-else-if="data">
          <h1>{{ data.getUser.username }}</h1>
          <h3>Email: {{ data.getUser.email }}</h3>
          <p>Last login: {{ data.getUser.lastLogin }}</p>
        </div>

        <amplify-connect :query="getChatPrivate">
          <template slot-scope="{loading, data, errors}">
            <div v-if="loading">Checking for chat...</div>

            <div v-else-if="errors.length > 0"></div>
            <div v-else-if="data">
              <div v-if="hasPrivateChat(data)">
                <router-link v-bind:to="'/chats/' + data.getChatPrivate.chatId">
                  <button>Go to chat</button>
                </router-link>
              </div>
              <div v-else>
                <amplify-connect :mutation="createChat" @done="onCreateChatFinished">
                  <template slot-scope="{ loading, mutate }">
                    <button :disabled="loading" @click="mutate">Start chatting</button>
                  </template>
                </amplify-connect>
              </div>
            </div>
          </template>
        </amplify-connect>
      </template>
    </amplify-connect>
  </div>
</template>

<script>
import { Auth } from "aws-amplify";
import { components } from "aws-amplify-vue";

const getUserQuery = `query getUser($username: String!) {
  getUser(input: {username: $username}) {
    username
    email
    lastLogin
  }
}`;

const getChatPrivateQuery = `query getChatPrivate($username: String!) {
  getChatPrivate(input: {username: $username}) {
    chatId
  }
}`;

const createChatPrivateMutation = `mutation createChatPrivate($username: String!) {
    createChatPrivate(input: { username: $username }) {
      chatId
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
    getUser() {
      return this.$Amplify.graphqlOperation(getUserQuery, {
        username: this.$route.params.username
      });
    },
    getChatPrivate() {
      return this.$Amplify.graphqlOperation(getChatPrivateQuery, {
        username: this.$route.params.username
      });
    },
    createChat() {
      return this.$Amplify.graphqlOperation(createChatPrivateMutation, {
        username: this.$route.params.username
      });
    }
  },

  methods: {
    onCreateChatFinished(mutationResponse) {
      const chatId = mutationResponse.data.createChatPrivate.chatId;
      this.$router.push(`/chats/${chatId}`);
    },
    hasPrivateChat(result) {
      console.log("RESULT FROM QUERY", result);
      return result.getChatPrivate && result.getChatPrivate.chatId;
    }
  }
};
</script>