<template>
    <div>
        <div class="container-fluid">
            <h3>Dashboard</h3>
        </div>
        <div class="container text-center" style="padding: 30px">
            <div class="row align-items-center">
                <div class="col-sm stat">
                    <span class="stat-number">{{totalRequestCount}}</span>
                    requests done
                </div>
                <div class="col-sm stat">
                    <span class="stat-number">{{totalApisUp}}/{{subsList.length}}</span>
                    APIs up
                </div>
            </div>
            <div class="row">
                <div class="col-sm stat">
                    <span class="stat-number">{{subsList.length}}/{{totalApis}}</span>
                    APIs subscribed
                </div>
                <div class="col-sm stat">
                    <div v-if="profile == null" class="spinner-border text-primary" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                    <div v-else>
                        <div v-if="profile.Silver">
                            <h3>
                                <div class="badge badge-secondary" style="background-color: #c0c0c0">
                                    Silver activated
                                </div>
                                <span style="padding-left: 15px">
                                    <img style="height: 64px" src="../../assets/icons/hand_of_the_king.png">
                                </span>
                            </h3>
                        </div>
                        <div v-else>
                            <span class="text-muted">
                                You are not hand of the king
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container" style="padding: 30px">
            <table class="table">
                <thead>
                <tr>
                    <td>Name</td>
                    <td>Status</td>
                    <td>Token</td>
                    <td>Quota</td>
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
                    <td>
                        <div class="progress">
                            <div v-if="getQuotaUsedPercent(sub) === 100"
                                 class="progress-bar bg-danger" role="progressbar"
                                 aria-valuemin="0" :aria-valuemax="100" :aria-valuenow="getQuotaUsedPercent(sub)"
                                 :style="{width: getQuotaUsedPercent(sub) + '%'}">

                            </div>
                            <div v-else-if="getQuotaUsedPercent(sub) < 80"
                                 class="progress-bar bg-success" role="progressbar"
                                 aria-valuemin="0" :aria-valuemax="100" :aria-valuenow="getQuotaUsedPercent(sub)"
                                 :style="{width: getQuotaUsedPercent(sub) + '%'}">
                            </div>
                            <div v-else
                                 class="progress-bar bg-warning" role="progressbar"
                                 aria-valuemin="0" :aria-valuemax="100" :aria-valuenow="getQuotaUsedPercent(sub)"
                                 :style="{width: getQuotaUsedPercent(sub) + '%'}">
                            </div>
                        </div>
                        {{sub.RequestCount}} / {{sub.Quota}}
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import LoggerService from "@/models/logger";
    import profileService from "@/service/profileService";

    const subService = require('@/service/subService').default;
    const apiService = require('@/service/apiService').default;
    const config = require("../../assets/config.json");

    export default {
        name: "dashboard",
        data: function() {
            return {
                logger: null,
                service: null,
                apiService: null,
                profileService: null,
                subsList: [],
                totalRequestCount: 0,
                totalApisUp: 0,
                totalApis:0,
                profile: null
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
            this.profileService = new profileService({});
            this.fetchSubs();
            this.getApiList();
            this.getProfile(token);
        },
        methods: {
            copy(id) {
                const input = document.getElementById(id);
                input.select();
                document.execCommand('copy');
            },
            getQuotaUsedPercent(sub) {
                return sub.RequestCount * 100 / sub.Quota
            },
            getProfile(jwt) {
                let self = this;
                this.profileService.getProfile(jwt)
                    .then(function(profile) {
                        self.profile = profile;
                    })
            },
            fetchSubs() {
                let self = this;
                this.service.listSubs()
                    .then(function(subsList) {
                        self.subsList = [];
                        self.totalRequestCount = 0;
                        for (let i = 0; i < subsList.length; i++) {
                            let sub = subsList[i];

                            self.apiService.getStatus(sub.Api.Hostname, sub.Api.IsStandard)
                                .then(function(status) {
                                    sub.Api.Status = status;
                                    if (status) {
                                        self.totalApisUp += 1;
                                    }
                                    self.subsList.push(sub);
                                    self.totalRequestCount += sub.RequestCount;
                                })

                        }
                    })
            },
            getApiList() {
                let self = this;
                this.apiService.getApiList()
                    .then(function(l) {
                        self.totalApis = l.length;
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

    .stat {
        padding: 15px;
    }

    .stat-number {
        font-size: 64px;
    }

    td {
        vertical-align: middle;
    }
</style>