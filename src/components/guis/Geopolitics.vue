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

<!--                        switch mode (graph viewer / rel viewer...)-->
                        <div class="col-auto">
                            <div class="input-group input-group-sm">
                                <div class="btn-group btn-group-sm btn-group-toggle" data-toggle="buttons">
                                    <label for="graph-viewer" class="btn btn-outline-primary active" v-on:click="setTabGraphViewer()">
                                        <input type="radio" name="filter" id="graph-viewer" autocomplete="off" > Graph Viewer
                                    </label>
                                    <label for="country-detail" class="btn btn-outline-primary" v-on:click="setTabCountryDetailsViewer()">
                                        <input type="radio" name="filter" id="country-detail" autocomplete="off" > Country Details
                                    </label>
                                    <label for="relation-detail" class="btn btn-outline-primary" v-on:click="setTabRelationDetailsViewer()">
                                        <input type="radio" name="filter" id="relation-detail" autocomplete="off" > Relation Details
                                    </label>
                                    <label for="relation-pending" class="btn btn-outline-primary" v-on:click="setTabRelationPendingViewer()">
                                        <input type="radio" name="filter" id="relation-pending" autocomplete="off" > Relation Pending
                                    </label>
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

<!--                        load rels from country-->
                        <div class="col-md-2" v-if="tab === tabValues.countryDetailsViewer">
                            <div class="input-group input-group-sm">
                                <input v-model="countryInput" class="form-control custom-input">
                                <div class="input-group-append">
                                    <button @click="loadCountriesDetails" type="button"
                                            class="btn btn-outline-primary" :disabled="isLoading">
                                        Load country details
                                    </button>
                                </div>
                            </div>
                        </div>

<!--                        load rels details-->
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

<!--                    country details content-->
                    <div v-if="tab === tabValues.countryDetailsViewer" class="row" style="width: 100%">
                        <div v-if="countryDetailsService.country !== null" class="row">
<!--                            country details-->
                            <div class="col-2">
                                <div class="row">

                                    <div class="card">
                                            <img :src="countryDetailsService.country.flag" class="card-img-top">
                                            <div class="card-header">{{countryDetailsService.country.name}}</div>
                                            <div class="card-body">
                                                <div class="row align-items-center">
                                                    <!--                                        key, pop, cap-->
                                                    <div class="col">
                                                        <div>
                                                            <span class="text-muted">KEY </span>
                                                            {{countryDetailsService.country.key}}
                                                        </div>
                                                        <div>
                                                            <span class="text-muted">POP </span>
                                                            {{countryDetailsService.countryPop()}}
                                                        </div>
                                                        <div>
                                                            <span class="text-muted">CAP </span>
                                                            {{countryDetailsService.country.capital}}
                                                        </div>
                                                    </div>

                                                    <!--                                        coo, cur, lan-->
                                                    <div class="col">
                                                        <div>
                                                            <span class="text-muted">COO </span>
                                                            <a :href="`https://www.google.com/maps/place/${countryDetailsService.countryCoordinates()}`"
                                                               target="_blank" >{{countryDetailsService.countryCoordinates()}}</a>
                                                        </div>
                                                        <div>
                                                            <span class="text-muted">CUR </span>
                                                            <span v-for="c in countryDetailsService.country.currencies" :key="c"
                                                                  class="badge badge-secondary" style="margin: 3px">{{c}}</span>
                                                        </div>
                                                        <div>
                                                            <span class="text-muted">LAN </span>
                                                            <span v-for="c in countryDetailsService.country.languages" :key="c"
                                                                  class="badge badge-primary" style="margin: 3px">{{c}}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div v-for="o in countryDetailsService.organisations" :key="o.key"
                                         class="row align-items-center" style="margin: 15px">
                                        <a :href="o.documentation" target="_blank">
                                            <img :src="o.logo" style="width: 100px">
                                        </a>
                                    </div>
                                </div>
                            </div>
<!--                            rels history-->
                            <div class="col">
                                <div class="row justify-content-md-center">
                                    <div class="col-3">
                                        <canvas id="countrySectorsChart" width="200px" height="200px"></canvas>
                                    </div>
                                    <div class="col-3">
                                        <canvas id="countryScoreEvolutionChart" width="200px" height="200px"></canvas>
                                    </div>
                                    <div class="col-3">
                                        <canvas id="countryInitChart" width="200px" height="200px"></canvas>
                                    </div>
                                </div>
                                <div class="row">
                                    <Grid v-if="getRelationListDataset() != null"
                                          :cols="getRelationListDataset().cols"
                                          :rows="getRelationListDataset().rows"
                                          :styles="getRelationListDataset().styles"
                                          :sort="true"
                                          :pagination="true"
                                          :fixedHeader="true"
                                          :search="true"
                                          :auto-width="true"
                                    ></Grid>
                                </div>
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

<!--                    relation pending content-->
                    <div v-if="tab === tabValues.relationPendingViewer" class="row">
<!--                        pending list-->
                        <div class="col">
                            <div v-if="relationPendingService.relationshipPendingList.length > 0">
                                <div v-for="r in relationPendingService.relationshipPendingList" :key="r.key" class="card" style="margin: 10px">
                                    <div class="card-body">
                                        <div class="row align-items-center">
                                            <div class="col"><a class="btn btn-outline-primary" :href="r.article_link" target="_blank">article</a></div>
                                            <div class="col-5">
                                                {{r.tweet_text}}
                                            </div>
                                            <div class="col">
                                                <span class="badge badge-primary" v-for="h in r.hashtags" :key="h" style="margin: 5px">
                                                    {{h}}
                                                </span>
                                            </div>
                                            <div class="col">
                                                <button class="btn btn-outline-success" @click="setSelectedRelationPending(r)">Confirm</button>
                                            </div>
                                            <div class="col">
                                                <button class="btn btn-outline-danger" @click="deleteRelationshipPending(r)">Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <span class="text-muted">No pending relationship to process</span>
                            </div>
                        </div>
                        <div class="col-4">
<!--                            selected pending rel-->
                            <div class="card">
                                <div class="card-header text-muted">Confirm addition</div>
                                <div class="card-body">
                                    <div v-if="relationPendingService.relationshipPendingSelected !== null">

                                        <div class="form-row">
                                            <div class="form-group col-md-6">
                                                <label for="fromInput" class="sr-only">From</label>
                                                <div class="input-group mb-2">
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text custom-input-prepend card-prepend">From</div>
                                                    </div>
                                                    <input v-model="fromInput" type="text" class="form-control custom-input" id="fromInput" required>
                                                </div>
                                            </div>
                                            <div class="form-group col-md-6">
                                                <label for="toInput" class="sr-only">To</label>
                                                <div class="input-group mb-2">
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text custom-input-prepend card-prepend">To</div>
                                                    </div>
                                                    <input v-model="toInput" type="text" class="form-control custom-input" id="toInput" required>
                                                </div>
                                            </div>
                                        </div>

                                        <label for="subjectInput" class="sr-only">Subject</label>
                                        <div class="input-group mb-2">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text custom-input-prepend card-prepend">Subject</div>
                                            </div>
                                            <input v-model="relInput.subject" type="text" class="form-control custom-input" id="subjectInput" placeholder="Enter a subject" required>
                                        </div>

                                        <label for="briefInput" class="sr-only">Brief</label>
                                        <div class="input-group mb-2">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text custom-input-prepend card-prepend">Brief</div>
                                            </div>
                                            <textarea v-model="relInput.brief" class="form-control custom-input" id="briefInput" placeholder="Enter a brief" required rows="5"></textarea>
                                        </div>

                                        <div class="input-group mb-2">
                                            <a class="btn btn-outline-primary" style="width: 100%" :href="relInput.articleLink" target="_blank">Read article</a>
                                        </div>

                                        <label for="sectorInput" class="sr-only">Sector</label>
                                        <div class="input-group mb-2">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text custom-input-prepend card-prepend">Sector</div>
                                            </div>
                                            <input v-model="relInput.sector" type="text" class="form-control custom-input" id="sectorInput" placeholder="Enter a sector" required>
                                        </div>

                                        <label for="dateInput" class="sr-only">Date</label>
                                        <div class="input-group mb-2">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text custom-input-prepend card-prepend">Date</div>
                                            </div>
                                            <input v-model="relInput.date" type="date" class="form-control custom-input" id="dateInput" placeholder="Enter a date" required>
                                        </div>

                                        <label for="impactInput" class="sr-only">Impact</label>
                                        <div class="input-group mb-2">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text custom-input-prepend card-prepend">Impact</div>
                                            </div>
                                            <input v-model="relInput.impact" type="range" min="-3" max="3" class="form-control custom-input" id="impactInput" placeholder="Enter an impact" required>
                                        </div>

                                        <div class="input-group mb-2">
                                            <button class="btn btn-outline-success" style="width: 100%" @click="createRelationship">Submit</button>
                                        </div>

                                    </div>
                                    <div v-else>
                                        No rel selected
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
    import relationPending from "@/service/apis/relationPending";
    import countryDetails from "@/service/apis/countryDetails";

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
                relationPendingService: null,
                countryDetailsService: null,

                // dom
                fullscreen: false,
                isLoading: false,

                // charts
                // relations details
                sectorChart: null,
                scoreChart: null,
                initChart: null,

                // country details
                countrySectorChart: null,
                countryScoreChart: null,
                countryInitChart: null,

                perf: 0,

                // input
                countryInput: "FRA",
                regionInput: "",
                countryAInput: "FRA",
                countryBInput: "USA",

                fromInput: "",
                toInput: "",
                relInput: {
                    subject: "",
                    brief: "",
                    articleLink: "",
                    sector: "",
                    date: "",
                    impact: ""
                },


                graphRaw: null,
                graphData: null,

                tabValues: {
                    graphViewer: 'graphViewer',
                    countryDetailsViewer: 'countryDetailsViewer',
                    relationDetailsViewer: 'relationDetailsViewer',
                    relationPendingViewer: 'relationPendingViewer'
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

                            let headers = {"X-Access-Token": self.accessToken};

                            self.graphViewerService = new graphViewer(headers, hostname);

                            self.relationDetailsService = new relationDetails(headers, hostname);

                            self.relationPendingService = new relationPending(headers, hostname);

                            self.countryDetailsService = new countryDetails(headers, hostname);

                                // fixme - testing only
                            self.setTabCountryDetailsViewer()
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

            loadCountriesDetails() {
                let self = this;
                self.isLoading = true;
                this.countryDetailsService.getCountriesDetails(this.countryInput)
                    .then(function() {

                        // update orgs array with graphViewerService
                        self.countryDetailsService.organisations = [];
                        for (let o of self.countryDetailsService.country.organisation_keys) {
                            self.graphViewerService.getOrganisation(o)
                                .then(function(org) {
                                    self.countryDetailsService.organisations.push(org)
                                })
                        }

                        // load charts
                        let sectorCtx = document.getElementById('countrySectorsChart').getContext('2d');
                        let sectorDataset = self.countryDetailsService.getSectorRepartitionDataset();
                        self.countrySectorChart = new Chart(sectorCtx, {
                            type: 'doughnut',
                            data: sectorDataset,
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

                        let scoreCtx = document.getElementById('countryScoreEvolutionChart').getContext('2d');
                        let timeFormat = 'DD/MM/YYYY HH:mm';
                        let scoreDataset = self.countryDetailsService.getImpactHistoryDataset(timeFormat);
                        self.countryScoreChart = new Chart(scoreCtx, {
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

                        let initCtx = document.getElementById('countryInitChart').getContext('2d');
                        let initDataset = self.countryDetailsService.getInitDataset();
                        self.countryInitChart = new Chart(initCtx, {
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

            loadRelationshipPending() {
                this.relationPendingService.getAllRelationPending()
            },

            createRelationship() {
                let self = this;
                this.relationPendingService.createRelationship(this.relInput,
                    this.fromInput, this.toInput)
                    .then(function() {
                        return self.deleteRelationshipPending(self.relationPendingService.relationshipPendingSelected)
                    })
                    .then(function() {
                        self.loadRelationshipPending();
                        self.relationPendingService.relationshipPendingSelected = null;
                    })
            },

            deleteRelationshipPending(r) {
                let self = this;
                this.relationPendingService.deleteRelationshipPending(r.key)
                    .then(function() {
                        self.loadRelationshipPending();
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
            getRelationListDataset() {
                return this.countryDetailsService.relationListDataset;
            },
            setSelectedRelationPending(r) {
                this.relationPendingService.relationshipPendingSelected = r;
                this.relInput.articleLink = r.article_link;
                this.relInput.brief = r.tweet_text;

                let d = new Date(r.date);
                this.relInput.date = d.toISOString().split("T")[0]
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
            setTabCountryDetailsViewer() {
                this.tab = this.tabValues.countryDetailsViewer;
                this.graphViewerService.clearGraph();

                // fixme
                this.loadCountriesDetails()
            },
            setTabRelationDetailsViewer() {
                this.tab = this.tabValues.relationDetailsViewer;
                this.graphViewerService.clearGraph();

                // fixme
                this.loadRelationshipDetails();
            },
            setTabRelationPendingViewer() {
                this.tab = this.tabValues.relationPendingViewer;
                this.graphViewerService.clearGraph();

                // fixme ?
                this.loadRelationshipPending();
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

    .card-placeholder {
        padding: 10px;
        width: 30%;
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

    .card-prepend {
        background-color: black;
        width: 100px;
        border: solid 1px white;
    }
</style>