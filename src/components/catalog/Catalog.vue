<template>
    <div>
<!--        <div style="padding: 15px">-->
        <div class="container-fluid">
            <h3>Catalog</h3>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-1">
                    <button v-on:click="refresh" class="btn btn-outline-primary widget-button">
                        <img src="../../assets/icons/refresh.png" class="widget-img"> refresh
                    </button>
                </div>
                <div class="col-">
                    <div class="btn-group btn-group-toggle" data-toggle="buttons">
                        <label class="btn btn-outline-primary active" v-on:click="setFilter(0)">
                            <input type="radio" name="filter" id="all" autocomplete="off" checked> all
                        </label>
                        <label class="btn btn-outline-primary" v-on:click="setFilter(1)">
                            <input type="radio" name="filter" id="subs" autocomplete="off" > subscribed
                        </label>
                        <label class="btn btn-outline-primary" v-on:click="setFilter(2)">
                            <input type="radio" name="filter" id="unsubs" autocomplete="off" > not subscribed
                        </label>
                    </div>
                </div>
                <div class="col-1">
                    <div class="btn-group btn-group-toggle" data-toggle="buttons">
                        <label class="btn btn-outline-primary active" v-on:click="switchView(false)">
                            <input type="radio" name="view" id="grid" autocomplete="off" checked>
                            <img src="../../assets/icons/thumbnails.png" class="icon-small" alt="grid-view">
                        </label>
                        <label class="btn btn-outline-primary" v-on:click="switchView(true)">
                            <input type="radio" name="view" id="list" autocomplete="off">
                            <img src="../../assets/icons/list.png" class="icon-small" alt="list-view">
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <div style="padding: 30px">
            <div v-if="listView">
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
            <div v-else>
                <div class="container-fluid">
                    <div class="card-columns">
                        <div class="card" v-for="api in apiList" :key="api.Name">
                            <div class="card-header">
                                <img v-if="api.Status === true" src="../../assets/icons/valid.png" class="icon-small">
                                <img v-if="api.Status === false" src="../../assets/icons/invalid.png" class="icon-small">
                                <img v-if="api.Status === null" src="../../assets/icons/unknown.png" class="icon-small">
                                 -
                                <span class="badge badge-success" v-if="api.IsSubscribed">Subscribed</span>
                                <span class="badge badge-warning" v-else>Not subscribed</span>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title"><img :src="api.IconUrl" class="icon"> {{api.Name}}</h5>
                                <div class="card-text">
                                    <p>
                                        <a :href="api.DocumentationUrl" target="_blank" class="card-link"><img src="../../assets/icons/book.png" class="icon-link"></a>
                                        <a :href="api.VCSUrl" target="_blank" class="card-link"><img src="../../assets/icons/git.png" class="icon-link"></a>
                                        <a :href="api.BuildUrl" target="_blank" class="card-link"><img src="../../assets/icons/build.png" class="icon-link"></a>
                                    </p>
                                    <p>
                                        Created at {{api.CreationDate}}
                                    </p>
                                </div>
                            </div>
                            <div class="card-footer">
                                <small class="text-muted" v-if="api.IsStandard">Standard</small>
                                <small class="text-muted" v-else>Not Standard</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
                filter: 0, // 0: all - 1: subs - 2: not subs
                rawApiList: [],
                logger: null,
                service: null,
                apiUrl: config.apiHost,
                apiRoute: "/api",
                subRoute: "/subs",
                listView: false,
                healthRoute: "/health",
                infosRoute: "/infos"
            }
        },
        computed: {
          apiList: function() {
              if (this.filter === 1) {
                  let l = [];
                  for (let i = 0; i < this.rawApiList.length; i++) {
                      let api = this.rawApiList[i];
                      if (api.IsSubscribed) {
                          l.push(api)
                      }
                  }
                  return l;
              } else if (this.filter === 2) {
                  let l = [];
                  for (let i = 0; i < this.rawApiList.length; i++) {
                      let api = this.rawApiList[i];
                      if (! api.IsSubscribed) {
                          l.push(api)
                      }
                  }
                  return l;
              } else {
                  return this.rawApiList
              }
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
            setFilter: function(value) {
                this.filter = value
            },
            switchView(value) {
                this.listView = value;
            },
            refresh() {
                // interface

                this.rawApiList = [];
                this.fetchApis();
            },
            fetchApis() {
                // interface
                let self = this;
                this.getApiList()
                    .then(function(apiList) {
                        for (let i = 0; i < apiList.length; i++) {
                            let api = apiList[i];

                            // for each api, check sub and status
                            self.checkSub(api.Name)
                                .then(function(checkSubRes) {
                                    api.IsSubscribed = checkSubRes;
                                    return self.checkStatus(api.Hostname, api.IsStandard)
                                })
                                .then(function(status) {
                                    api.Status = status;
                                    return self.getInfos(api.Hostname, api.IsStandard)
                                })
                                .then(function(infos) {
                                    api.Infos = infos;
                                    console.log(api);
                                    self.rawApiList.push(api);
                                })
                                .catch(function(error) {
                                if (error.response) {
                                    self.logger.error(error.response.data.Message);
                                } else {
                                    self.logger.error(error);
                                }
                            });
                        }
                    })
                    .catch(function(error) {
                        if (error.response) {
                            self.logger.error(error.response.data.Message);
                        } else {
                            self.logger.error(error);
                        }
                    })
            },
            checkSub(apiName) {
                return this.service.get(this.subRoute, {
                        params: {
                            apiName: apiName
                        }
                    })
                    .then(function(response) {
                        return response.data.Status;
                    })
            },
            checkStatus(hostname, isStandard) {
                if (isStandard) {
                    return axios.get(`http://${hostname}${this.healthRoute}`)
                        .then(function(response) {
                            return response.data.Status
                        })
                } else {
                    return new Promise((resolve) => {
                        resolve(null)
                    })
                }
            },
            getInfos(hostname, isStandard) {
                if (isStandard) {
                    return axios.get(`http://${hostname}${this.infosRoute}`)
                        .then(function(response) {
                            return response.data
                        })
                } else {
                    return new Promise((resolve) => {
                        resolve(null)
                    })
                }
            },
            getApiList() {
                return this.service.get(this.apiRoute)
                    .then(function(response) {
                        return response.data.Content
                    })
            },
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

    .icon-small {
        height: 16px;
    }

    .widget-img {
        height: 16px;
    }

    .widget-button {
        margin-left: 5px;
        margin-right: 5px;
    }

    .btn {
        padding: 3px 7px;
        /*border-color: white;*/
    }
</style>