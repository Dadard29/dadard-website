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
                <fullscreen ref="fullscreen" @change="fullscreenChange" background="black" class="container-fluid">
                    <div class="row form-row align-items-center" style="margin: 10px">
<!--                        fullscreen toggle-->
                        <div class="col-auto">
                            <div class="input-group input-group-sm">
                                <img @click="toggleFullScreen" class="fullscreen-toggle" src="../../assets/icons/full_screen.png">
                            </div>
                        </div>

<!--                        reload-->
                        <div class="col-auto">
                            <div class="input-group input-group-sm">
                                <img @click="reloadG6" class="reload-g6" src="../../assets/icons/refresh.png">
                            </div>
                        </div>

<!--                        load rels from country-->
                        <div class="col-auto">
                            <div class="input-group input-group-sm">
                                <input id="country-input" v-model="countryInput" class="form-control">
                                <div class="input-group-append">
                                    <button @click="loadRelationships" type="button" class="btn btn-outline-primary">
                                        Load country rels
                                    </button>
                                </div>
                            </div>
                        </div>

<!--                        load rels from region-->
                        <div class="col-auto">
                            <div class="input-group input-group-sm">
                                <select v-model="regionInput" class="form-control">
                                    <option value="">World</option>
                                    <option value="europe">Europe</option>
                                    <option value="asia">Asia</option>
                                    <option value="africa">Africa</option>
                                    <option value="amerSouth">South America</option>
                                    <option value="amerNorth">North America</option>
                                    <option value="oceania">Oceania</option>
                                </select>
                                <div class="input-group-append">
                                    <button @click="loadAllCountries" type="button" id="load-nodes" class="btn btn-outline-primary">
                                        Load all countries
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row align-items-center" style="width: 80%">
                        <div class="col">
                            <div id="graphNode" class="container">

                            </div>
                        </div>

                        <div class="col">
<!--                            country-->
                            <div v-if="service.selectedNode != null" class="card">
                                <img :src="service.selectedNode.flag" class="card-img-top">
                                <div class="card-header">{{service.selectedNode.name}}</div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-2 text-muted">KEY</div>
                                        <div class="col">{{service.selectedNode.key}}</div>
                                    </div>
                                    <div class="row">
                                        <div class="col-2 text-muted">POP</div>
                                        <div class="col">{{service.selectedNodePop()}}</div>
                                    </div>
                                    <div class="row">
                                        <div class="col-2 text-muted">CAP</div>
                                        <div class="col">{{service.selectedNode.capital}}</div>
                                    </div>
                                    <div class="row">
                                        <div class="col-2 text-muted">COO</div>
                                        <div class="col">
                                            <a :href="`https://www.google.com/maps/place/${service.selectedNodeCoordinates()}`"
                                               target="_blank" >{{service.selectedNodeCoordinates()}}</a>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-2 text-muted">CUR</div>
                                        <div class="col">
                                    <span v-for="c in service.selectedNode.currencies" :key="c"
                                          class="badge badge-secondary" style="margin: 3px">{{c}}</span>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-2 text-muted">LAN</div>
                                        <div class="col">
                                    <span v-for="c in service.selectedNode.languages" :key="c"
                                          class="badge badge-primary" style="margin: 3px">{{c}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                regionInput: "",

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

                this.service.getAllCountries(this.regionInput)
                    .then(function(results) {
                        self.graphRaw = results;
                        self.graphData = self.service.processGraphRaw(self.graphRaw);
                        self.service.renderGraph(self.graphData, self.regionInput);
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
                        self.service.renderGraph(self.graphData, null);
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
            },
            reloadG6() {
                window.location.reload();
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

    .reload-g6 {
        width: 22px;
        height: 22px;
        border: solid 1px white;
        border-radius: 4px;
        margin-left: 5px;
        margin-right: 5px;
    }

    .reload-g6:hover {
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