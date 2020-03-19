const axios = require('axios');
const config = require('../assets/config.json');

export default class ApiService {
    constructor(headers) {
        this.service = axios.create({
            baseURL: config.apiHost,
            headers: headers
        });
        this.routes = {
            api: "/api",
            apiList: "/api/list",
            infos: "/infos",
            health: "/health",
            subs: "/subs"
        };
    }

    getApiList() {
        return this.service.get(this.routes.apiList)
            .then(function(response) {
                return response.data.Content
            })
    }

    getApi(apiName) {
        return this.service.get(this.routes.api, {
            params: {
                apiName: apiName
            }
        })
            .then(function(response) {
                return response.data.Content
            })
    }

    getInfos(hostname, isStandard) {
        if (isStandard) {
            return this.service.get(`https://${hostname}${this.routes.infos}`)
                .then(function(response) {
                    return response.data
                })
        } else {
            return new Promise((resolve) => {
                resolve(null)
            })
        }
    }

    getStatus(hostname, isStandard) {
        if (isStandard) {
            return this.service.get(`https://${hostname}${this.routes.health}`)
                .then(function(response) {
                    return response.data.Status
                })
                .catch(function() {
                    return false;
                })
        } else {
            return new Promise((resolve) => {
                resolve(null)
            })
        }
    }

    getSub(apiName) {
        return this.service.get(this.routes.subs, {
            params: {
                apiName: apiName
            }
        })
            .then(function(response) {
                return response.data
            })
            .catch(function() {
                return false
            })
    }

}