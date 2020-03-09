<template>
    <div>
        <div class="container-fluid">
            <h3>Dashboard</h3>
        </div>
        <div class="container padding: 30px">
            <table class="table">
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Status</td>
                        <td>Token</td>
                    </tr>
                </thead>
                <tbody>
                <tr v-for="sub in subsList" :key="sub.AccessToken">
                    <td>
                        <router-link :to="`/catalog/${sub.Api.Name}`" class="thumb-link">
                            {{sub.Api.Name}}
                        </router-link>
                    </td>
                    <td>
                        <img v-if="sub.Api.Status === true" src="../../assets/icons/valid.png" class="icon">
                        <img v-if="sub.Api.Status === false" src="../../assets/icons/invalid.png" class="icon">
                        <img v-if="sub.Api.Status === null" src="../../assets/icons/unknown.png" class="icon">
                    </td>
                    <td>
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" :id="sub.AccessToken" :value="sub.AccessToken" readonly>
                            <div class="input-group-append">
                                <button class="btn btn-outline-primary" v-on:click="copy(sub.AccessToken)">Copy</button>
                            </div>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import LoggerService from "@/models/logger";

    const subService = require('@/service/subService').default;
    const apiService = require('@/service/apiService').default;
    const config = require("../../assets/config.json");

    export default {
        name: "dashboard",
        data: function() {
            return {
                logger: null,
                service: null,
                subsList: []
            }
        },
        created: function() {
            this.logger = new LoggerService();
            let token = localStorage.getItem(config.jwt.tokenKey);
            const headers = {
                Authorization: token
            };
            this.service = new subService(headers);
            this.apiService = new apiService(headers);
            this.fetchSubs();
        },
        methods: {
            copy(id) {
                const input = document.getElementById(id);
                input.select();
                document.execCommand('copy');
            },
            fetchSubs() {
                let self = this;
                this.service.listSubs()
                    .then(function(subsList) {
                        self.subsList = [];
                        for (let i = 0; i < subsList.length; i++) {
                            let sub = subsList[i];

                            self.apiService.getStatus(sub.Api.Hostname, sub.Api.IsStandard)
                                .then(function(status) {
                                    sub.Api.Status = status;
                                    self.subsList.push(sub)
                                })

                        }
                    })
            }
        }
    }
</script>

<style scoped>
    .thumb-link {
        text-transform: uppercase;
        color: white;
        font-weight: bold;
    }

    .thumb-link:hover {
        color: grey;
        text-decoration: none;
    }

    .icon {
        height: 32px;
    }
</style>