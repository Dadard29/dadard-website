<template>
    <div class="container-fluid ribbon">
        <div v-if="retrieved">
            <div class="row align-items-center">
                <div class="col-lg text-left">
                    <a style="padding: 5px" :href="ribbonLinks.githubProfile" target="_blank" ><img src="../assets/github.png" width="32px"></a>
                    <a style="padding: 5px" :href="ribbonLinks.gitlabProfile" target="_blank" ><img src="../assets/gitlab.png" width="32px"></a>
                    <a style="padding: 5px" :href="ribbonLinks.linkedinProfile" target="_blank" ><img src="../assets/linkeding.png" width="32px"></a>            </div>
                <div class="col-lg text-center">
                    Dadard Website - <a v-bind:href="infos.LicenseUrl" target="_blank">{{infos.License}}</a>
                </div>
                <div class="col-lg text-right">
                    <span class="badge badge-light">Website Version {{version}}</span> -
                    <span class="badge badge-light">API Version {{infos.Version}}</span> -
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
    const axios = require('axios').default;
    const config = require('../assets/config.json');

    export default {
        name: "Ribbon",
        data: function () {
            return {
                version: null,
                infos: null,
                apiUrl: `${config.apiHost}/infos`,
                retrieved: false,
                ribbonLinks: config.ribbon
            }
        },
        created: function () {
            this.fetchData()
        },
        methods: {
            fetchData: function () {
                let self = this;
                axios.get(this.apiUrl)
                    .then(function(response) {
                        self.infos = response.data;
                        self.retrieved = true
                    })
                    .catch(function (error) {
                        console.log(error)
                    });

                let mainConfig = require("../../package.json");
                self.version = mainConfig.version
            }
        }
    }

</script>

<style scoped>
    .ribbon {
        position: absolute;
        bottom: 10px;
    }
</style>