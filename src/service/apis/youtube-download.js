const axios = require('axios').default;

export default class YoutubeDownloadService {
    constructor(headers, host) {
        this.service = axios.create({
            headers: headers,
            baseURL: host
        });

        this.host = host;

        this.routes = {
            videos: "/video",
            videosList: "/video/list",
            download: "/download",
            downloadAll: "/download/all",
            downloadFile: "/download/file"
        }
    }

    getVideoList() {
        return this.service.get(this.routes.videosList)
            .then(function (response) {
                return response.data.Content
            })
            .catch(function(error) {
                if (error.response) {
                    throw error.response.data.Message
                } else {
                    throw error
                }
            })
    }

    addVideo(videoId) {
        return this.service.post(this.routes.videos, {}, {
            params: {
                videoId: videoId
            }
        })
            .then(function(response) {
                return response.data.Content
            })
            .catch(function(error) {
                if (error.response) {
                    throw error.response.data.Message
                } else {
                    throw error
                }
            })
    }

    addPlaylist(playlistId) {
        return this.service.post(this.routes.videosList, {}, {
            params: {
                playlistId: playlistId
            }
        })
            .then(function(response) {
                return response.data.Content
            })
            .catch(function(error) {
                if (error.response) {
                    throw error.response.data.Message
                } else {
                    throw error
                }
            })
    }

    updateAll(title, artist, album, date, videoIdList) {
        return this.service.put(this.routes.videosList, {
            Infos: {
                Title: title,
                Artist: artist,
                Album: album,
                Date: date
            },
            VideoList: videoIdList
        })
            .then(function(response) {
                return response.data.Content
            })
            .catch(function(error) {
                if (error.response) {
                    throw error.response.data.Message
                } else {
                    throw error
                }
            })
    }

    deleteAll(videoIdList) {
        return this.service.delete(this.routes.videosList, {
            data: {
                VideoList: videoIdList
            }
        })
            .then(function(response) {
                return response.data.Content
            })
            .catch(function(error) {
                if (error.response) {
                    throw error.response.data.Message
                } else {
                    throw error
                }
            })
    }

    getStatus() {
        return this.service.get(this.routes.download)
            .then(function(response) {
                return response.data.Content
            })
            .catch(function(error) {
                if (error.response) {
                    throw error.response.data.Message
                } else {
                    throw error
                }
            })
    }

    downloadAll() {
        return this.service.post(this.routes.downloadAll)
            .then(function(response) {
                return response.data.Content
            })
            .catch(function(error) {
                if (error.response) {
                    throw error.response.data.Message
                } else {
                    throw error
                }
            })
    }

    getFileUrl(token) {
        return `${this.host}${this.routes.downloadFile}?token=${token}`
    }

}