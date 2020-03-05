<template>
  <div id="app">
    <div v-if="connected">
      <NavBar :profile="profile" @disconnect="disconnect" />
      <Router />
    </div>
    <div v-else>
      <NotConnected @connect="connect"/>
    </div>
    <Ribbon></Ribbon>
  </div>
</template>

<script>
import NotConnected from './components/NotConnected.vue'
import Ribbon from "@/components/Ribbon";
import Router from "@/components/router/Router";
import NavBar from "@/components/navbar/NavBar";
import Profile from "./models/profile";

const config = require("./assets/config.json");

export default {
  name: 'DadardWebsite',
  components: {
    NavBar,
    Ribbon,
    NotConnected,
    Router
  },
  data: function () {
    return {
      connected: false,
      profile: null
    }
  },
  methods: {
    connect: function(profile) {
      this.connected = true;
      this.profile = new Profile(
              profile.ProfileKey,
              profile.Username,
              profile.DateCreated
      );
    },
    disconnect: function() {
      localStorage.removeItem(config.jwt.tokenKey);
      this.connected = false;
    }
  }
}
</script>

<style>
  #app {
    font-family: "Lucida Console", monospace;
  }
</style>
