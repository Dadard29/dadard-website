<template>
    <div>
        <div style="height: 400px">
            <div v-if="displayMode === displayModeList.form">
                <h3>Connection</h3>
                <form class="form">
                    <div class="form-group">
                        <label for="usernameInput">Username</label>
                        <div class="input-group mb-2">
                            <div class="input-group-prepend">
                                <div class="input-group-text custom-input-prepend">@</div>
                            </div>
                            <input v-model="usernameInput" type="text" class="form-control custom-input" id="usernameInput" placeholder="Enter username" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="passwordInput">Password</label>
                        <div class="input-group mb-2">
                            <div class="input-group-prepend">
                                <div class="input-group-text custom-input-prepend">#</div>
                            </div>
                            <input v-model="passwordInput" type="password" class="form-control custom-input" id="passwordInput" placeholder="Enter password" required>
                        </div>
                    </div>
                    <div class="btn-group" role="group">
                        <button v-on:click="sendCodeMode" type="button" class="btn btn-outline-primary">Sign up</button>
                        <button v-on:click="logIn" type="button" class="btn btn-outline-primary">Log in</button>
                    </div>
                </form>
            </div>
    <!--        send code-->
            <div v-else-if="displayMode === displayModeList.sendCode">
                <h3>Confirm identity</h3>
                <form class="form">
                    <div class="form-group">
                        <label>
                            Choose a way to contact you
                            <select v-model="confirmationWayInput" class="custom-select">
                                <option :value="confirmationWayList.telegram">Telegram</option>
                                <option :value="confirmationWayList.email">Email</option>
                            </select>
                        </label>
                    </div>
                    <div v-if="confirmationWayInput === confirmationWayList.telegram" class="form-group">
                        <label for="contactInputTelegram">Telegram User ID</label>
                        <div class="input-group mb-2">
                            <div class="input-group-prepend">
                                <div class="input-group-text custom-input-prepend">@</div>
                            </div>
                            <input v-model="contactInput" type="text" class="form-control custom-input" id="contactInputTelegram" placeholder="Enter your user ID" required>
                        </div>
                        <small>You can get your user ID by sending <code>/start</code> to the bot @userinfobot</small>
                    </div>
                    <div v-else-if="confirmationWayInput === confirmationWayList.email" class="form-group">
                        <label for="contactInputEmail">Email</label>
                        <div class="input-group mb-2">
                            <div class="input-group-prepend">
                                <div class="input-group-text custom-input-prepend">@</div>
                            </div>
                            <input v-model="contactInput" type="text" class="form-control custom-input" id="contactInputEmail" placeholder="Enter your email" required>
                        </div>
                        <small>This address won't be shared, nor used except for confirming your identity</small>
                    </div>
                    <p>
                        You will receive a temporary code to the contact you specified.
                    </p>
                    <p>
                        Those information are only use to confirm your identity as a human. They won't be stored.
                    </p>
                    <div class="btn-group" role="group">
                        <button v-on:click="formMode" class="btn btn-outline-primary" type="button">&lt;&lt; Back</button>
                        <button v-on:click="sendCode" class="btn btn-outline-primary" type="button">Send code</button>
                    </div>
                    <div class="btn-group" role="group">
                        <button v-on:click="confirmCodeMode" class="btn btn-outline-primary"
                                type="button" style="margin-left: 40px">
                            Already have a confirmation code ?
                        </button>
                    </div>
                </form>
            </div>
    <!--        confirm code-->
            <div v-else-if="displayMode === displayModeList.confirmCode">
                <h3>Confirm code</h3>
                <form class="form">
                    <div class="form-group">
                        <label for="confirmationCode">Confirmation Code</label>
                        <div class="input-group mb-2">
                            <div class="input-group-prepend">
                                <div class="input-group-text custom-input-prepend">#</div>
                            </div>
                            <input v-model="confirmationCodeInput" type="text" style="font-size: 64px"
                                   class="form-control custom-input" id="confirmationCode" placeholder="..." required>
                        </div>
                    </div>
                    <div class="btn-group" role="group">
                        <button v-on:click="sendCodeMode" class="btn btn-outline-primary" type="button">&lt;&lt; Back</button>
                        <button v-on:click="confirmCode" class="btn btn-outline-primary" type="button">Confirm code</button>
                    </div>
                </form>
            </div>
        </div>
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
              // services
              service: null,
              logger: null,

              // inputs
              usernameInput: "",
              passwordInput: "",
              confirmationWayInput: "",
              confirmationWayList: {
                  telegram: "telegram",
                  email: "email"
              },

              contactInput: "",
              confirmationCodeInput: "",

              // DOM
              displayMode: "mainForm",
              displayModeList: {
                  form: "mainForm",
                  sendCode: "sendCode",
                  confirmCode: "confirmCode"
              }
          }
        },
        created() {
            this.logger = new LoggerService();
            this.service = new profileService({})
        },
        methods: {
            logIn: function () {
                // interface
                if (!this.usernameInput || !this.passwordInput) {
                    this.logger.error("empty entry");
                    return
                }

                let self = this;
                let jwt;
                this.service.getJwt(this.usernameInput, this.passwordInput)
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
            confirmCodeMode: function() {
                if (this.usernameInput == "" || this.passwordInput == "") {
                    this.logger.error("empty entry");
                    return;
                }

                this.displayMode = this.displayModeList.confirmCode;
            },
            sendCodeMode: function() {
                if (this.usernameInput == "" || this.passwordInput == "") {
                    this.logger.error("empty entry");
                    return;
                }

                this.displayMode = this.displayModeList.sendCode;
            },
            formMode: function() {
                this.displayMode = this.displayModeList.form;
            },
            sendCode: function() {
                if (this.usernameInput == "" || this.passwordInput == ""
                    || this.contactInput == "" || this.confirmationWayInput == "") {
                    this.logger.error("empty entry");
                    return
                }

                let self = this;
                self.logger.info("sending code...");
                this.service.sendCode(this.usernameInput, this.passwordInput, this.confirmationWayInput, this.contactInput)
                    .then(function(res) {
                        if (res.Status === true) {
                            self.logger.info(res.Message);
                            self.confirmCodeMode();
                        } else {
                            self.logger.error(res.Message)
                        }
                    })
                    .catch(function(error) {
                        self.logger.error(error)
                    })

            },
            confirmCode: function () {
                // interface
                if (this.usernameInput == "" || this.passwordInput == "" || this.confirmationCodeInput == "") {
                    this.logger.error("empty entry");
                    return
                }

                let self = this;
                this.logger.info("confirming code...");
                this.service.confirmCode(this.usernameInput, this.passwordInput, this.confirmationCodeInput)
                    .then(function(res) {
                        if (res.Status === true) {
                            self.logger.info(res.Message);
                            self.logger.info("code confirmed");
                            self.logger.info("profile created");
                            self.logger.info("you can login now");
                            self.formMode()
                        } else {
                            self.logger.error(res.Message)
                        }
                    })
                    .catch(function(error) {
                        self.logger.error(error)
                    })

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

    select {
        background-color: black;
        color: white;
    }
</style>