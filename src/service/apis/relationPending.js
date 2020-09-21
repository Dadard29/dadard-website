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
            relationshipPending: "/relationships/pending",
            relationship: "/relationships"
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

    createRelationship(relInput, from, to) {
        let body  = {
            subject: relInput.subject,
            brief: relInput.brief,
            article_link: relInput.articleLink,
            sector: relInput.sector,
            date: new Date(relInput.date).toISOString(),
            impact: Number(relInput.impact),
        };
        return this.service.post(this.routes.relationship, body, {
            params: {
                from: from,
                to: to,
            },
        })
            .then(function(response) {
                // fixme
                console.log(response.data.Message);
        })
            .catch(function(error) {
                if (error.response) {
                    throw error.response.data.Message
                } else {
                    throw error
                }
            })
    }

    deleteRelationshipPending(key) {
        return this.service.delete(this.routes.relationshipPending, {
            params: {
                key: key,
            }
        })
            .then(function(response) {
                // fixme
                console.log(response.data.Message);
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