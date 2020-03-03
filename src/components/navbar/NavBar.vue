<template>
    <nav class="navbar sticky-top navbar-expand-lg navbar-dark bg-dark justify-content-between">
        <a class="navbar-brand">
            <img src="../../assets/eddardStartPortrait.png" style="height: 50px">
            Dadard Website
        </a>
        <div class="navbar-nav">
            <a class="nav-item nav-link" >Dashboard</a>
            <a class="nav-item nav-link" >Profile</a>
            <a class="nav-item nav-link" >Catalog</a>
            <div class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    APIs User Interface
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <a class="dropdown-item" >Youtube Download</a>
                </div>
            </div>
        </div>
        Logged as {{this.username}}
    </nav>
</template>

<script>
    export default {
        name: "NavBar",
        data: function() {
            return {}
        },
        props: {
            username: String
        }
    }
</script>

<style scoped>

</style>