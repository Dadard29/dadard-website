<template>
    <div>
        <div v-if="subscribed == null">
            Loading...
        </div>
        <div v-else-if="subscribed === false">
            You did not subscribe to this API.
            Checkout the <router-link to="/catalog/geopolitics">catalog</router-link>
        </div>
        <div v-else>
            salut
            <div id="panel" class="container" style="width: 20%">
                <form @submit="loadRelationshipsForm">
                    <div class="input-group mb-2">
                        <input v-model="countryInput" class="form-control custom-input">
                        <div class="input-group-append">
                            <button class="btn btn-primary">Load relationships</button>
                        </div>
                    </div>
                </form>
            </div>
            <div id="graphNode" class="container">

            </div>
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
                            self.loadRelationships()
                        } else {
                            self.subscribed = false;
                        }
                    })
                    .catch(function(error) {
                        self.logger.error(error);
                        self.subscribed = false;
                    })
            },

            loadRelationshipsForm(e) {
                // prevent for reload page
                e.preventDefault();
                this.loadRelationships();

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
            }
        }
    }
</script>

<style scoped>

</style>