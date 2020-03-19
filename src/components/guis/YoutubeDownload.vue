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

<!--                UPDATE LIST-->
                <div class="col-" style="height: 100px">

<!--                    add stuff-->
                    <div class="row sep">
                        <div class="col-lg">
<!--                        add video-->
                            <h5>Add a video</h5>
                            <p>
                                It will add this video to your list.
                            </p>
                            <div class="form-inline">
                                <div class="form-group mb-2">
                                    <label for="videoIdInput" class="sr-only">Video ID</label>
                                    <div class="input-group mb-2">
                                        <div class="input-group-prepend">
                                            <div class="input-group-text custom-input-prepend">#</div>
                                        </div>
                                        <input v-model="videoIdInput" type="text" class="form-control custom-input" id="videoIdInput" placeholder="Enter a video ID" required>
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
                                    <label for="playlistIdInput" class="sr-only">Playlist ID</label>
                                    <div class="input-group mb-2">
                                        <div class="input-group-prepend">
                                            <div class="input-group-text custom-input-prepend">#</div>
                                        </div>
                                        <input v-model="playlistIdInput" type="text" class="form-control custom-input" id="playlistIdInput" placeholder="Enter a playlist ID" required>
                                    </div>
                                </div>
                                <div class="input-group mx-sm-3 mb-2">
                                    <button v-on:click="addPlaylist" class="btn btn-outline-primary">Add playlist</button>
                                </div>
                            </div>
                        </div>
                    </div>

<!--                    update stuff-->
                    <div class="row sep">
                        <div class="col-lg">
                            <h5>Update all videos</h5>
                            <p>
                                It will update all videos in your list
                            </p>
                            <label for="titleAllInput" class="sr-only">Title</label>
                            <div class="input-group mb-2">
                                <div class="input-group-prepend">
                                    <div class="input-group-text custom-input-prepend">%T</div>
                                </div>
                                <input v-model="titleAllInput" type="text" class="form-control custom-input" id="titleAllInput" placeholder="Enter a title" required>
                            </div>
                            <label for="artistAllInput" class="sr-only">Artist</label>
                            <div class="input-group mb-2">
                                <div class="input-group-prepend">
                                    <div class="input-group-text custom-input-prepend">%A</div>
                                </div>
                                <input v-model="artistAllInput" type="text" class="form-control custom-input" id="artistAllInput" placeholder="Enter an artist" required>
                            </div>
                            <label for="albumAllInput" class="sr-only">Album</label>
                            <div class="input-group mb-2">
                                <div class="input-group-prepend">
                                    <div class="input-group-text custom-input-prepend">%a</div>
                                </div>
                                <input v-model="albumAllInput" type="text" class="form-control custom-input" id="albumAllInput" placeholder="Enter an album" required>
                            </div>
                            <label for="dateAllInput" class="sr-only">Date</label>
                            <small class="text-muted">expected format is '2020-03-18'</small>
                            <div class="input-group mb-2">
                                <div class="input-group-prepend">
                                    <div class="input-group-text custom-input-prepend">%d</div>
                                </div>
                                <input v-model="dateAllInput" type="text" class="form-control custom-input" id="dateAllInput" placeholder="Enter a date" required>
                            </div>
                            <button class="btn btn-outline-warning" v-on:click="updateAll">Update all</button>
                        </div>
                    </div>

<!--                    delete stuff-->
                    <div class="row sep-borderless">
                        <div class="col-lg">
                            <h5>Delete all videos</h5>
                            <div class="form-inline">
                                <div class="input-group mb-2">
                                    <button v-on:click="deleteAll" class="btn btn-outline-danger">Remove all</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

<!--                LIST VIDEOS-->
                <div class="col-lg">
                    <div class="row sep-borderless">
                        <div class="col-lg">
        <!--                        LIST-->
                            <div v-if="videoList">
                                <h5>Videos list</h5>
                                <div class="video-list">
                                    <table class="table table-striped">
                                    <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Artist</th>
                                        <th>Album</th>
                                        <th>Date</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="v in videoList" :key="v.VideoId">
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
                    <div class="row sep-borderless">
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
                        <div class="col-sm">
                            <Logger :logger-service="logger"></Logger>
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
                videoIdInput: null,
                playlistIdInput: null,
                videoList: null,
                titleAllInput: "",
                artistAllInput: "",
                albumAllInput: "",
                dateAllInput: "",
                status: null,
                downloadFileLink: "#"
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
            parseTime(s) {
                return new Date(s).toDateString()
            },
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
                            }, `https://${hostname}`);
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
                this.service.addVideo(this.videoIdInput)
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
                this.service.addPlaylist(this.playlistIdInput)
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
                    this.dateAllInput
                )
                .then(function() {
                    self.getVideoList();
                    self.logger.info("list updated");
                })
                .catch(function(error) {
                    self.logger.error(error)
                })
            },
            deleteAll() {
                let self = this;
                this.service.deleteAll()
                    .then(function() {
                        self.getVideoList();
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
    .sep {
        padding: 15px;
        border-bottom: solid 1px white;
    }

    .sep-borderless {
        padding: 15px;
    }

    .video-link {
        text-transform: uppercase;
        color: white;
        font-weight: bold;
    }

    .video-link:hover {
        color: grey;
        text-decoration: none;
    }

    .video-list {
        height: 70%;
        overflow: auto;
        max-height: 415px;
    }

    .card-text {
        margin: 15px;
    }

    .status-message {
        text-transform: uppercase;
    }

</style>