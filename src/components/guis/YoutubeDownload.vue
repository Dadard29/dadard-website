<template>
    <div>
        <div v-if="subscribed == null">
            Loading...
        </div>
        <div v-else-if="subscribed === false" class="container-fluid">
            You did not subscribe to this API.
            Checkout the <router-link to="/catalog/youtube-download">catalog</router-link>
        </div>
        <div v-else class="container-fluid">
            <h3>Youtube Download</h3>
            <div class="row">

                <div class="col">
<!--                    add stuff-->
                    <div class="row">
                        <div class="col-lg">
<!--                        add video-->
                            <h5>Add a video</h5>
                            <p>
                                It will add this video to your list.
                            </p>
                            <div class="form-inline">
                                <div class="form-group mb-2">
                                    <label for="videoUrlInput" class="sr-only">Video URL</label>
                                    <div class="input-group mb-2">
                                        <div class="input-group-prepend">
                                            <div class="input-group-text custom-input-prepend">#</div>
                                        </div>
                                        <input v-model="videoUrlInput" type="text" class="form-control custom-input" id="videoUrlInput" placeholder="Enter a video URL" required>
                                    </div>
                                </div>
                                <div class="input-group mx-sm-3 mb-2">
                                    <button v-on:click="addVideo" class="btn btn-outline-primary">Add video</button>
                                </div>
                            </div>

<!--                        add playlist-->
                            <h5>Add a playlist</h5>
                            <p>
                                It will add all videos in the playlist to your list.
                            </p>
                            <div class="form-inline">
                                <div class="form-group mb-2">
                                    <label for="playlistUrlInput" class="sr-only">Playlist ID</label>
                                    <div class="input-group mb-2">
                                        <div class="input-group-prepend">
                                            <div class="input-group-text custom-input-prepend">#</div>
                                        </div>
                                        <input v-model="playlistUrlInput" type="text" class="form-control custom-input" id="playlistUrlInput" placeholder="Enter a playlist URL" required>
                                    </div>
                                </div>
                                <div class="input-group mx-sm-3 mb-2">
                                    <button v-on:click="addPlaylist" class="btn btn-outline-primary">Add playlist</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-8">
                    <div class="row">
                        <!--                        STATUS-->
                        <div class="col-sm">
                            <div class="card">
                                <div class="card-header text-muted">
                                    Download status
                                </div>
                                <div class="card-body">
                                    <div v-if="status">
                                        <div class="card-text status-message">
                                            {{status.Message}}
                                        </div>
                                        <div class="card-text">
                                            <div class="progress">
                                                <div class="progress-bar progress-bar-striped" id="download-progress-bar" role="progressbar"
                                                     aria-valuemin="0" aria-valuemax="100" :style="{width: status.Progress + '%'}">

                                                </div>
                                            </div>
                                            <small>started at {{new Date(status.DateStarted).toGMTString()}}</small><br>
                                            <small v-if="status.Done">finished at {{new Date(status.DateFinished).toGMTString()}}</small>
                                        </div>
                                        <div class="card-text">
                                            <div v-if="status.Done === false" class="spinner-border text-primary" role="status">
                                                <span class="sr-only">Loading...</span>
                                            </div>
                                            <div v-else>
                                                <button v-on:click="downloadAll" class="btn btn-outline-primary card-link">
                                                    Download all
                                                </button>
                                                <button v-on:click="getFile" class="btn btn-outline-primary card-link">
                                                    Get ZIP file
                                                </button>
                                                <a :href="downloadFileLink" id="download-file-link" download="mp3_files.zip"></a>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else class="text-muted">
                                        No status available
                                    </div>
                                </div>
                            </div>
                        </div>
<!--                        LOGGER-->
                        <div class="col-sm">
                            <Logger :logger-service="logger"></Logger>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <h5>Update infos</h5>
                    <div class="card">
                        <div class="card-header text-muted">
                            Update {{selectedVideos.length}} videos' infos...
                        </div>
                        <div v-if="selectedVideos.length > 0" class="card-body">
                            <label for="titleAllInput" class="sr-only">Title</label>
                            <div class="input-group mb-2">
                                <div class="input-group-prepend">
                                    <div class="input-group-text custom-input-prepend card-prepend">Title</div>
                                </div>
                                <input v-model="titleAllInput" type="text" class="form-control custom-input" id="titleAllInput" placeholder="Enter a title" required>
                            </div>
                            <label for="artistAllInput" class="sr-only">Artist</label>
                            <div class="input-group mb-2">
                                <div class="input-group-prepend">
                                    <div class="input-group-text custom-input-prepend card-prepend">Artist</div>
                                </div>
                                <input v-model="artistAllInput" type="text" class="form-control custom-input" id="artistAllInput" placeholder="Enter an artist" required>
                            </div>
                            <label for="albumAllInput" class="sr-only">Album</label>
                            <div class="input-group mb-2">
                                <div class="input-group-prepend">
                                    <div class="input-group-text custom-input-prepend card-prepend">Album</div>
                                </div>
                                <input v-model="albumAllInput" type="text" class="form-control custom-input" id="albumAllInput" placeholder="Enter an album" required>
                            </div>
                            <label for="dateAllInput" class="sr-only">Date</label>
                            <small class="text-muted">expected format is '2020-03-18'</small>
                            <div class="input-group mb-2">
                                <div class="input-group-prepend">
                                    <div class="input-group-text custom-input-prepend card-prepend">Date</div>
                                </div>
                                <input v-model="dateAllInput" type="text" class="form-control custom-input" id="dateAllInput" placeholder="Enter a date" required>
                            </div>
                            <button class="btn btn-outline-warning" v-on:click="updateAll">Update</button>
                        </div>
                        <div v-else class="card-body">
                            No video selected
                        </div>
                    </div>
                </div>

                <div class="col-8">

                    <div v-if="videoList">
                        <div class="row" style="padding: 5px">
                            <div class="col-">
                                <h5>Videos list</h5>
                            </div>
                            <div class="col-sm">
                                <form class="form-inline">
                                    <div class="form-group">
                                        <button v-on:click="getVideoList" class="btn btn-outline-primary" type="button">
                                            <img src="../../assets/icons/refresh.png" style="height: 16px;"> refresh
                                        </button>
                                    </div>
                                    <div class="form-group">
                                        <div class="btn-group">
                                            <button v-on:click="selectAll" class="btn btn-outline-primary" type="button">Select all</button>
                                            <button v-on:click="deselectAll" class="btn btn-outline-primary" type="button">Deselect all</button>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        {{this.selectedVideos.length}} videos selected
                                    </div>
                                    <div v-if="selectedVideos.length > 0" class="form-group">
                                        <button v-on:click="deleteAll" class="btn btn-outline-danger" type="button">Remove {{selectedVideos.length}}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div style="max-height: 300px; overflow: auto">
                            <table class="table">
                                <thead>
                                <tr>
                                    <th>Select...</th>
                                    <th>Title</th>
                                    <th>Artist</th>
                                    <th>Album</th>
                                    <th>Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="v in videoList" :key="v.VideoId" :id="v.VideoId">
                                    <td>
                                        <div v-on:click="updateSelectedList(v.VideoId)" class="btn-group-toggle" data-toggle="buttons">
                                            <button style="padding: 5px" class="btn btn-primary">
                                                <img width="25px" src="../../assets/icons/update.png">
                                            </button>
                                        </div>
                                    </td>
                                    <td class="video-link"><a :href="`https://youtube.com/watch?v=${v.VideoId}`" target="_blank">{{v.Title}}</a></td>
                                    <td>{{v.Artist}}</td>
                                    <td>{{v.Album}}</td>
                                    <td>{{parseTime(v.Date)}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script>
    import LoggerService from "@/models/logger";
    import Logger from "@/components/logger/Logger";

    const config = require('@/assets/config.json');
    const apiService = require('@/service/apiService').default;
    const ytdlService = require('@/service/apis/youtube-download').default;

    export default {
        name: "YoutubeDownload",
        components: {Logger},
        data() {
            return {
                apiName: "youtube-download",
                apiService: null,
                logger: null,
                accessToken: null,
                subscribed: null,
                videoUrlInput: null,
                playlistUrlInput: null,
                videoList: null,
                titleAllInput: "",
                artistAllInput: "",
                albumAllInput: "",
                dateAllInput: "",
                status: null,
                downloadFileLink: "#",
                selectedVideos: []
            }
        },
        created() {
            this.logger = new LoggerService();

            const jwt = localStorage.getItem(config.jwt.tokenKey);
            this.apiService = new apiService({
                Authorization: jwt
            });
            this.getSub();

            let self = this;
            setTimeout(function() {
                if (self.status.Done === false) {
                    self.updateStatus();
                }
            }, 2000)
        },
        methods: {
            // DOM
            parseTime(s) {
                return new Date(s).toDateString()
            },

            updateSelectedList(videoId) {

                let i = this.selectedVideos.indexOf(videoId);
                if (i > -1) {
                    this.removeVideoFromSelectedList(videoId)
                } else {
                    this.addVideoToSelectedList(videoId)
                }
            },

            addVideoToSelectedList(videoId) {
                let i = this.selectedVideos.indexOf(videoId);
                if (i > -1) {
                    // already in list
                    return
                }

                let row = document.getElementById(videoId);
                this.selectedVideos.push(videoId);
                row.style.backgroundColor = "darkslategray";
            },

            removeVideoFromSelectedList(videoId) {
                let i = this.selectedVideos.indexOf(videoId);
                if (i > -1) {
                    let row = document.getElementById(videoId);
                    this.selectedVideos.splice(i, 1);
                    row.style.backgroundColor = "black";
                }

                // not in list
            },

            selectAll() {
                for (let i = 0; i < this.videoList.length; i++) {
                    this.addVideoToSelectedList(this.videoList[i].VideoId)
                }
            },

            deselectAll() {
                for (let i = 0; i < this.videoList.length; i++) {
                    this.removeVideoFromSelectedList(this.videoList[i].VideoId)
                }
            },

            // API
            getSub() {
                let self = this;
                this.apiService.getSub(this.apiName)
                    .then(function(data) {
                        if (data.Status) {
                            self.subscribed = true;
                            self.logger.debug("sub retrieved");

                            self.accessToken = data.Content.AccessToken;
                            const hostname = data.Content.Api.Hostname;
                            const jwt = localStorage.getItem(config.jwt.tokenKey);
                            self.service = new ytdlService({
                                Authorization: jwt,
                                "X-Access-Token": self.accessToken
                            }, `${config.apiScheme}://${hostname}`);
                            self.getVideoList();
                            self.getStatus();

                        } else {
                            self.subscribed = false;
                        }
                    })
                    .catch(function() {
                        self.subscribed = false
                    })
            },
            getStatus() {
                let self = this;
                this.service.getStatus()
                    .then(function(status) {
                        self.status = status;
                        self.logger.debug(`download status: ${self.status.Message}`);
                    })
                    .catch(function(error) {
                        self.logger.error(error);
                    })
            },
            getVideoList() {
                let self = this;
                this.service.getVideoList()
                    .then(function(videoList) {
                        self.videoList = videoList
                    })
            },
            addVideo() {
                let self = this;
                let u = new URL(this.videoUrlInput);
                let videoId = "";
                if (u.host === "www.youtube.com") {
                    let p = new URLSearchParams(u.search);
                    videoId = p.get("v");
                } else {
                    videoId = u.pathname.slice(1)
                }

                if (!videoId) {
                    self.logger.error("invalid video URL");
                    return
                }

                this.service.addVideo(videoId)
                    .then(function() {
                        self.getVideoList();
                        self.logger.info("video added");
                    })
                    .catch(function(error) {
                        self.logger.error(error)
                    })
            },
            addPlaylist() {
                let self = this;
                let u = new URL(this.playlistUrlInput);
                let p = new URLSearchParams(u.search);
                let playlistId = p.get("list");
                if (!playlistId) {
                    self.logger.error("invalid playlist URL");
                    return
                }

                this.service.addPlaylist(playlistId)
                    .then(function() {
                        self.getVideoList();
                        self.logger.info("playlist added");
                    })
                    .catch(function(error) {
                        self.logger.error(error)
                    })
            },
            updateAll() {
                let self = this;
                this.service.updateAll(
                    this.titleAllInput,
                    this.artistAllInput,
                    this.albumAllInput,
                    this.dateAllInput,
                    this.selectedVideos
                )
                .then(function() {
                    self.getVideoList();
                    self.deselectAll();
                    self.logger.info("list updated");
                })
                .catch(function(error) {
                    self.logger.error(error)
                })
            },
            deleteAll() {
                let self = this;
                this.service.deleteAll(this.selectedVideos)
                    .then(function() {
                        self.getVideoList();
                        self.deselectAll();
                        self.logger.info("all videos removed");
                    })
                    .catch(function(error) {
                        self.logger.error(error);
                    })
            },
            downloadAll() {
                let self = this;
                this.service.downloadAll()
                    .then(function() {
                        self.logger.info("download started");

                        // renew the status
                        self.getStatus();

                        self.updateStatus();
                    })
                    .catch(function(error) {
                        self.logger.error(error)
                    })
            },
            updateStatus() {
                let self = this;
                self.animateProgressBar();

                const updateId = setInterval(function() {
                    if (self.status.Done === true) {
                        clearInterval(updateId);
                        self.stopProgressBar();
                    } else {
                        self.getStatus();
                    }
                }, 2000)
            },
            getFile() {
                let self = this;
                this.service.getFile()
                    .then(function(url) {
                        const link = document.getElementById('download-file-link');
                        link.href = url;
                        link.click();
                    })
                    .catch(function(error) {
                        self.logger.error(error);
                    })
            },
            animateProgressBar() {
                let p = document.getElementById("download-progress-bar");
                p.classList.add("progress-bar-animated")
            },

            stopProgressBar() {
                let p = document.getElementById("download-progress-bar");
                p.classList.remove("progress-bar-animated")
            }
        }
    }
</script>

<style scoped>
    .video-link {
        text-transform: uppercase;
        color: white;
        font-weight: bold;
    }

    .video-link:hover {
        color: grey;
        text-decoration: none;
    }

    .card-text {
        margin: 15px;
        text-align: center;
    }

    .status-message {
        text-transform: uppercase;
        font-size: 24px;
    }

    .form-group {
        margin-right: 5px;
        margin-left: 5px;
    }

    .row {
        padding: 15px;
    }

    .card-prepend {
        background-color: black;
        width: 100px;
    }

</style>