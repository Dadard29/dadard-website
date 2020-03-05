<template>
    <nav class="navbar sticky-top navbar-expand-lg navbar-dark bg-dark justify-content-between">
        <a class="navbar-brand">
            <img src="../../assets/eddardStartPortrait.png" style="height: 50px">
            Dadard Website
        </a>
        <div class="navbar-nav">
            <router-link to="/" class="nav-item nav-link" exact-active-class="active">
                Dashboard
            </router-link>
            <router-link to="/profile" class="nav-item nav-link" exact-active-class="active">
                Profile
            </router-link>
            <router-link to="/catalog" class="nav-item nav-link" exact-active-class="active">
                Catalog
            </router-link>
        </div>
        <div>
            Logged as {{this.profile.Username}}
            <button v-on:click="logOut" class="btn btn-outline-danger" style="margin-left: 30px">Log Out</button>
        </div>
    </nav>
</template>

<script>
    import Profile from "../../models/profile";

    export default {
        name: "NavBar",
        data: function() {
            return {}
        },
        props: {
            profile: Profile
        },
        methods: {
            logOut: function() {
                this.$emit('disconnect')
            }
        }
    }
</script>

<style>
    .router-link-active {

    }
</style>