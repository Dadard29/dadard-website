<template>
    <div>
        <h3>Connection</h3>
        <form class="form">
            <div class="form-group">
                <label for="usernameInput">Username</label>
                <input v-model="username" type="text" class="form-control" id="usernameInput" placeholder="Enter username">
            </div>
            <div class="form-group">
                <label for="passwordInput">Password</label>
                <input v-model="password" type="password" class="form-control" id="passwordInput" placeholder="Enter password">
            </div>
            <div class="btn-group" role="group">
                <button v-on:click="signUp" type="button" class="btn btn-outline-primary">Sign up</button>
                <button v-on:click="logIn" type="button" class="btn btn-outline-primary">Log in</button>
            </div>
            <span style="color: red">{{errorSignIn}}</span>
        </form>
    </div>
</template>

<script>
    export default {
        name: "ConnectionForm",
        data: function () {
          return {
              username: null,
              password: null,
              errorSignIn: null,
          }
        },
        methods: {
            logIn: function () {
                if (this.username == null || this.password == null) {
                    this.errorSignIn = "bruh"
                }
            },
            signUp: function () {
                if (this.username == null || this.password == null) {
                    this.errorSignIn = "bruh"
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