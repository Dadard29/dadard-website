<template>
    <nav class="navbar sticky-top navbar-expand-lg navbar-dark bg-dark justify-content-between">
        <router-link to="/" class="navbar-brand">
<!--            <img src="../../assets/eddardStartPortrait.png" style="height: 50px">-->
            <img src="../../assets/icons/title.png" style="height: 40px">.fr
        </router-link>
        <div class="navbar-nav">
            <router-link to="/dashboard" class="nav-item nav-link" exact-active-class="active">
                Dashboard
            </router-link>
            <router-link to="/profile" class="nav-item nav-link" exact-active-class="active">
                Profile
            </router-link>
            <router-link to="/catalog" class="nav-item nav-link" active-class="active">
                Catalog
            </router-link>
            <div class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Interfaces
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <router-link to="/apis/youtube-download" class="dropdown-item">
                        Youtube Download
                    </router-link>
                    <router-link to="/apis/music-researcher" class="dropdown-item">
                        Music Researcher
                    </router-link>
                    <router-link to="/apis/geopolitics" class="dropdown-item">
                        Geopolitics
                    </router-link>
                    <router-link to="/apis/dota" class="dropdown-item">
                      Dota 2 dashboard
                    </router-link>
                </div>
            </div>
            <router-link to="/about" class="nav-item nav-link" exact-active-class="active">
                About
            </router-link>
        </div>
        <div>
            Logged as {{this.profile.Username}}
            <img v-if="profile.Silver" class="silver-badge" src="../../assets/icons/hand_of_the_king.png">
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
    .silver-badge {
        height: 32px;
    }
</style>