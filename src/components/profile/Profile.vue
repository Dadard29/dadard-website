<template>
    <div>
        <div v-if="profile">
            <div class="container-fluid">
                <h3>Profile</h3>
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
            </div>
        </div>
        <div v-else>
            Loading...
        </div>

        <div class="container-fluid">
            <div class="row align-items-center" style="border-top: solid 1px white; border-bottom: solid 1px white; padding:15px">
                <div class="col-sm" style="border-right: solid 1px white">

<!--                    confirmation password-->
                    <div class="row align-items-center">
                        <div class="col-sm">
                            <h4 style="color: red">Danger zone</h4>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text custom-input-prepend">#</div>
                                    </div>
                                    <input v-model="inputPassword" type="password" class="form-control custom-input" id="password" placeholder="Enter your password" required>
                                </div>
                            </div>
                        </div>
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

                            <button class="btn btn-outline-warning" v-on:click="changePassword">Change password</button>
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

                            <button class="btn btn-outline-danger" v-on:click="deleteProfile">Delete profile</button>
                        </div>
                    </div>
                </div>
                <div class="col-sm">
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
                inputPassword: null,
                newPassword: null,
                newPasswordConfirm: null,
                usernameInput: null,
            }
        },
        created() {
            this.logger = new LoggerService();
            const token = localStorage.getItem(config.jwt.tokenKey);
            const headers = {
                Authorization: token
            };
            this.service = new profileService(headers);
            this.getProfile()
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
                this.service.getProfile()
                    .then(function(profile) {
                        self.profile = profile;
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

                this.service.changePassword(this.profile.Username, this.inputPassword, this.newPassword)
                    .then(function() {
                        self.logger.info("password updated")
                    })
                    .catch(function(error) {
                        self.logger.error(error)
                    })
            },
            deleteProfile() {
                let self = this;

                if (this.newPassword !== this.newPasswordConfirm) {
                    self.logger.error("password mismatch");
                    return
                }

                if (this.usernameInput !== this.profile.Username) {
                    self.logger.error("username mismatch");
                    return
                }

                this.service.deleteProfile()
                    .then(function() {
                        self.logger.info("profile deleted")
                    })
                    .catch(function(error) {
                        self.logger.error(error);
                    })
            }
        }

    }
</script>

<style scoped>

</style>