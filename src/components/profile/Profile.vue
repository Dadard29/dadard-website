<template>
    <div>
        <div v-if="profile">
            <div class="container-fluid">
                <h3>
                    Profile
                </h3>
            </div>
            <div class="container-fluid" style="padding: 30px">
                <div class="row">
                    <div class="col-2 text-muted">
                        Username
                    </div>
                    <div class="col-sm">
                        {{profile.Username}}
                    </div>
                </div>
                <div class="row">
                    <div class="col-2 text-muted">
                        Date registered
                    </div>
                    <div class="col-sm">
                        {{parseTime(profile.DateCreated)}}
                    </div>
                </div>
                <div class="row">
                    <div class="col-2 text-muted">
                        Profile key
                    </div>
                    <div class="col-sm">
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" :id="profile.ProfileKey" :value="profile.ProfileKey" readonly>
                            <div class="input-group-append">
                                <button class="btn btn-outline-primary" v-on:click="copy(profile.ProfileKey)">Copy</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row align-items-center">
                    <div class="col-2 text-muted">
                        Silver
                    </div>
                    <div class="col-sm">
                        <span v-if="profile.Silver">
                            <h5>
                            <div class="badge badge-secondary" style="background-color: #c0c0c0">
                                Silver activated
                            </div>
                            <span style="padding-left: 15px">
                                <img style="height: 64px" src="../../assets/icons/hand_of_the_king.png">
                            </span>
                        </h5>
                        </span>
                        <span v-else class="text-muted">
                            You are not a hand of the king
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            Loading...
        </div>

        <div class="container-fluid">
            <div class="row" style="border-top: solid 1px white; border-bottom: solid 1px white; padding:15px">
                <div class="col-8" style="border-right: solid 1px white">

<!--                    confirmation password-->
                    <div class="row align-items-center">
                        <div class="col-sm">
                            <div class="form-group">
                                <label for="password">Password</label>
                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text custom-input-prepend">#</div>
                                    </div>
                                    <input v-model="passwordInput" type="password" class="form-control custom-input" id="password" placeholder="Enter your password" required>
                                </div>
                            </div>

                            <div style="text-align: center">
                                <div class="btn-group btn-group-toggle" data-toggle="buttons">
                                    <label for="danger" class="btn btn-outline-primary active" v-on:click="setDangerZone()">
                                        <input type="radio" name="filter" id="danger" autocomplete="off" > Danger zone
                                    </label>
                                    <label for="recovery" class="btn btn-outline-primary" v-on:click="setRecoverySettings()">
                                        <input type="radio" name="filter" id="recovery" autocomplete="off" > Recovery settings
                                    </label>
                                    <label for="notif" class="btn btn-outline-primary" v-on:click="setNotificationSettings()">
                                        <input type="radio" name="filter" id="notif" autocomplete="off" > Notifications
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

<!--                    // danger zone-->
                    <div v-if="this.tab === this.dangerZone" style="margin-top: 20px">
                        <div class="row">
                            <h4 style="color: red">Danger zone</h4>
                        </div>
                        <div class="row align-items-center">
    <!--                        change password-->
                            <div class="col-sm" style="border-right: solid 1px white">
                                <div class="form-group">
                                    <label for="newPassword">New password</label>
                                    <div class="input-group mb-2">
                                        <div class="input-group-prepend">
                                            <div class="input-group-text custom-input-prepend">#1</div>
                                        </div>
                                        <input v-model="newPassword" type="password" class="form-control custom-input" id="newPassword" placeholder="Enter your new password" required>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="newPasswordConfirm">Confirm</label>
                                    <div class="input-group mb-2">
                                        <div class="input-group-prepend">
                                            <div class="input-group-text custom-input-prepend">#2</div>
                                        </div>
                                        <input v-model="newPasswordConfirm" type="password" class="form-control custom-input" id="newPasswordConfirm" placeholder="Confirm your new password" required>
                                    </div>
                                </div>

                                <div class="form-group" style="text-align: right">
                                    <button class="btn btn-outline-warning" v-on:click="changePassword">Change password</button>
                                </div>
                            </div>

    <!--                        delete profile-->
                            <div class="col-sm">
                                <div class="form-group">
                                    <label for="usernameInput">Confirm your username</label>
                                    <div class="input-group mb-2">
                                        <div class="input-group-prepend">
                                            <div class="input-group-text custom-input-prepend">@</div>
                                        </div>
                                        <input v-model="usernameInput" type="text" class="form-control custom-input" id="usernameInput" placeholder="Confirm your username" required>
                                    </div>
                                </div>

                                <div class="form-group" style="text-align: right">
                                    <button class="btn btn-outline-danger" v-on:click="deleteProfile">Delete profile</button>
                                </div>
                            </div>
                        </div>
                    </div>

<!--                    // recovery settings-->
                    <div v-if="this.tab === this.recoverySettings" style="margin-top: 20px">
                        <div class="row">
                            <h4 style="color: orange">Recovery settings</h4>
                        </div>
                        <small v-if="noRecovery">You currently do not have recovery settings: if you lose your password, you're screwed</small>
                        <div class="row">
                            <div class="col">
                                <div class="form-group">
                                    <label for="recoveryBy">Recover by</label>
                                    <select @change="needToUpdate = true" v-model="profile.RecoverBy" id="recoveryBy" class="custom-select">
                                        <option :value="recoverByList.telegram">Telegram</option>
                                        <option :value="recoverByList.email">Email</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="contact">Contact</label>
                                    <div class="input-group mb-2">
                                        <div class="input-group-prepend">
                                            <div @change="needToUpdate = true" class="input-group-text custom-input-prepend">@</div>
                                        </div>
                                        <input v-model="profile.Contact" type="text"
                                               class="form-control custom-input" id="contact" required>
                                    </div>
                                </div>
                                <div class="form-group" style="text-align: right">
                                    <span style="padding: 0 5px 0 5px">
                                        <button @click="updateRecoverySettings" class="btn btn-outline-warning" :disabled="!needToUpdate">Update</button>
                                    </span>
                                    <span style="padding: 0 5px 0 5px">
                                        <button @click="testRecoverySettings" class="btn btn-outline-primary" :disabled="needToUpdate">Test</button>
                                    </span>
                                    <span style="padding: 0 5px 0 5px">
                                        <button @click="deleteRecoverySettings" class="btn btn-outline-danger">Remove</button>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="this.tab === this.notificationSettings" style="margin-top: 20px">
                        <div class="row">
                            <h4 style="color: orange">Notification settings</h4>
                        </div>
                        <div class="row">
                            <div class="col">
                                <div class="form-group">
                                    <div class="custom-control custom-checkbox">
                                        <input v-model="profile.BeNotified" type="checkbox" class="custom-control-input" id="customCheck1">
                                        <label class="custom-control-label" for="customCheck1">Receive notifications</label>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <p>
                                        If checked, you will received notifications using the channel you specified in your recovery
                                        settings.
                                    </p>
                                    <p>
                                        The notification content will exclusively be informative. No ads, nor promotions or business stuff
                                        will ever be sent.
                                    </p>
                                </div>

                                <div class="form-group" style="text-align: right">
                                    <button @click="updateNotificationSettings" class="btn btn-outline-warning">Update</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <Logger :logger-service="logger"></Logger>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import LoggerService from "@/models/logger";
    import Logger from "@/components/logger/Logger";

    const config = require('@/assets/config.json');
    const profileService = require('@/service/profileService').default;

    export default {
        name: "Profile",
        components: {Logger},
        data() {
            return {
                logger: null,
                profile: null,
                service: null,
                passwordInput: null,
                newPassword: null,
                newPasswordConfirm: null,
                usernameInput: null,
                jwt: null,


                noRecovery: true,
                recoverByList: {
                    telegram: "telegram",
                    email: "email"
                },

                // dom
                dangerZone: "dangerZone",
                recoverySettings: "recoverySettings",
                notificationSettings: "notificationSettings",

                tab: "",
                needToUpdate: false
            }
        },
        created() {
            this.logger = new LoggerService();
            this.jwt = localStorage.getItem(config.jwt.tokenKey);
            this.service = new profileService({});
            this.getProfile();
            this.setDangerZone();
        },
        methods: {
            parseTime(s) {
                return new Date(s).toDateString()
            },
            copy(id) {
                const input = document.getElementById(id);
                input.select();
                document.execCommand('copy');
            },
            getProfile() {
                let self = this;
                this.service.getProfile(this.jwt)
                    .then(function(profile) {
                        self.profile = profile;

                        self.noRecovery = !(profile.RecoverBy !== "" || profile.Contact !== "");
                        self.logger.info("profile retrieved")
                    })
                    .catch(function(error){
                        self.logger.error(error)
                    })
            },
            changePassword() {
                let self = this;

                if (this.newPassword !== this.newPasswordConfirm) {
                    self.logger.error("password mismatch");
                    return
                }

                this.service.changePassword(this.profile.Username, this.passwordInput, this.newPassword)
                    .then(function() {
                        self.logger.info("password updated")
                    })
                    .catch(function(error) {
                        self.logger.error(error)
                    })
            },
            deleteProfile() {
                let self = this;

                if (this.usernameInput !== this.profile.Username) {
                    self.logger.error("username mismatch");
                    return
                }

                this.service.deleteProfile(this.usernameInput, this.passwordInput)
                    .then(function() {
                        self.logger.info("profile deleted")
                    })
                    .catch(function(error) {
                        self.logger.error(error);
                    })
            },
            updateRecoverySettings() {
                let self = this;
                this.service.updateRecoverySettings(this.profile.Username, this.passwordInput,
                    this.profile.RecoverBy, this.profile.Contact)
                    .then(function(msg) {
                        self.logger.info(msg);

                        self.getProfile();
                        self.needToUpdate = false;
                    })
                    .catch(function(error) {
                        self.logger.error(error);
                    })
            },

            testRecoverySettings() {
                let self = this;
                this.service.testRecoverySettings(this.profile.Username, this.passwordInput)
                    .then(function(msg) {
                        self.logger.info(msg);
                    })
                    .catch(function(error) {
                        self.logger.error(error)
                    })
            },

            deleteRecoverySettings() {
                let self = this;
                this.service.deleteRecoverySettings(this.profile.Username, this.passwordInput)
                    .then(function(msg) {
                        self.logger.info(msg);

                        self.getProfile()
                    })
                    .catch(function(error) {
                        self.logger.error(error)
                    })
            },

            updateNotificationSettings() {
                let self = this;
                this.service.updateNotificationSettings(this.profile.Username, this.passwordInput,
                                                            this.profile.BeNotified)
                    .then(function(msg) {
                        self.logger.info(msg);

                        self.getProfile()
                    })
                    .catch(function(error) {
                        self.logger.error(error)
                    })
            },

            // dom
            setDangerZone() {
                this.tab = this.dangerZone;
            },
            setRecoverySettings() {
                this.tab = this.recoverySettings;
            },
            setNotificationSettings() {
                this.tab = this.notificationSettings;
            }
        }

    }
</script>

<style scoped>
    .horizontal-silver-badge {
        width: 128px;
        /*padding-left: 30px;*/
    }

    select {
        background-color: black;
        color: white;
    }

</style>