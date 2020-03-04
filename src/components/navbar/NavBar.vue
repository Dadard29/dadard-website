<template>
    <nav class="navbar sticky-top navbar-expand-lg navbar-dark bg-dark justify-content-between">
        <a class="navbar-brand">
            <img src="../../assets/eddardStartPortrait.png" style="height: 50px">
            Dadard Website
        </a>
        <div class="navbar-nav">
            <router-link to="/dashboard" class="nav-item nav-link" >Dashboard</router-link>
            <router-link to="/profile" class="nav-item nav-link" >Profile</router-link>
            <router-link to="/catalog">Catalog</router-link>
            <div class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Interfacesl
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <a class="dropdown-item" >Youtube Download</a>
                </div>
            </div>
        </div>
        <div>
            Logged as {{this.profile.Username}}
        </div>
    </nav>
</template>

<script>
    import Profile from "../../models/profile";
    import Router from "../router/Router";

    export default {
        name: "NavBar",
        components: {Router},
        data: function() {
            return {}
        },
        props: {
            profile: Profile
        }
    }
</script>

<style scoped>

</style>