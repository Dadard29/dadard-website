<template>
    <div>
        <h3>Connection</h3>
        <form class="form">
            <div class="form-group">
                <label for="usernameInput">Username</label>
                <div class="input-group mb-2">
                    <div class="input-group-prepend">
                        <div class="input-group-text custom-input-prepend">@</div>
                    </div>
                    <input v-model="username" type="text" class="form-control custom-input" id="usernameInput" placeholder="Enter username" required>
                </div>
            </div>
            <div class="form-group">
                <label for="passwordInput">Password</label>
                <div class="input-group mb-2">
                    <div class="input-group-prepend">
                        <div class="input-group-text custom-input-prepend">#</div>
                    </div>
                    <input v-model="password" type="password" class="form-control custom-input" id="passwordInput" placeholder="Enter password" required>
                </div>
            </div>
            <div class="btn-group" role="group">
                <button v-on:click="signUp" type="button" class="btn btn-outline-primary">Sign up</button>
                <button v-on:click="logIn" type="button" class="btn btn-outline-primary">Log in</button>
            </div>
        </form>
        <div>
            <Logger :logger-service="logger" />
        </div>
    </div>
</template>

<script>
    import LoggerService from "../../models/logger";
    import Logger from "@/components/logger/logger.vue";

    const axios = require('axios').default;
    const config = require("../../assets/config.json");

    export default {
        name: "ConnectionForm",
        components: {
          Logger
        },
        data: function () {
          return {
              logger: null,
              username: null,
              password: null,
              apiUrl: `${config.apiHost}/profile/auth/jwt`
          }
        },
        props: {
          connected: Boolean
        },
        created: function() {
            this.logger = new LoggerService();
            this.checkConnected()
        },
        methods: {
            checkConnected: function () {
                let self = this;
                let token = localStorage.getItem(config.jwt.tokenKey);
                if (token == null) {
                    self.logger.debug("no token found in storage");
                    self.connected = false;
                    return;
                }

                axios.get(this.apiUrl).then(function(response) {
                    let jwtValidity = response.status === 200 && response.data.Status === true;
                    let message;
                    if (jwtValidity) {
                        message = "jwt is valid"
                    } else {
                        message = "jwt is not valid"
                    }
                    self.logger.debug(message);
                    self.connected = jwtValidity
                })
                    .catch(function(error) {
                        self.logger.error(error.response.data.Message);
                    });
            },
            logIn: function () {
                if (!this.username || !this.password) {
                    this.logger.error("empty entry");
                    return
                }

                let self = this;
                axios.post(this.apiUrl, {}, {
                    auth: {
                        username: self.username,
                        password: self.password
                    }})
                    .then(function(response) {
                        if (response.status !== 200) {
                           let msg = response.data.Message;
                           if (msg) {
                               self.logger.warning(msg);
                           }
                        } else {
                            self.$emit('update', true)
                        }
                    }).catch(function(error) {
                        if (error.response) {
                            self.logger.error(error.response.data.Message);
                        } else {
                            self.logger.error(error);
                        }

                });

            },
            signUp: function () {
                if (this.username == null || this.password == null) {
                    this.logger.error("empty entry");
                }
            }
        }
    }
</script>

<style scoped>
    .form {
        padding-left: 60px;
    }

    .custom-input {
        background-color: black;
        color: inherit;
    }

    .custom-input-prepend {
        border: solid 1px white;
    }
</style>