<template>
  <div id="page">
    <div id="side-bar">
      <nav-bar></nav-bar>
    </div>
    <div id="main-window"></div>
  </div>
</template>

<script>
import NavBar from "../NavBar";

export default {
  name: "home",

  components: {
    NavBar
  }
};
</script>