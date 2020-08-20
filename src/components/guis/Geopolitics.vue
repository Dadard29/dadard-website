<template>
    <div>
            <div v-if="subscribed == null">
                Loading...
            </div>
            <div v-else-if="subscribed === false">
                You did not subscribe to this API.
                Checkout the <router-link to="/catalog/geopolitics">catalog</router-link>
            </div>
            <div v-else id="graphViewer">
                <h3>Geopolitics Viewer</h3>
                <fullscreen ref="fullscreen" @change="fullscreenChange" background="black" >
                    <div id="panel" class="container">
                        <div class="row">
                            <div class="col-">
                                <img @click="toggleFullScreen" class="fullscreen-toggle panel-widget" src="../../assets/icons/full_screen.png">
                            </div>
                            <div class="col-">
                                <div class="input-group mb-2">
                                    <input v-model="countryInput" class="form-control country-input panel-widget">
                                    <div class="input-group-append">
                                        <button @click="loadRelationships" type="button"
                                                class="btn btn-outline-primary panel-widget" style="padding: 0 5px 0 5px">
                                            <img src="../../assets/icons/graph.png" style="height: 20px">
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="col">
                                <button @click="loadAllCountries" type="button"
                                        class="btn btn-outline-primary panel-widget" style="padding: 0 5px 0 5px">
                                    <img src="../../assets/icons/france.png" style="height: 20px">
                                </button>
                            </div>
                        </div>
                    </div>
                    <div id="graphNode" class="container">

                    </div>
                </fullscreen>
            </div>
    </div>
</template>

<script>
    import G6 from '@antv/g6';
    import geopolitics from "@/service/apis/geopolitics";
    import LoggerService from "@/models/logger";

    const config = require('@/assets/config.json');
    const apiService = require('@/service/apiService').default;

    export default {
        name: "Geopolitics",
        mounted() {
            this.logger = new LoggerService();

            this.logger.info("loaded g6 version", G6.Global.version);

            const jwt = localStorage.getItem(config.jwt.tokenKey);
            this.apiService = new apiService({
                Authorization: jwt
            });

            this.getSub();
        },
        data() {
            return {
                apiName: "geopolitics",
                subscribed: null,

                accessToken: null,
                service: null,

                // dom
                fullscreen: false,

                // input
                countryInput: "FRA",

                graphRaw: null,
                graphData: null,

            }
        },
        methods: {
            getSub() {
                let self = this;
                this.apiService.getSub(this.apiName)
                    .then(function(data) {
                        if (data.Status) {
                            self.subscribed = true;
                            self.logger.debug("sub retrieved");

                            self.accessToken = data.Content.AccessToken;
                            const hostname = data.Content.Api.Hostname;
                            self.service = new geopolitics({
                                "X-Access-Token": self.accessToken
                            }, hostname);

                            // fixme - testing only
                            self.loadAllCountries()
                        } else {
                            self.subscribed = false;
                        }
                    })
                    .catch(function(error) {
                        self.logger.error(error);
                        self.subscribed = false;
                    })
            },

            loadAllCountries() {
                let self = this;

                this.service.getAllCountries()
                    .then(function(results) {
                        self.graphRaw = results;
                        self.graphData = self.service.processGraphRaw(self.graphRaw);
                        self.service.renderGraph(self.graphData);
                    })
                    .catch(function(error) {
                        self.logger.error(error)
                    })
            },
            loadRelationships() {

                let self = this;
                this.service.getRelationships(this.countryInput)
                    .then(function(results) {
                        self.graphRaw = results;
                        self.graphData = self.service.processGraphRaw(self.graphRaw);
                        self.service.renderGraph(self.graphData);
                    })
                    .catch(function(error) {
                        self.logger.error(error)
                    })
            },
            toggleFullScreen () {
                this.$refs['fullscreen'].toggle()
            },
            fullscreenChange (fullscreen) {
                this.fullscreen = fullscreen
            }
        }
    }
</script>

<style scoped>
    .fullscreen-toggle {
        border: solid 1px white;
        border-radius: 4px;
        margin-left: 5px;
        margin-right: 5px;
    }

    .fullscreen-toggle:hover {
        filter: brightness(50%);
    }

    .country-input {
        background-color: black;
        color: inherit;
        text-align: center;

    }

    .panel-widget {
        height: 22px;
    }
</style>