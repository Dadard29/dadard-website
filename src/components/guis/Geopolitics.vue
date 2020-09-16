<template>
    <div>
            <div v-if="subscribed == null">
                Loading...
            </div>
            <div v-else-if="subscribed === false">
                You did not subscribe to this API.
                Checkout the <router-link to="/catalog/geopolitics">catalog</router-link>
            </div>
            <div v-else class="geop-dashboard">
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
                    <div v-if="tab === tabValues.graphViewer" class="row" style="width: 100%">
<!--                        graph viewer-->
                        <div class="col">
                            <div id="graphNode" class="container"></div>
                        </div>
                        <div class="col">
<!--                            transaction details-->
                            <div class="row">
                                <div v-if="graphViewerService.graphData !== null" style="margin: 20px">
                                    <div>
                                        <span style="font-size: 30px">{{graphViewerService.graphData.nodes.length}}</span> countries
                                        <span style="font-size: 30px">{{graphViewerService.graphData.edges.length}}</span> relations
                                    </div>
                                    <div>
                                        <small>Loaded on {{perf}}ms</small>
                                    </div>
                                </div>
                            </div>

<!--                            country-->
                            <div class="row">
                                <div v-if="graphViewerService.selectedNode != null" class="col">
                                    <div class="card">
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
                                <div v-if="graphViewerService.selectedNode != null" class="col">
                                    <div v-for="o in graphViewerService.selectedOrganisations" :key="o.key"
                                         class="row align-items-center" style="margin: 15px">
                                        <div class="col-">
                                            <a :href="o.documentation" target="_blank">
                                                <img :src="o.logo" style="width: 100px">
                                            </a>
                                        </div>
                                        <div class="col">
                                            {{o.name}}
                                        </div>
                                    </div>
                                </div>
                                <div v-if="graphViewerService.selectedNode == null">Click on a country to see details</div>
                            </div>
                        </div>
                    </div>

<!--                    relation detail content-->
                    <div v-if="tab === tabValues.relationDetailsViewer" class="row justify-content-md-center">
<!--                        country A-->
                        <div class="col-2" v-if="getCountryA() !== null">
                            <div class="card">
                                <img :src="getCountryA().flag" class="card-img-top">
                                <div class="card-header">{{getCountryA().name}}</div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col">
                                            <div>
                                                <span class="text-muted">KEY </span>
                                                {{getCountryA().key}}
                                            </div>
                                            <div>
                                                <span class="text-muted">POP </span>
                                                {{relationDetailsService.getPop(getCountryA())}}
                                            </div>
                                            <div>
                                                <span class="text-muted">CAP </span>
                                                {{getCountryA().capital}}
                                            </div>
                                            <div>
                                                <span class="text-muted">COO </span>
                                                <a :href="`https://www.google.com/maps/place/${relationDetailsService.getCoordinate(getCountryA())}`"
                                                    target="_blank">{{relationDetailsService.getCoordinate(getCountryA())}}</a>
                                            </div>
                                            <div>
                                                <span class="text-muted">CUR </span>
                                                <span v-for="c in getCountryA().currencies" :key="c"
                                                      class="badge badge-secondary" style="margin: 3px">{{c}}</span>
                                            </div>
                                            <div>
                                                <span class="text-muted">LAN </span>
                                                <span v-for="c in getCountryA().languages" :key="c"
                                                      class="badge badge-primary" style="margin: 3px">{{c}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

<!--                        data-->
                        <div class="col">
<!--                            charts-->
                            <div class="row justify-content-md-center">
<!--                                sectors-->
                                <div class="col-3">
                                    <canvas id="sectorsChart" width="200px" height="200px"></canvas>
                                </div>

<!--                                score evolution-->
                                <div class="col-3">
                                    <canvas id="scoreEvolutionChart" width="200px" height="200px"></canvas>
                                </div>

                                <div class="col-3">
                                    <canvas id="initChart" width="200px" height="200px"></canvas>
                                </div>
                            </div>

<!--                            grid-->
                            <div class="row">
                                <Grid v-if="relationDetailsService.edgeHistoryDataset != null"
                                      :cols="getEdgeHistoryDataset().cols"
                                      :rows="getEdgeHistoryDataset().rows"
                                      :styles="getEdgeHistoryDataset().styles"
                                      :sort="true"
                                      :pagination="true"
                                      :fixedHeader="true"
                                      :search="true"
                                      :auto-width="true"
                                ></Grid>
                            </div>
                        </div>

<!--                        country B-->
                        <div class="col-2" v-if="getCountryB() !== null">
                            <div class="card">
                                <img :src="getCountryB().flag" class="card-img-top">
                                <div class="card-header">{{getCountryB().name}}</div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col">
                                            <div>
                                                <span class="text-muted">KEY </span>
                                                {{getCountryB().key}}
                                            </div>
                                            <div>
                                                <span class="text-muted">POP </span>
                                                {{relationDetailsService.getPop(getCountryB())}}
                                            </div>
                                            <div>
                                                <span class="text-muted">CAP </span>
                                                {{getCountryB().capital}}
                                            </div>
                                            <div>
                                                <span class="text-muted">COO </span>
                                                <a :href="`https://www.google.com/maps/place/${relationDetailsService.getCoordinate(getCountryB())}`"
                                                   target="_blank">{{relationDetailsService.getCoordinate(getCountryB())}}</a>
                                            </div>
                                            <div>
                                                <span class="text-muted">CUR </span>
                                                <span v-for="c in getCountryB().currencies" :key="c"
                                                      class="badge badge-secondary" style="margin: 3px">{{c}}</span>
                                            </div>
                                            <div>
                                                <span class="text-muted">LAN </span>
                                                <span v-for="c in getCountryB().languages" :key="c"
                                                      class="badge badge-primary" style="margin: 3px">{{c}}</span>
                                            </div>
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
    import Chart from 'chart.js';

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

                sectorChart: null,
                scoreChart: null,
                initChart: null,

                perf: 0,

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
                            self.setTabGraphViewer();
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

                let t0 = performance.now();
                this.graphViewerService.getAllCountries(this.regionInput)
                    .then(function(results) {
                        self.graphRaw = results;
                        self.graphData = self.graphViewerService.processGraphRaw(self.graphRaw);
                        self.graphViewerService.renderGraph(self.graphData, self.regionInput);

                        let t1 = performance.now();
                        self.perf = t1 - t0;
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

                if (self.scoreChart !== null) {
                    self.scoreChart.destroy();
                }

                if (self.sectorChart !==  null) {
                    self.sectorChart.destroy();
                }

                if (self.initChart !== null) {
                    self.initChart.destroy();
                }

                this.relationDetailsService.getRelationDetails(this.countryAInput, this.countryBInput)
                    .then(function() {
                        // set charts
                        let sectorsCtx = document.getElementById('sectorsChart').getContext('2d');
                        let sectorsDataset = self.relationDetailsService.getSectorsDataset();
                        self.sectorChart = new Chart(sectorsCtx, {
                            type: 'doughnut',
                            data: sectorsDataset,
                            options: {
                                title: {
                                    display: true,
                                    text: 'Sector repartition'
                                },
                                responsive: true,
                                circumference: Math.PI,
                                rotation: -Math.PI
                            }
                        });

                        let scoreCtx = document.getElementById('scoreEvolutionChart').getContext('2d');
                        let timeFormat = 'DD/MM/YYYY HH:mm';
                        let scoreDataset = self.relationDetailsService.getScoreHistoryDataset(timeFormat);
                        self.scoreChart = new Chart(scoreCtx, {
                            type: 'line',
                            data: scoreDataset,
                            options: {
                                title: {
                                    display: true,
                                    text: 'Score evolution'
                                },
                                responsive: true,
                                scales: {
                                    xAxes: [{
                                        type: 'time',
                                        time: {
                                            parser: timeFormat,
                                            round: 'day',
                                            tooltipFormat: 'll HH:mm'
                                        },
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'Date'
                                        }
                                    }],
                                    yAxes: [{
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'value'
                                        }
                                    }]
                                },
                            }
                        });

                        let initCtx = document.getElementById('initChart').getContext('2d');
                        let initDataset = self.relationDetailsService.getInitDataset();
                        self.initChart = new Chart(initCtx, {
                            type: 'doughnut',
                            data: initDataset,
                            options: {
                                title: {
                                    display: true,
                                    text: 'Initiation repartition'
                                },
                                responsive: true,
                                circumference: Math.PI,
                                rotation: -Math.PI
                            }
                        });

                        // set grid
                        self.relationDetailsService.getEdgeHistoryDataset();

                        self.isLoading = false;
                    })
                    .catch(function(error) {
                        self.logger.error(error);
                        self.isLoading = false;
                    })
            },

            getCountryA() {
                return this.relationDetailsService.countryA;
            },
            getCountryB() {
                return this.relationDetailsService.countryB;
            },
            getEdgeHistoryDataset() {
                return this.relationDetailsService.edgeHistoryDataset;
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

                // fixme
                this.loadAllCountries();
            },
            setTabRelationDetailsViewer() {
                this.tab = this.tabValues.relationDetailsViewer;
                this.graphViewerService.clearGraph();

                // fixme
                this.loadRelationshipDetails();
            }
        }
    }
</script>

<style scoped>
    .geop-dashboard {
        margin-bottom: 20px;
    }

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