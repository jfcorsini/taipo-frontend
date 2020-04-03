<template>
  <div v-if="hydrated" class="h-full py-12 pl-12 max-w-xl">
    <amplify-connect :query="getUser" class="h-full bg-gray-100 rounded-md p-4 flex">
      <template slot-scope="{loading, data, errors}" class="flex">
        <div v-if="loading">Loading...</div>

        <div v-else-if="errors.length > 0"></div>

        <div v-else-if="data" class="mx-auto">
          <user-image class="h-64 w-64 inline rounded-full" v-bind:identityId="data.getUser.identityId" :fullUrl="imageUrl"/>
          <h1 class="text-center font-bold font-medium text-2xl leading-8">
            {{ data.getUser.username }}
          </h1>
          <div class="leading-6 mt-2 text-center">
            <h3>Email: {{ data.getUser.email }}</h3>
            <chat-with-user v-if="username !== authUser.username" v-bind:username="username" />
          </div>

          <div v-if="username === authUser.username">
            <input
              ref="file_input"  
              type="file"
              accept="image/*"
              @change="loadInputImage"
            />
            <br>
            <button class="ml-4 bg-green-400 hover:bg-green-600 text-white py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline" v-if="file" v-on:click="uploadImage" :disabled="!file">Upload photo</button>
          </div>
        </div>
      </template>
    </amplify-connect>
  </div>
</template>

<script>
import { Auth, Storage } from "aws-amplify";
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
      imageUrl: null,
      file: null,
      storageOptions: {
        level: 'protected'
      },
      error: '',
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
    loadInputImage(evt) {
      this.file = evt.target.files[0];
      if (!this.file) {
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const target = e.target;
        const url  = target.result;
        this.imageUrl = url;
      }
      reader.readAsDataURL(this.file);
    },
    uploadImage() {
      Storage.put(
        'images/profile',
        this.file, 
        this.storageOptions,
      )
      .then((result) => {
        this.completeFileUpload(result.key)
      })
      .catch(e => this.setError(e));
    },
    completeFileUpload() {
      this.file = null;
    },
    setError: function(e) {
      this.error = e.message || e;
    }
  }
};
</script>