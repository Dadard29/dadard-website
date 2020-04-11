<template>
    <div>
        <div style="height: 400px">
            <!--        main form-->
            <transition name="fade">
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
                        <div style="text-align: right">
                            <div class="btn-group" role="group">
                                <button v-on:click="sendCodeMode" type="button" class="btn btn-outline-primary">Sign up</button>
                                <button v-on:click="logIn" type="button" class="btn btn-outline-primary">Log in</button>
                            </div>
                            <button v-on:click="lostPasswordSendCodeMode" type="button"
                                    class="btn btn-outline-warning" style="margin-left: 10px">Lost password</button>
                        </div>
                    </form>
                </div>
            </transition>
            <!--        send code for signing up-->
            <transition name="fade">
                <div v-if="displayMode === displayModeList.sendCode">
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
                            <small>You can get your user ID by sending <code>/id</code> to the bot @dadard29_bot</small>
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
            </transition>
            <!--        confirm code for signing up-->
            <transition name="fade">
                <div v-if="displayMode === displayModeList.confirmCode">
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
            </transition>
            <!--        send code for lost password-->
            <transition name="fade">
                <div v-if="displayMode === displayModeList.lostPasswordSendCode">
                    <form class="form">
                        <div class="form-group">
                            <p>
                                If you have correctly set your recovery settings, then you can ask for an account
                                recovery through the channel you've already setup.
                            </p>
                            <p>
                                If you do not have set your recovery settings, then you are screwed... <code>:sadface</code>
                            </p>
                        </div>
                        <div class="form-group">
                            <label for="lostPasswordUsername">Username</label>
                            <div class="input-group mb-2">
                                <div class="input-group-prepend">
                                    <div class="input-group-text custom-input-prepend">@</div>
                                </div>
                                <input v-model="lostPasswordUsernameInput" type="text"
                                       class="form-control custom-input" id="lostPasswordUsername" placeholder="Enter your username" required>
                            </div>
                        </div>
                        <div class="btn-group" role="group">
                            <button @click="formMode" class="btn btn-outline-primary" type="button">&lt;&lt; Back</button>
                            <button @click="lostPasswordSendCode" class="btn btn-outline-primary" type="button">Send code</button>
                        </div>
                        <div class="btn-group" role="group">
                            <button @click="lostPasswordConfirmCodeMode" class="btn btn-outline-primary"
                                    type="button" style="margin-left: 40px">Already have a confirmation code ?</button>
                        </div>
                    </form>
                </div>
            </transition>
            <!--        confirm code for lost password-->
            <transition name="fade">
                <div v-if="displayMode === displayModeList.lostPasswordConfirmCode">
                    <h3>Confirm code</h3>
                    <form class="form">
                        <div class="form-group">
                            <label for="lostPasswordConfirmationCode">Confirmation Code</label>
                            <div class="input-group mb-2">
                                <div class="input-group-prepend">
                                    <div class="input-group-text custom-input-prepend">#</div>
                                </div>
                                <input v-model="lostPasswordConfirmationCodeInput" type="text" style="font-size: 64px"
                                       class="form-control custom-input" id="lostPasswordConfirmationCode" placeholder="..." required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="lostPasswordNewPassword">New password</label>
                            <div class="input-group mb-2">
                                <div class="input-group-prepend">
                                    <div class="input-group-text custom-input-prepend">#1</div>
                                </div>
                                <input v-model="lostPasswordNewPasswordInput" type="password"
                                       class="form-control custom-input" id="lostPasswordNewPassword" placeholder="Enter new password" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="lostPasswordNewPasswordConfirm">Confirm</label>
                            <div class="input-group mb-2">
                                <div class="input-group-prepend">
                                    <div class="input-group-text custom-input-prepend">#2</div>
                                </div>
                                <input v-model="lostPasswordNewPasswordConfirmInput" type="password"
                                       class="form-control custom-input" id="lostPasswordNewPasswordConfirm" placeholder="Confirm new password" required>
                            </div>
                        </div>
                        <div class="btn-group" role="group">
                            <button v-on:click="lostPasswordSendCodeMode" class="btn btn-outline-primary" type="button">&lt;&lt; Back</button>
                            <button v-on:click="lostPasswordConfirmCode" class="btn btn-outline-primary" type="button">Change password</button>
                        </div>
                    </form>
                </div>
            </transition>
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
              show: false,
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

              lostPasswordUsernameInput: "",
              lostPasswordConfirmationCodeInput: "",
              lostPasswordNewPasswordInput: "",
              lostPasswordNewPasswordConfirmInput: "",

              // DOM
              displayMode: "mainForm",
              displayModeList: {
                  form: "mainForm",
                  sendCode: "sendCode",
                  confirmCode: "confirmCode",
                  lostPasswordSendCode: "lostPasswordSendCode",
                  lostPasswordConfirmCode: "lostPasswordConfirmCode"
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
            sendCode: function() {
                if (this.usernameInput === "" || this.passwordInput === ""
                    || this.contactInput === "" || this.confirmationWayInput === "") {
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
                if (this.usernameInput === "" || this.passwordInput === "" || this.confirmationCodeInput === "") {
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
            lostPasswordSendCode: function() {
                if (this.lostPasswordUsernameInput === "") {
                    this.logger.error("empty username input");
                    return
                }

                let self = this;
                self.logger.info("sending code...");
                this.service.lostPasswordSendCode(this.lostPasswordUsernameInput)
                    .then(function(msg) {
                        self.logger.info(msg);

                        self.lostPasswordConfirmCodeMode();
                    })
                    .catch(function(error) {
                        self.logger.error(error);
                    })
            },
            lostPasswordConfirmCode: function() {
                if (this.lostPasswordUsernameInput === "" || this.lostPasswordConfirmationCodeInput === ""
                        || this.lostPasswordNewPasswordInput === "" || this.lostPasswordNewPasswordConfirmInput === "") {
                    this.logger.error("empty entry");
                    return
                }

                if (this.lostPasswordNewPasswordInput !== this.lostPasswordNewPasswordConfirmInput) {
                    this.logger.error("passwords mismatch");
                    return
                }

                let self = this;
                self.logger.info("confirming code...");
                this.service.lostPasswordConfirmCode(this.lostPasswordUsernameInput, this.lostPasswordNewPasswordInput,
                    this.lostPasswordConfirmationCodeInput)
                    .then(function(msg) {
                        self.logger.info(msg);

                        self.formMode();
                    })
                    .catch(function(error) {
                        self.logger.error(error);
                    })
            },
            storeJwtAndConnect: function(jwt, profile) {
                localStorage.setItem(config.jwt.tokenKey, jwt);
                this.$emit('connect', profile);
            },

            // DOM
            confirmCodeMode: function() {
                if (this.usernameInput === "" || this.passwordInput === "") {
                    this.logger.error("empty entry");
                    return;
                }

                this.displayMode = this.displayModeList.confirmCode;
            },
            sendCodeMode: function() {
                if (this.usernameInput === "" || this.passwordInput === "") {
                    this.logger.error("empty entry");
                    return;
                }

                this.displayMode = "";
                let self = this;
                setTimeout(function() {
                    self.displayMode = self.displayModeList.sendCode;
                }, 200)
            },
            formMode: function() {
                this.displayMode = "";
                let self = this;
                setTimeout(function() {
                    self.displayMode = self.displayModeList.form;
                }, 200)
            },

            lostPasswordSendCodeMode: function() {
                this.displayMode = "";
                let self = this;
                setTimeout(function() {
                    self.displayMode = self.displayModeList.lostPasswordSendCode
                }, 200)
            },

            lostPasswordConfirmCodeMode: function() {
                if (this.lostPasswordUsernameInput === "") {
                    this.logger.error("empty username input");
                    return
                }

                this.displayMode = this.displayModeList.lostPasswordConfirmCode
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

    .fade-enter-active {
        transition: opacity 0s;
    }

    .fade-enter-active {
        transition: opacity 1s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }

</style>