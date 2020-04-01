const axios = require('axios');
const config = require('../assets/config.json');

export default class SubService {
    constructor(headers) {
        this.service = axios.create({
            baseURL: config.apiHost,
            headers: headers
        });
        this.routes = {
            subs: "/subs",
            subsList: "/subs/list"
        }
    }

    subscribe(apiName) {
        return this.service.post(this.routes.subs, {}, {
            params: {
                apiName: apiName
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

    unsubscribe(apiName) {
        return this.service.delete(this.routes.subs, {
            params: {
                apiName: apiName
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

    listSubs() {
        return this.service.get(this.routes.subsList)
            .then(function(response) {
                return response.data.Content;
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