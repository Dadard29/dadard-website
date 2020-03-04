<template>
  <div id="app">
    <div v-if="connected">
      <NavBar />
      <Router />
    </div>
    <div v-else>
      <NotConnected v-model="connected" @update="connect"/>
    </div>
    <Ribbon></Ribbon>
  </div>
</template>

<script>
import NotConnected from './components/NotConnected.vue'
import Ribbon from "@/components/Ribbon";
import Router from "@/components/router/Router";
import NavBar from "@/components/navbar/NavBar";

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
    }
  },
  methods: {
    connect(value) {
      this.connected = value;
    }
  }
}
</script>

<style>
  #app {
    font-family: "Lucida Console", monospace;
  }
</style>
