const axios = require('axios').default;

export default class TodoService {
    constructor(headers, host) {
        this.service = axios.create({
            headers: headers,
            baseURL: host
        });

        this.routes = {
            oneTime: "/one-time/task",
            oneTimeList: "/one-time/task/list",
        };
    }

    oneTimeCreate(task) {
        this.service.post(this.routes.oneTime, task)
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