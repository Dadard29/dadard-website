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
<!--                    panel-->
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
                                <img @click="reload" class="reload" src="../../assets/icons/refresh.png">
                            </div>
                        </div>

<!--                        switch mode (graph viewer / rel viewer)-->
                        <div class="col-auto">
                            <div class="input-group input-group-sm">
                                <div class="btn-group btn-group-sm btn-group-toggle" data-toggle="buttons">
                                    <label for="danger" class="btn btn-outline-primary active" v-on:click="setTabGraphViewer()">
                                        <input type="radio" name="filter" id="danger" autocomplete="off" > Graph Viewer
                                    </label>
                                    <label for="recovery" class="btn btn-outline-primary" v-on:click="setTabRelationDetailsViewer()">
                                        <input type="radio" name="filter" id="recovery" autocomplete="off" > Relation Details
                                    </label>
                                </div>
                            </div>
                        </div>

<!--                        load rels from country-->
                        <div class="col-md-2" v-if="tab === tabValues.graphViewer">
                            <div class="input-group input-group-sm">
                                <input v-model="countryInput" class="form-control custom-input">
                                <div class="input-group-append">
                                    <button @click="loadRelationships" type="button"
                                            class="btn btn-outline-primary" :disabled="isLoading">
                                        Load country rels
                                    </button>
                                </div>
                            </div>
                        </div>

<!--                        load rels from region-->
                        <div class="col-auto" v-if="tab === tabValues.graphViewer">
                            <div class="input-group input-group-sm">
                                <select v-model="regionInput" class="custom-select custom-input">
                                    <option value="">World</option>
                                    <option value="europe">Europe</option>
                                    <option value="asia">Asia</option>
                                    <option value="africa">Africa</option>
                                    <option value="amerSouth">South America</option>
                                    <option value="amerNorth">North America</option>
                                    <option value="oceania">Oceania</option>
                                </select>
                                <div class="input-group-append">
                                    <button @click="loadAllCountries" type="button" id="load-nodes"
                                            class="btn btn-outline-primary" :disabled="isLoading">
                                        Load all countries
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-2" v-if="tab === tabValues.relationDetailsViewer">
                            <div class="input-group input-group-sm">
                                <input v-model="countryAInput" class="form-control custom-input">
                                <input v-model="countryBInput" class="form-control custom-input">
                                <div class="input-group-append">
                                    <button @click="loadRelationshipDetails" type="button"
                                            class="btn btn-outline-primary" :disabled="isLoading">
                                        Load details
                                    </button>
                                </div>
                            </div>
                        </div>

<!--                        loading-->
                        <div class="col-auto" v-if="isLoading">
                            <div class="spinner-border spinner-border-sm text-primary" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                        </div>
                    </div>

<!--                    graphviewer content-->
                    <div v-if="tab === tabValues.graphViewer" class="row align-items-center" style="width: 80%">
<!--                        graph viewer-->
                        <div class="col">
                            <div id="graphNode" class="container"></div>
                        </div>

<!--                            country-->
                        <div class="col">
                            <div v-if="graphViewerService.selectedNode != null" class="card">
                                <img :src="graphViewerService.selectedNode.flag" class="card-img-top">
                                <div class="card-header">{{graphViewerService.selectedNode.name}}</div>
                                <div class="card-body">
                                    <div class="row" style="margin-bottom: 10px">
                                        <div class="col" style="text-align: center">
                                            <span class="global-score"
                                                  :style="`
                                                  border-color: ${graphViewerService.selectedNodeScore().color};
                                                  color: ${graphViewerService.selectedNodeScore().color};`">
                                                    {{graphViewerService.selectedNodeScore().scoreStr}}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="row align-items-center">
<!--                                        key, pop, cap-->
                                        <div class="col">
                                            <div>
                                                <span class="text-muted">KEY </span>
                                                {{graphViewerService.selectedNode.key}}
                                            </div>
                                            <div>
                                                <span class="text-muted">POP </span>
                                                {{graphViewerService.selectedNodePop()}}
                                            </div>
                                            <div>
                                                <span class="text-muted">CAP </span>
                                                {{graphViewerService.selectedNode.capital}}
                                            </div>
                                        </div>

<!--                                        coo, cur, lan-->
                                        <div class="col">
                                            <div>
                                                <span class="text-muted">COO </span>
                                                <a :href="`https://www.google.com/maps/place/${graphViewerService.selectedNodeCoordinates()}`"
                                                   target="_blank" >{{graphViewerService.selectedNodeCoordinates()}}</a>
                                            </div>
                                            <div>
                                                <span class="text-muted">CUR </span>
                                                <span v-for="c in graphViewerService.selectedNode.currencies" :key="c"
                                                      class="badge badge-secondary" style="margin: 3px">{{c}}</span>
                                            </div>
                                            <div>
                                                <span class="text-muted">LAN </span>
                                                <span v-for="c in graphViewerService.selectedNode.languages" :key="c"
                                                      class="badge badge-primary" style="margin: 3px">{{c}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

<!--                    relation detail content-->
                    <div v-if="tab === tabValues.relationDetailsViewer" class="row">
                        <div id="relationDetailNode" class="container"></div>

                    </div>
                </fullscreen>
            </div>
    </div>
</template>

<script>
    import G6 from '@antv/g6';

    import graphViewer from "@/service/apis/graphViewer";
    import relationDetails from "@/service/apis/relationDetails";
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

                // services
                accessToken: null,
                graphViewerService: null,
                relationDetailsService: null,

                // dom
                fullscreen: false,
                isLoading: false,

                // input
                countryInput: "FRA",
                regionInput: "",
                countryAInput: "FRA",
                countryBInput: "USA",

                graphRaw: null,
                graphData: null,

                tabValues: {
                    graphViewer: 'graphViewer',
                    relationDetailsViewer: 'relationDetailsViewer',
                },
                tab: 'graphViewer'

            }
        },
        computed: {

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

                            self.graphViewerService = new graphViewer({
                                "X-Access-Token": self.accessToken
                            }, hostname);

                            self.relationDetailsService = new relationDetails({
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
                self.isLoading = true;

                this.graphViewerService.getAllCountries(this.regionInput)
                    .then(function(results) {
                        self.graphRaw = results;
                        self.graphData = self.graphViewerService.processGraphRaw(self.graphRaw);
                        self.graphViewerService.renderGraph(self.graphData, self.regionInput);

                        self.isLoading = false;
                    })
                    .catch(function(error) {
                        self.logger.error(error);
                        self.isLoading = false;
                    })
            },
            loadRelationships() {
                let self = this;
                self.isLoading = true;

                this.graphViewerService.getRelationships(this.countryInput)
                    .then(function(results) {
                        self.graphRaw = results;
                        self.graphData = self.graphViewerService.processGraphRaw(self.graphRaw);
                        self.graphViewerService.renderGraph(self.graphData, null);

                        self.isLoading = false;
                    })
                    .catch(function(error) {
                        self.logger.error(error);
                        self.isLoading = false;
                    })
            },

            loadRelationshipDetails() {
                let self = this;
                self.isLoading = true;

                this.relationDetailsService.getRelationDetails(this.countryAInput, this.countryBInput)
                    .then(function(results) {
                        self.graphRaw = results;
                        self.graphData = self.relationDetailsService.processGraphRaw(
                            self.graphRaw.nodes, self.graphRaw.edgeScore);
                        self.relationDetailsService.renderGraph(self.graphData, null);

                        self.isLoading = false;
                    })
                    .catch(function(error) {
                        self.logger.error(error);
                        self.isLoading = false;
                    })
            },

            toggleFullScreen () {
                this.$refs['fullscreen'].toggle()
            },
            fullscreenChange (fullscreen) {
                this.fullscreen = fullscreen
            },
            reload() {
                window.location.reload();
            },

            setTabGraphViewer() {
                this.tab = this.tabValues.graphViewer;
                this.relationDetailsService.clearGraph();

                // fixme
                this.loadAllCountries();
            },
            setTabRelationDetailsViewer() {
                this.tab = this.tabValues.relationDetailsViewer;
                this.graphViewerService.clearGraph();
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

    .reload {
        width: 22px;
        height: 22px;
        border: solid 1px white;
        border-radius: 4px;
        margin-left: 5px;
        margin-right: 5px;
    }

    .reload:hover {
        filter: brightness(50%);
    }

    .global-score {
        font-size: 48px;
        border: solid 1px white;
        padding: 8px;
        border-radius: 37px;
    }

    .custom-input {
        background-color: black;
        color: white;
    }
</style>