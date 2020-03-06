<template>
    <div class="container-fluid ribbon">
        <div v-if="retrieved">
            <div class="row align-items-end">
                <div class="col-lg text-left">
                    <div class="row align-items-end">
                        <div class="col- text-left">
                            <img src="../assets/eddardStartPortrait.png" style="height: 50px">
                        </div>
                        <div class="col-lg text-left">
                            <footer class="text-muted">
                                <cite title="Eddard Stark quote">"{{getQuote()}}"</cite>
                            </footer>
                        </div>
                    </div>
                </div>
                <div class="col-lg text-center">
                    <div style="padding-bottom: 10px">
                        <a style="padding: 5px" :href="ribbonLinks.githubProfile" target="_blank" ><img src="../assets/icons/github.png" width="32px"></a>
                        <a style="padding: 5px" :href="ribbonLinks.gitlabProfile" target="_blank" ><img src="../assets/icons/gitlab.png" width="32px"></a>
                        <a style="padding: 5px" :href="ribbonLinks.linkedinProfile" target="_blank" ><img src="../assets/icons/linkeding.png" width="32px"></a>
                    </div>
                    <div>
                        Dadard Website - <a v-bind:href="infos.LicenseUrl" target="_blank">{{infos.License}}</a>
                    </div>
                </div>
                <div class="col-lg text-right">
                    Website Version {{version}} -
                    API Version {{infos.Version}} -
                    <a style="padding: 5px" :href="ribbonLinks.reportIssue" target="_blank" >Report an issue</a>
                </div>
            </div>
        </div>
        <div v-else>
            <span style="color: red">API down</span>
        </div>
    </div>
</template>

<script>
    // import Logger from "@/components/logger/Logger.vue";
    import LoggerService from "@/models/logger";
    const axios = require('axios').default;
    const config = require('../assets/config.json');

    export default {
        name: "Ribbon",
        data: function () {
            return {
                logger: null,
                version: null,
                infos: null,
                apiUrl: `${config.apiHost}/infos`,
                retrieved: false,
                ribbonLinks: config.ribbon,
                quotes: config.ribbon.eddardStarkQuotes
            }
        },
        created: function () {
            this.logger = new LoggerService();
            this.fetchData()
        },
        methods: {
            fetchData: function () {
                let self = this;
                axios.get(this.apiUrl)
                    .then(function(response) {
                        self.logger.debug("ribbon infos retrieved");
                        self.infos = response.data;
                        self.retrieved = true
                    })
                    .catch(function (error) {
                        self.logger.error(error);
                    });

                let mainConfig = require("../../package.json");
                self.version = mainConfig.version
            },
            getQuote: function() {
                let quoteIndex = Math.floor(Math.random() * this.quotes.length);
                return this.quotes[quoteIndex];
            }
        }
    }

</script>

<style scoped>
    .ribbon {
        position: fixed;
        bottom: 10px;
    }
</style>