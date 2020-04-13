<template>
  <div v-if="hydrated" class="h-full flex">
    <div class="w-3/12 border border-solid border-gray-300 shadow shadow-sm h-full overflow-y-auto">
      <amplify-connect :query="searchUsersQuery">
        <template slot-scope="{loading, data, errors}">
          <div class="m-1 h-8">
            <input
              class="text-gray-700 text-sm h-full w-10/12 py-2 px-1"
              v-model="usernameFilter" placeholder="Filter by username"
            />
          </div>
          <div v-if="loading">Loading...</div>

          <div v-else-if="errors.length > 0"></div>
          <div v-else-if="data">
            <div v-for="item in data.searchUsers" v-bind:key="item.username">
              <div class="bg-white shadow-xs mb-2 mx-px font-light text-base cursor-pointer hover:bg-green-300 active:bg-green-400">
                <router-link tag="div" v-bind:to="'/users/' + item.username" class="inline-block h-16 w-full" v-bind:activeClass="'bg-green-400 shadow-lg'">
                <div class="mt-3 ml-1">
                  <user-image class="h-12 w-12 rounded-full inline" v-bind:identityId="item.identityId"/>
                  <span class="font-hairline ml-2">{{ item.username }}</span>
                </div>
                </router-link>
              </div>
            </div>
          </div>
        </template>
      </amplify-connect>
    </div>
    <div class="w-9/12">
      <div v-if="username" class="h-full py-12 pl-12 max-w-xl">
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
                <chat-with-user v-if="username !== authUsername" v-bind:username="username" />
              </div>

              <div v-if="username === authUsername">
                <input
                  class="w-64"
                  type="file"
                  accept="image/*"
                  @change="loadInputImage"
                />
                <br>
                <button class="ml-4 bg-green-400 hover:bg-green-600 text-white py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline" v-bind:class="{ 'opacity-50 cursor-not-allowed': uploadingImage }" v-if="file" v-on:click="uploadImage" :disabled="!file"
                  >Upload photo
                </button>
              </div>
            </div>
          </template>
        </amplify-connect>
      </div>
    </div>
  </div>
</template>

<script>
import { Auth, Storage } from "aws-amplify";
import { components } from "aws-amplify-vue";
import UserImage from '../UserImage';
import NProgress from 'nprogress';
import ChatWithUser from '../ChatWithUser';

const searchUsersQuery = `query searchUsers($username: String) {
  searchUsers(input: {username: $username}) {
    username
    email
    identityId
  }
}`;

const getUserQuery = `query getUser($username: String!) {
  getUser(input: {username: $username}) {
    username
    email
    lastLogin
    identityId
  }
}`;

export default {
  name: "users-page",

  async mounted() {
    await this.$apollo.provider.defaultClient.hydrated();
    this.authUsername = (await Auth.currentAuthenticatedUser()).username;
    this.hydrated = true;
  },

  data() {
    return {
      hydrated: false,
      usernameFilter: "",
      authUsername: null,
      imageUrl: null,
      file: null,
      error: '',
      uploadingImage: false,
    };
  },

  props: ["username"],


  watch: {
    username: async function() {
      this.imageUrl = null;
    }
  },

  components: {
    ...components,
    UserImage,
    ChatWithUser,
  },

  computed: {
    searchUsersQuery() {
      return this.$Amplify.graphqlOperation(searchUsersQuery, {
        username: this.usernameFilter || null
      });
    },
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
      if (this.uploadingImage) {
        return;
      }

      this.uploadingImage = true;
      NProgress.start();
      Storage.put(
        'images/profile',
        this.file, 
        {
          level: 'protected',
          progressCallback: (progress) => {
            NProgress.set(progress.loaded/progress.total);
          }
        }
      )
      .then((result) => {
        this.completeFileUpload(result.key)
      })
      .catch(e => this.setError(e))
      .finally(() => {
        NProgress.done();
        this.uploadingImage = false;
      })
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