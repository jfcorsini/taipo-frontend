<template>
  <div v-if="hydrated" class="h-full py-12 pl-12 max-w-xl">
    <amplify-connect :query="getUser" class="h-full bg-gray-100 rounded-md p-4 flex">
      <template slot-scope="{loading, data, errors}" class="flex">
        <div v-if="loading">Loading...</div>

        <div v-else-if="errors.length > 0"></div>

        <div v-else-if="data" class="mx-auto">
          <user-image class="h-64 w-64 inline rounded-full" v-bind:identityId="data.getUser.identityId"/>
          <h1 class="text-center font-bold font-medium text-2xl leading-8">
            {{ data.getUser.username }}
          </h1>
          <div class="leading-6 mt-2 text-center">
            <h3>Email: {{ data.getUser.email }}</h3>
            <chat-with-user v-if="username !== authUser.username" v-bind:username="username" />
          </div>

          <div v-if="username === authUser.username">
            <amplify-photo-picker v-bind:photoPickerConfig="getphotoPickerConfig()"/>
          </div>
        </div>
      </template>
    </amplify-connect>
  </div>
</template>

<script>
import { Auth } from "aws-amplify";
import { components } from "aws-amplify-vue";
import ChatWithUser from '../ChatWithUser';
import UserImage from '../UserImage';

const getUserQuery = `query getUser($username: String!) {
  getUser(input: {username: $username}) {
    username
    email
    lastLogin
    identityId
  }
}`;

export default {
  name: "user-page",

  async mounted() {
    await this.$apollo.provider.defaultClient.hydrated();
    this.authUser = await Auth.currentAuthenticatedUser();
    this.hydrated = true;
  },

  data() {
    return {
      hydrated: false,
      photoPickerConfig: {
        header: 'Set user photo',
        defaultName: this.username,
        path: this.authUser && `users/${this.authUser.attributes.sub}`,
      }
    };
  },

  props: ["username"],

  components: {
    ...components,
    ChatWithUser,
    UserImage,
  },

  computed: {
    getUser() {
      return this.$Amplify.graphqlOperation(getUserQuery, {
        username: this.username
      });
    },
  },

  methods: {
    getphotoPickerConfig() {
      return {
        header: 'Set user photo',
        defaultName: 'profile',
        path: 'images/',
        storageOptions: {
          level: 'protected'
        }
      };
    }
  }
};
</script>