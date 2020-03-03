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

const config = require('./assets/config.json');
const axios = require('axios').default;

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
      apiUrl: `${config.apiHost}/profile/auth/jwt`,
      connected: false,
    }
  },
  created: function() {
    this.checkConnected()
  },
  methods: {
    connect(value) {
      this.connected = value;
    },
    checkConnected: function () {
      let self = this;
      let token = localStorage.getItem(config.jwt.tokenKey);
      if (token == null) {
        self.connected = false;
        return;
      }

      axios.get(this.apiUrl).then(function(response) {
        self.connected = response.status === 200 && response.data.Status === true;
      })
      .catch(function(error) {
        console.log(error)
      });
    }
  }
}
</script>

<style>
  #app {
    font-family: "Lucida Console", monospace;
  }
</style>
