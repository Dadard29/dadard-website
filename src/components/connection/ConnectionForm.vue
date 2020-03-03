<template>
    <div>
        <h3>Connection</h3>
        <form class="form">
            <div class="form-group">
                <label for="usernameInput">Username</label>
                <input v-model="username" type="text" class="form-control" id="usernameInput" placeholder="Enter username" required>
            </div>
            <div class="form-group">
                <label for="passwordInput">Password</label>
                <input v-model="password" type="password" class="form-control" id="passwordInput" placeholder="Enter password" required>
            </div>
            <div class="btn-group" role="group">
                <button v-on:click="signUp" type="button" class="btn btn-outline-primary">Sign up</button>
                <button v-on:click="logIn" type="button" class="btn btn-outline-primary">Log in</button>
            </div>
            <span style="color: red; padding-left: 30px">{{errorStatus}}</span>
        </form>
    </div>
</template>

<script>
    const axios = require('axios').default;
    const config = require("../../assets/config.json");

    export default {
        name: "ConnectionForm",
        data: function () {
          return {
              username: null,
              password: null,
              errorStatus: null,
              apiUrl: `${config.apiHost}/profile/auth/jwt`
          }
        },
        props: {
          connected: Boolean
        },
        methods: {
            logIn: function () {
                if (this.username == null || this.password == null) {
                    this.errorStatus = "empty entry";
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
                               self.errorStatus = msg
                           }
                        } else {
                            self.$emit('update', true)
                        }
                    }).catch(function(error) {
                        console.log(error)
                });

            },
            signUp: function () {
                if (this.username == null || this.password == null) {
                    this.errorStatus = "empty entry"
                }
            }
        }
    }
</script>

<style scoped>
    .form {
        padding-left: 60px;

    }
</style>