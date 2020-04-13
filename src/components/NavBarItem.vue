<template>
  <router-link tag="p" :to="{ name: to}" class="my-6">
    <a v-bind:class="{ 'text-green-500': active }" class="text-gray-600">
      <font-awesome-icon :icon="icon" size="lg" />
    </a>
  </router-link>
</template>

<script>
export default {
  name: "nav-bar-item",

  props: ['to', 'icon'],

  computed: {
    active() {
      return this.$route.name === this.to;
    }
  }
};
</script>