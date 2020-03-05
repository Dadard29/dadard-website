<template>
    <div>
        <h3>Catalog</h3>
        <div>
            <button v-on:click="refresh" class="btn btn-outline-primary widget-button">
                <img src="../../assets/icons/refresh.png" class="widget">refresh
            </button>
            <button v-on:click="refresh" class="btn btn-outline-primary widget-button">
                <img src="../../assets/icons/refresh.png" class="widget">refresh
            </button>
        </div>
        <div style="padding: 30px">
            <table class="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Docs</th>
                        <th>Hostname</th>
                        <th>VCS</th>
                        <th>CI</th>
                        <th>Registry image</th>
                        <th>Created at</th>
                        <th>Subscription</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="api in apiList" :key="api.Name">
                        <td><img :src="api.IconUrl" style="height: 24px" /></td>
                        <td>{{api.Name}}</td>
                        <td><a :href="api.DocumentationUrl" target="_blank"><img src="../../assets/icons/book.png" class="icon-link" alt="Documentation"></a></td>
                        <td>{{api.Hostname}}</td>
                        <td><a :href="api.VCSUrl" target="_blank"><img src="../../assets/icons/git.png" class="icon-link"></a></td>
                        <td><a :href="api.BuildUrl" target="_blank"><img src="../../assets/icons/build.png" class="icon-link"></a></td>
                        <td>{{api.Image}}</td>
                        <td>{{api.CreationDate}}</td>
                        <td><img src="../../assets/icons/invalid.png" class="icon"></td>
                        <td><img src="../../assets/icons/valid.png" class="icon"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import LoggerService from "../../models/logger";

    const config = require('../../assets/config.json');
    const axios = require('axios').default;

    export default {
        name: "Catalog",
        data: function() {
            return {
                rawApiList: null,
                logger: null,
                service: null,
                apiUrl: config.apiHost,
                apiRoute: "/api"
            }
        },
        computed: {
          apiList: function() {
              return this.rawApiList
          }
        },
        created: function() {
            this.logger = new LoggerService();
            const token = localStorage.getItem(config.jwt.tokenKey);
            this.service = axios.create({
                baseURL: this.apiUrl,
                headers: {
                    Authorization: token
                }
            });
            this.fetchApis();
        },
        methods: {
            fetchApis() {
                let self = this;
                this.service.get(this.apiRoute)
                    .then(function(response) {
                        self.rawApiList = response.data.Content
                    })
                    .catch(function(error) {
                        if (error.response) {
                            self.logger.error(error.response.data.Message);
                        } else {
                            self.logger.error(error);
                        }
                })
            },
            refresh() {
                this.rawApiList = null;
                this.fetchApis();
            }
        }
    }
</script>

<style scoped>
    .icon-link {
        height: 32px;
        padding: 1px;
    }

    .icon-link:hover {
        border: solid 1px white;
        border-radius: 16px;
        background-color: grey;
    }

    .icon {
        height: 32px;
    }

    .widget {
        height: 16px;
        padding-right: 10px;
    }

    .widget-button {
        margin-left: 5px;
        margin-right: 5px;
    }

    .btn {
        padding: 3px 7px;
        border-color: white;
    }
</style>