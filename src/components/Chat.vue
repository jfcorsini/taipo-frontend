<template>
  <div class="home" v-if="hydrated">
    <amplify-connect :query="listChatsQuery">
      <template slot-scope="{loading, data, errors}">
        <div v-if="loading">Loading...</div>

        <div v-else-if="errors.length > 0"></div>
        <div v-else-if="data">
          <div v-for="item in data.listChats.items" v-bind:key="item.id">
            <h1>{{ item }}</h1>
            <h1>{{ item.id }}</h1>
            <p>{{ item.name }}</p>
          </div>
        </div>
      </template>
    </amplify-connect>
  </div>
</template>

<script>
import { components } from "aws-amplify-vue";

const listChatsQuery = `query listChats {
    listChats {
      items {
        id
        name
      }
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
    listChatsQuery() {
      return this.$Amplify.graphqlOperation(listChatsQuery);
    }
  }
};
</script>