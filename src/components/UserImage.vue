<template>
    <img
      class="object-cover object-center"
      :src="url"
    />
</template>

<script>

import { Storage } from "aws-amplify";

export default {
  name: "user-image",
  props: ["identityId", 'fullUrl'],
  data() {
    return {
      error: '',
      imageUrl: null,
    };
  },

  mounted() {
    this.getImage();
  },

  computed: {
    url() {
      return this.fullUrl || this.imageUrl;
    }
  },
  
  methods: {
    async getImage() {
      if (this.fullUrl) {
        return;
      }

      if (!this.identityId) {
        return this.setError('IdentityId not provided')
      }

      try {
        const result = await Storage.get('images/profile', {
          level: 'protected',
          identityId: this.identityId
        })
        this.imageUrl = result;
      } catch (error) {
        this.setError(error);
      }
    },
    setError: function(e) {
      this.error = e.message || e;
    }
  }
};
</script>
