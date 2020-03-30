<template>
    <div>
        <div v-if="apiObject">
            <h3 class="api-title">
                <img :src="apiObject.IconUrl" class="api-icon"> {{apiObject.Name}}
            </h3>
            <div class="container-fluid" style="padding-left: 70px">
                <div class="row main-row" >
<!--                    status + infos-->
                    <div class="col-sm">
                        <div>
                            <div class="row">
                                <span v-if="status === true" class="valid big">
                                    <img src="../../assets/icons/valid.png" class="icon-big"> UP
                                </span>
                                    <span v-if="status === false" class="invalid big">
                                    <img src="../../assets/icons/invalid.png" class="icon-big"> DOWN
                                </span>
                                    <span v-if="status === null" class="unknown big">
                                    <img src="../../assets/icons/unknown.png" class="icon-big"> UNKNOWN
                                </span>
                            </div>
                        </div>
                        <div v-if="infos">
                            <div class="row">
                                {{infos.Description}}
                            </div>
                            <div class="row">
                                <div class="col-sm">
                                    <span class="text-muted">
                                        hostname
                                    </span>
                                </div>
                                <div class="col-sm">
                                    {{apiObject.Hostname}}
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm">
                                    <span class="text-muted">
                                        contact
                                    </span>
                                </div>
                                <div class="col-sm">
                                    <a :href="`mailto:${infos.ContactEmail}`">{{infos.ContactEmail}}</a>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm">
                                    <span class="text-muted">
                                        license
                                    </span>
                                </div>
                                <div class="col-sm">
                                    <a :href="infos.LicenseUrl">{{infos.License}}</a>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm">
                                    <span class="text-muted">
                                        version
                                    </span>
                                </div>
                                <div class="col-sm">
                                    {{infos.Version}}
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <span class="text-muted">No infos available here</span>
                        </div>
                    </div>

<!--                    sub-->
                    <div class="col-sm">
                        <div v-if="!subscription">
                            <span class="invalid big">
                                <img src="../../assets/icons/invalid.png" class="icon-big"> NOT SUBSCRIBED
                                <button class="btn btn-outline-primary" v-on:click="subscribe">
                                    subscribe
                                </button>
                            </span>
                        </div>
                        <div v-else>
                            <span class="valid big">
                                <img src="../../assets/icons/valid.png" class="icon-big"> SUBSCRIBED
                                <button class="btn btn-outline-primary" v-on:click="unsubscribe">
                                    unsubscribe
                                </button>
                            </span>
                            <!--                                sub details-->
                            <div class="row" >
                                <div class="col-sm text-muted">
                                    access token
                                </div>
                                <div class="col-sm">
                                    <div class="input-group mb-3">
                                        <input type="text" class="form-control" :id="subscription.AccessToken" :value="subscription.AccessToken" readonly>
                                        <div class="input-group-append">
                                            <button class="btn btn-outline-primary" v-on:click="copy(subscription.AccessToken)">Copy</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm text-muted">
                                    subscribed at
                                </div>
                                <div class="col-sm">
                                    {{parseTime(subscription.DateSubscribed)}}
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm text-muted">
                                    requests count
                                </div>
                                <div class="col-sm">
                                    {{subscription.RequestCount}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row main-row align-items-center" style="border-bottom: solid 1px white">
                    <div class="col-sm">
                        <div class="row">
                            <div class="col-" style="padding: 10px">
                                <a :href="apiObject.DocumentationUrl" target="_blank" class="icon-link-container">
                                    <img src="../../assets/icons/book.png" class="icon-link">
                                    Documentation
                                </a>
                            </div>
                            <div class="col-" style="padding: 10px">
                                <a :href="apiObject.VCSUrl" target="_blank" class="icon-link-container">
                                    <img src="../../assets/icons/git.png" class="icon-link">
                                    VCS
                                </a>
                            </div>
                            <div class="col-" style="padding: 10px">
                                <a :href="apiObject.BuildUrl" target="_blank" class="icon-link-container">
                                    <img src="../../assets/icons/build.png" class="icon-link">
                                    Continuous Integration
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm">
                        <Logger :logger-service="logger"></Logger>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            Loading...
        </div>
    </div>
</template>

<script>
    import LoggerService from "@/models/logger";
    import Logger from "@/components/logger/Logger.vue";

    const config = require('../../assets/config.json');
    const apiService = require('../../service/apiService').default;
    const subService = require('../../service/subService').default;

    export default {
        name: "CatalogDetail",
        components: {
            Logger
        },
        data: function() {
            return {
                logger: null,
                apiObject: null,
                status: null,
                subscription: null,
                infos: null,
            }
        },
        created() {
            this.logger = new LoggerService();
            const token = localStorage.getItem(config.jwt.tokenKey);
            const headers = {
                Authorization: token
            };
            this.service = new apiService(headers);
            this.subService = new subService(headers);
            this.fetchApiDetail();
        },
        methods: {
            refresh() {
                this.fetchApiDetail()
            },
            parseTime(s) {
                return new Date(s).toDateString()
            },
            copy(id) {
                const input = document.getElementById(id);
                input.select();
                document.execCommand('copy');
            },
            subscribe() {
                let self = this;
                this.subService.subscribe(this.apiObject.Name)
                    .then(function(sub) {
                        self.subscription = sub;
                        self.logger.info("subscribed successfully");
                    })
                    .catch(function(error) {
                        self.logger.error(error);
                    })
            },
            unsubscribe() {
                let self = this;
                this.subService.unsubscribe(this.apiObject.Name)
                    .then(function() {
                        self.subscription = null;
                        self.logger.info("unsubscribed successfully");
                    })
                    .catch(function(error) {
                        self.logger.error(error);
                    })
            },
            fetchApiDetail() {
                let self = this;
                this.service.getApi(this.$route.params.apiName)
                    .then(function(apiR) {
                        self.logger.debug("api retrieved");
                        self.apiObject = apiR;
                        return self.service.getStatus(apiR.Hostname, apiR.IsStandard)
                    })
                    .then(function(status) {
                        self.logger.debug("api status retrieved");
                        self.status = status;
                        return self.service.getSub(self.apiObject.Name)
                    })
                    .then(function(sub) {
                        self.logger.debug("subscription status retrieved");
                        if (sub.Status === true) {
                            self.subscription = sub.Content;
                        }

                        if (self.status) {
                            return self.service.getInfos(
                                self.apiObject.Hostname,
                                self.apiObject.IsStandard
                            )
                        }
                    })
                    .then(function(infos) {
                        self.logger.debug("api infos retrieved");
                        self.infos = infos
                    })
            }
        }
    }
</script>

<style scoped>
    .api-title {
        padding: 5px;
        /*border-bottom: solid 1px white;*/
        text-transform: uppercase;
        font-weight: bold;
    }

    .valid {
        font-weight: bold;
        color: green;
        text-transform: uppercase;
    }

    .invalid {
        font-weight: bold;
        color: red;
        text-transform: uppercase;
    }

    .unknown {
        font-weight: bold;
        color: white;
        text-transform: uppercase;
    }

    .api-icon {
        height: 64px;
    }

    .icon-big {
        height: 32px;
    }

    .big {
        font-size: 24px;
    }

    .main-row {
        /*border-bottom: solid 1px white;*/
        border-top: solid 1px white;
    }

    .row {
        padding: 5px;
    }

    .icon-link-container {
        border: solid 1px grey;
        border-radius: 16px;
        padding-top: 16px;
        padding-bottom: 16px;
        padding-right: 16px;
        text-decoration: none;
        font-size: 16px;
        transition: 0.25s;
    }

    .icon-link-container:hover {
        background-color: grey;
        color: white;
    }

    .icon-link {
        height: 48px;
        padding: 5px;
    }
</style>