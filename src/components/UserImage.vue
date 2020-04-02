<template>
    <img
      :src="url"
    />
</template>

<script>

import { Storage } from "aws-amplify";

export default {
  name: "user-image",
  props: ["identityId"],
  data() {
    return {
      error: '',
      url: null,
    };
  },

  mounted() {
    this.getImage();
  },
  
  methods: {
    async getImage() {
      if (!this.identityId) {
        return this.setError('IdentityId not provided')
      }

      try {
        const result = await Storage.get('images/profile', {
          level: 'protected',
          identityId: this.identityId
        })
        this.url = result;
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
