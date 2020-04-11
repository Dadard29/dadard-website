<template>
    <div class="container-fluid" style="padding: 40px">
        <div class="row">
            <div class="col-lg">
                <Home/>
            </div>
            <div class="col-1">
                <div class="verticalBar"></div>
            </div>
            <div class="col-lg">
                <h1 style="margin: 60px 0 60px 0">Hello my dude</h1>
                <div class="row" style="padding: 15px 0 15px 0">
                    <div class="col">
                        <router-link to="/dashboard" class="btn btn-outline-primary link">
                            <img src="../../assets/icons/dashboard.png" style="height: 64px">
                            Dashboard
                        </router-link>
                    </div>
                </div>
                <div class="row" style="padding: 15px 0 15px 0">
                    <div class="col">
                        <router-link to="/profile" class="btn btn-outline-primary link">
                            <img src="../../assets/icons/bonfire.png" style="height: 64px">
                            Profile
                        </router-link>
                    </div>
                </div>
                <div class="row" style="padding: 15px 0 15px 0">
                    <div class="col">
                        <router-link to="/catalog" class="btn btn-outline-primary link">
                            <img src="../../assets/icons/magazine.png" style="height: 64px">
                            Catalog
                        </router-link>
                    </div>
                </div>
                <div class="row" style="padding: 15px 0 15px 0">
                    <div class="col">
                        <router-link to="/about" class="btn btn-outline-primary link">
                            <img src="../../assets/icons/about.png" style="height: 64px">
                            About
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Home from "@/components/home/Home";
    export default {
        name: "HomeConnected",
        components: {Home}
    }
</script>

<style scoped>
    .verticalBar {
        border-left: 1px solid white;
        height: 94%;
    }

    .link {
        margin-left: 50px;
        text-align: left;
        font-size: 32px;
        width: 60%;
    }
</style>