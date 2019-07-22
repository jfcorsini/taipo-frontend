<template>
  <div id="app">
    <div class="nav">
      <router-link tag="p" to="/">
        <a>Home</a>
      </router-link>
      <router-link tag="p" to="/chat">
        <a>Chat</a>
      </router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>

<style>
.nav {
  display: flex;
}
.nav p {
  padding: 0px 30px 0px 0px;
  font-size: 18px;
  color: #000;
}
.nav p:hover {
  opacity: 0.7;
}
.nav p a {
  text-decoration: none;
}
.sign-out {
  width: 160px;
  margin: 0 auto;
}
</style>