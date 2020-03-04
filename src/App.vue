<template>
  <div id="app">
    <div v-if="connected">
      <NavBar :profile="profile" />
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
    connect(profile) {
      this.connected = true;
      this.profile = new Profile(
              profile.ProfileKey,
              profile.Username,
              profile.DateCreated
      );
    }
  }
}
</script>

<style>
  #app {
    font-family: "Lucida Console", monospace;
  }
</style>
