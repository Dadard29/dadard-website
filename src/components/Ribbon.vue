<template>
    <div v-if="retrieved" class="container-fluid ribbon">
        <div class="row align-items-center">
            <div class="col-lg text-left">
                <a style="padding: 5px" :href="githubProfile" target="_blank" ><img src="../assets/github.png" width="32px"></a>
                <a style="padding: 5px" :href="gitlabProfile" target="_blank" ><img src="../assets/gitlab.png" width="32px"></a>
                <a style="padding: 5px" :href="linkedinProfile" target="_blank" ><img src="../assets/linkeding.png" width="32px"></a>            </div>
            <div class="col-lg text-center">
                Dadard Website - <a v-bind:href="infos.LicenseUrl" target="_blank">{{infos.License}}</a>
            </div>
            <div class="col-lg text-right">
                <span class="badge badge-light">API Version {{infos.Version}}</span> -
                <a style="padding: 5px" :href="reportIssue" target="_blank" >Report an issue</a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Ribbon",
        data: function () {
            return {
                infos: null,
                apiUrl: "http://localhost:8081/infos",
                retrieved: false,
                githubProfile: "https://github.com/Dadard29",
                linkedinProfile: "https://www.linkedin.com/in/florian-charpentier/",
                gitlabProfile: "https://gitlab.com/dadard",
                reportIssue: "https://github.com/Dadard29/go-core/issues"
            }
        },
        created: function () {
            this.fetchData()
        },
        methods: {
            fetchData: function () {
                let self = this;
                let xhr = new XMLHttpRequest();
                xhr.open('GET', this.apiUrl);
                xhr.onload = function () {
                    self.infos = JSON.parse(xhr.responseText);
                    self.retrieved = true
                };
                xhr.send();
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