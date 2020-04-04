const axios = require('axios').default;

export default class musicResearcher {
    constructor(headers, host) {
        this.service = axios.create({
            headers: headers,
            baseURL: host
        });

        this.host = host;
        this.routes = {
            youtubeSearch: "/search/youtube",
            spotifySearch: "/search/spotify"
        }
    }

    searchYoutube(query) {
        return this.service.get(this.routes.youtubeSearch, {
            params: {
                q: query
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

    searchSpotify(query) {
        return this.service.get(this.routes.spotifySearch, {
            params: {
                q: query
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
}