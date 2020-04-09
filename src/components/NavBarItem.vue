<template>
  <router-link tag="p" :to="to">
    <a>
      <font-awesome-icon :icon="icon" /> {{ name }}
    </a>
  </router-link>
</template>

<script>
export default {
  name: "nav-bar-item",

  props: ['to', 'icon', 'name']
};
</script>