<template>
    <div>
        <div v-if="subscribed == null">
            Loading...
        </div>
        <div v-else-if="subscribed === false" class="container-fluid">
            You did not subscribe to this API.
            Checkout the <router-link to="/catalog/music-researcher">catalog</router-link>
        </div>
        <div v-else class="container-fluid">
            <h3>Music Researcher</h3>
            <div class="container">
<!--                inputs-->
                <div class="row align-items-center" style="padding: 20px">
                    <div class="col" style="text-align: center">
                        <form class="form" @submit="searchFromQuery" id="searchFrom">
                            <div class="form-group">
                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text custom-input-prepend">
                                            <img src="../../assets/icons/search.png" style="height: 20px">
                                        </div>
                                    </div>
                                    <input v-model="queryInput" type="text" class="form-control custom-input"
                                           id="queryInput" placeholder="Search for music..." required>
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-primary" type="submit">Search</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

<!--                headers-->
                <div class="row align-items-center">
                    <div class="col" style="text-align: center">
                        <h5>Youtube results</h5>
                        <hr>
                    </div>
                    <div class="col" style="text-align: center">
                        <h5>Spotify results</h5>
                        <hr>
                    </div>
                </div>

                <div style="position: fixed; right: 20px">
                    <div class="card">
                        <div class="card-header">
                            <img style="width: 32px" src="../../assets/icons/spotify.png">
                            <span class="text-muted">
                                Spotify previewer
                            </span>
                        </div>
                        <div class="card-body">
                            <audio controls id="previewer" src="" ></audio>
                        </div>
                    </div>
                </div>

<!--                results-->
                <div class="row">
<!--                    YOUTUBE-->
                    <div class="col">
                        <div v-if="loadingYoutube" class="spinner-border" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                        <div v-else-if="youtubeResults.length === 0" class="text-muted">
                            No results
                        </div>
                        <div v-else>
                            <div v-for="r in youtubeResults" :key="r.VideoId" :id="r.VideoId"
                                 class="card mb-3" style="max-width: 540px; border: solid 1px white; max-height: 226px">
                                <div class="card-header">
                                    <span class="text-muted">published at {{parseTime(r.PublishedAt)}}</span>
                                </div>
                                <div class="row no-gutters">
                                    <div class="col-md-4">
                                        <a :href="`https://youtube.com/watch?v=${r.VideoId}`" target="_blank">
                                            <img :src="r.VideoThumbnailUrl" class="card-img" alt="video_thumb"
                                                 style="max-height: 135px">
                                        </a>
                                    </div>
                                    <div class="col-md-8">
                                        <div class="card-body">
                                            <h5 class="card-title">{{getVideoTitle(r.VideoTitle)}}</h5>
                                            <p class="card-text">
                                                By <b>{{r.ChannelName}}</b>
                                            </p>
                                            <p v-if="r.ViewsCount > -1" class="card-text">
                                                {{getViewsCount(r.ViewsCount)}} views
                                            </p>
                                            <p v-else class="card-text text-muted">
                                                Views count unavailable
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer">
                                    {{getLongVideoTitle(r.VideoTitle)}}
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--                    SPOTIFY-->
                    <div class="col">
                        <div v-if="loadingSpotify" class="spinner-border" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                        <div v-else-if="spotifyResults.length === 0" class="text-muted">
                            No results
                        </div>
                        <div v-else>
                            <div v-for="r in spotifyResults" :key="r.ID" :id="r.ID"
                                 class="card mb-3" style="max-width: 540px; border: solid 1px white; max-height: 226px">
                                <div class="card-header">
                                    <div @click="playPreview(r.PreviewURL)" v-if="r.PreviewURL != ''"
                                            style="position: absolute; right: 10px; top: 10px">
                                        <img style="width: 32px" src="../../assets/icons/play.png">
                                    </div>
                                    <span class="text-muted">
                                        published at {{parseTime(r.Date)}}
                                    </span>
                                </div>
                                <div class="row no-gutters">
                                    <div class="col-md-4">
                                        <img :src="r.ImageURL" style="width: 135px" class="card-img" alt="video_thumb">
                                    </div>
                                    <div class="col-md-8">
                                        <div class="card-body">
                                            <h5 class="card-title">
                                                {{getVideoTitle(r.Title)}}
                                            </h5>
                                            <p class="card-text">
                                                by <b>{{r.Artist}}</b><br>
                                                in album <b>{{getAlbum(r.Album)}}</b>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer">
                                    <span v-for="g in getGenres(r.Genre)" :key="g" class="badge badge-primary">
                                        {{g}}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import LoggerService from "@/models/logger";
    import musicResearcher from "@/service/apis/music-researcher";

    const config = require('@/assets/config.json');
    const apiService = require('@/service/apiService').default;

    export default {
        name: "MusicResearcher",
        data() {
            return {
                apiService: null,
                service: null,
                apiName: "music-researcher",
                subscribed: null,

                // input
                queryInput: "",

                // dom
                loadingYoutube: false,
                loadingSpotify: false,
                viewer: null,

                // results
                youtubeResults: [],
                spotifyResults: []
            }
        },
        created() {
            this.logger = new LoggerService();

            // const form = document.getElementById("searchFrom");
            // form.addEventListener('submit', )

            const jwt = localStorage.getItem(config.jwt.tokenKey);
            this.apiService = new apiService({
                Authorization: jwt
            });
            this.getSub();
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
                            self.service = new musicResearcher({
                                "X-Access-Token": self.accessToken
                            }, hostname);
                        } else {
                            self.subscribed = false;
                        }
                    })
                    .catch(function(error) {
                        self.logger.error(error);
                        self.subscribed = false;
                    })
            },
            searchFromQuery(e) {
                // prevent for reload page
                e.preventDefault();

                if (this.queryInput === "") {
                    this.logger.error("empty query");
                    return
                }

                this.searchYoutube(this.queryInput);
                this.searchSpotify(this.queryInput);

            },

            searchYoutube(q) {
                let self = this;
                self.loadingYoutube = true;
                this.service.searchYoutube(q)
                    .then(function(results) {
                        self.youtubeResults = results;
                        self.loadingYoutube = false;
                    })
                    .catch(function(error) {
                        self.logger.error(error)
                    })
            },

            searchSpotify(q) {
                let self = this;
                self.loadingSpotify = true;
                this.service.searchSpotify(q)
                    .then(function(results) {
                        self.spotifyResults = results;
                        self.loadingSpotify = false;
                    })
                    .catch(function(error) {
                        self.logger.error(error)
                    })
            },

            // dom
            playPreview(url) {
                if (this.viewer == null) {
                    this.viewer = document.getElementById("previewer");
                }

                this.viewer.src = url;
                this.viewer.play()
            },

            getVideoTitle(title) {
                const maxLen = 18;
                if (title.length > maxLen) {
                    return title.slice(0, maxLen) + "..."
                } else {
                    return title
                }
            },

            getLongVideoTitle(title) {
                const maxLen = 54;
                if (title.length > maxLen) {
                    return title.slice(0, maxLen) + "..."
                } else {
                    return title
                }
            },

            getGenres(genres) {
                const maxLen = 4;
                return genres.slice(0, maxLen);
            },

            getAlbum(album) {
                const maxLen = 23;
                if (album.length > maxLen) {
                    return album.slice(0, maxLen) + "..."
                } else {
                    return album
                }
            },

            getViewsCount(views) {
                let sn = String(views);
                let i = sn.length;
                let suffix = "";
                if (views >= 1000000000) {
                    i = sn.length - 9;
                    suffix = "B"
                } else if (views >= 1000000) {
                    i = sn.length - 6;
                    suffix = "M"
                } else if (views >= 1000) {
                    i = sn.length - 3;
                    suffix = "k"
                }

                return sn.slice(0, i) + suffix
            },

            parseTime(s) {
                return new Date(s).toDateString()
            },
        }
    }
</script>

<style scoped>

    .custom-input {
        background-color: black;
        color: inherit;
        text-align: center;
    }

    .custom-input-prepend {
        border: solid 1px white;
    }

    hr {
        border-top: solid 1px white;
    }

    .badge {
        margin-left: 5px;
        margin-right: 5px;
    }

</style>