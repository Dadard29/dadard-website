<template>
    <div>
        <h1>Connection</h1>
        <form class="form">
            <div class="form-group">
                <label for="usernameInput">Username</label>
                <input type="text" class="form-control" id="usernameInput" placeholder="Enter username">
            </div>
            <div class="form-group">
                <label for="passwordInput">Password</label>
                <input type="password" class="form-control" id="passwordInput" placeholder="Enter password">
            </div>
            <div class="btn-group" role="group">
                <button type="submit" class="btn btn-outline-primary">Sign up</button>
                <button type="submit" class="btn btn-outline-primary">Log in</button>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        name: "ConnectionForm"
    }
</script>

<style scoped>
    .form {
        padding-left: 60px;

    }
</style>