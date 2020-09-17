const axios = require('axios').default;

export default class relationPending {
    constructor(headers, host) {
        this.headers = headers;
        this.host = host;

        this.service = axios.create({
            headers: headers,
            baseURL: host,
        });

        this.routes = {
           relationshipPending: "/relationships/pending"
        };

        this.relationshipPendingList = [];
        this.relationshipPendingSelected = null;
    }

    getAllRelationPending() {
        let self = this;
        return this.service.get(this.routes.relationshipPending)
            .then(function(response) {
                self.relationshipPendingList = response.data.Content;
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