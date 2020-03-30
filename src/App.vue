<template>
  <div id="app">
    <div v-if="connected">
      <NavBar :profile="profile" @disconnect="disconnect" />
      <Router />
    </div>
    <div v-else-if="connected == null">
      Loading...
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
import LoggerService from "@/models/logger";

const config = require("./assets/config.json");
const profileService = require('@/service/profileService').default;

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
      logger: null,
      connected: null,
      profile: null,
      service: null
    }
  },
  created: function() {
    this.logger = new LoggerService();
    this.checkConnected();
  },
  methods: {
    connect: function(profile) {
      this.connected = true;
      this.profile = new Profile(
              profile.ProfileKey,
              profile.Username,
              profile.DateCreated,
              profile.Silver,
      );
    },
    disconnect: function() {
      this.connected = false;
      localStorage.removeItem(config.jwt.tokenKey);
    },
    checkConnected: function () {
      let token = localStorage.getItem(config.jwt.tokenKey);
      if (token == null) {
        this.logger.debug("no token found in storage");
        this.connected = false;
      } else {

        // check jwt / profile
        this.service = new profileService({});
        let self = this;
        this.service.checkJwt(token)
                .then(function(check) {
                  if (check) {
                    self.logger.debug("current token valid");
                    self.service.getProfile(token)
                            .then(function(profile) {
                              self.profile = profile;

                              self.connect(self.profile)
                            })
                            .catch(function(error) {
                              self.logger.error(error);
                              self.connected = false
                            })

                  } else {
                    self.logger.debug("current token invalid");
                    self.connected = false
                  }
                })
                .catch(function(error) {
                  self.logger.error(error);
                  self.connected = false
                });
      }
    },
  }
}
</script>

<style>
  #app {
    font-family: "Lucida Console", monospace;
  }
</style>
