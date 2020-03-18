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

    const config = require("../../assets/config.json");
    const profileService = require("@/service/profileService").default;

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
        created() {
            this.logger = new LoggerService();
            this.service = new profileService({})
        },
        methods: {
            logIn: function () {
                // interface
                if (!this.username || !this.password) {
                    this.logger.error("empty entry");
                    return
                }

                let self = this;
                let jwt;
                this.service.getJwt(this.username, this.password)
                    .then(function(newJwt) {
                        jwt = newJwt;
                        self.logger.info("token retrieved");
                        return self.service.getProfile(jwt);
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
                // interface
                if (this.username == null || this.password == null) {
                    this.logger.error("empty entry");
                }

                let self = this;
                let profile;
                this.service.createProfile(this.username, this.password)
                    .then(function(newProfile) {
                        profile = newProfile;
                        return self.service.getJwt(self.username, self.password);
                    })
                    .then(jwt => self.storeJwtAndConnect(jwt, profile))
                    .catch(function(error) {
                        self.logger.error(error)
                    });

            },
            // getJwt: function(username, password) {
            //
            //     return this.service.post(this.jwtRoute, {}, {
            //         auth: {
            //             username: username,
            //             password: password
            //         }})
            //         .then(function(response) {
            //             return response.data.Content;
            //         })
            //         .catch(function(error) {
            //             if (error.response) {
            //                 throw error.response.data.Message;
            //             } else {
            //                 throw error;
            //             }
            //         });
            // },
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