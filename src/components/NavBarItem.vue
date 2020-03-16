<template>
  <router-link class="nav-item" tag="p" :to="to">
    <a class="nav-link">
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