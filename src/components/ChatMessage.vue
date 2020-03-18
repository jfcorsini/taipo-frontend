<template>
  <div class="w-full" v-bind:class="{ 'flex justify-end': isSender }">
    <div class="w-64 bg-white p-2 mb-2 rounded-md text-sm font-light antialiased" v-bind:class="{ 'bg-blue-200': isSender }">
      <p v-if="!isSender && !isPrivate" class="font-bold">{{ username }}</p>
      <p> {{ message }} </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "chat-message",

  props: ['username', 'message', 'isSender', 'isPrivate']
};
</script>