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
    import Logger from "@/components/logger/Logger.vue";

    const axios = require('axios').default;
    const config = require("../../assets/config.json");

    export default {
        name: "ConnectionForm",
        components: {
          Logger
        },
        data: function () {
          return {
              service: null,
              logger: null,
              username: null,
              password: null,
              apiUrl: config.apiHost,
              jwtRoute: "/profile/auth/jwt",
              profileRoute: "/profile/auth"
          }
        },
        created: function() {
            this.logger = new LoggerService();
            this.service = axios.create({
                baseURL: this.apiUrl,
            });
            this.checkConnected()
        },
        methods: {
            checkConnected: function () {
                let token = localStorage.getItem(config.jwt.tokenKey);
                if (token == null) {
                    this.logger.debug("no token found in storage");
                    return;
                }

                let self = this;
                this.checkJwt(token)
                    .then(function(status) {
                        if (status) {
                            self.logger.debug("current token valid");
                            return self.getProfile(token);
                        } else {
                            self.logger.debug("current token invalid");
                        }
                    })
                    .then(function(profile) {
                        self.logger.info("profile retrieved");
                        self.storeJwtAndConnect(token, profile);
                    })
                    .catch(function(error) {
                        self.logger.error(error)
                    })

            },
            logIn: function () {
                if (!this.username || !this.password) {
                    this.logger.error("empty entry");
                    return
                }

                let self = this;
                let jwt;
                this.getJwt(this.username, this.password)
                    .then(function(newJwt) {
                        jwt = newJwt;
                        self.logger.info("token retrieved");
                        return self.getProfile(jwt);
                    })
                    .then(function(profile) {
                        self.logger.info("profile retrieved");
                        self.storeJwtAndConnect(jwt, profile);
                    })
                    .catch(function(error) {
                        self.logger.error(error)
                    });

            },
            signUp: function () {
                if (this.username == null || this.password == null) {
                    this.logger.error("empty entry");
                }

                let self = this;
                let profile;
                this.createProfile(this.username, this.password)
                    .then(function(newProfile) {
                        profile = newProfile;
                        return self.getJwt(self.username, self.password);
                    })
                    .then(jwt => self.storeJwtAndConnect(jwt, profile));

            },
            getProfile: function(jwt) {
                // retrieve the profile from the JWT and trigger connect
                let reqConfig = {
                    headers: {
                        Authorization: jwt
                    }
                };

                return this.service.get(this.profileRoute, reqConfig)
                    .then(function(response) {
                        return response.data.Content;
                    })
                    .catch(function(error) {
                        if (error.response) {
                            throw error.response.data.Message;
                        } else {
                            throw error;
                        }
                    });
            },
            createProfile: function(username, password) {
                let self = this;
                return this.service.post(this.profileRoute, {}, {
                    auth: {
                        username: username,
                        password: password
                    }})
                    .then(function(response) {
                        if (response.status !== 200) {
                            let msg = response.data.Message;
                            if (msg) {
                                self.logger.warning(msg);
                            }
                        } else {
                            return response.data.Content;
                        }
                    }).catch(function(error) {
                    if (error.response) {
                        self.logger.error(error.response.data.Message);
                    } else {
                        self.logger.error(error);
                    }

                });
            },
            getJwt: function(username, password) {

                return this.service.post(this.jwtRoute, {}, {
                    auth: {
                        username: username,
                        password: password
                    }})
                    .then(function(response) {
                        return response.data.Content;
                    })
                    .catch(function(error) {
                        if (error.response) {
                            throw error.response.data.Message;
                        } else {
                            throw error;
                        }
                });
            },
            checkJwt: function(token) {
                let reqConfig = {
                    headers: {
                        Authorization: token
                    }
                };

                return this.service.get(this.jwtRoute, reqConfig)
                    .then(function(response) {
                        return response.data.Status === true;
                })
                    .catch(function(error) {
                        if (error.response) {
                            throw error.response.data.Message;
                        } else {
                            throw error;
                        }
                    });
            },
            storeJwtAndConnect: function(jwt, profile) {
                localStorage.setItem(config.jwt.tokenKey, jwt);
                this.$emit('connect', profile);
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