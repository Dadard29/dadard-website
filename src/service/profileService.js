const axios = require('axios');
const config = require('../assets/config.json');

export default class ProfileService {
    constructor(headers) {
        this.service = axios.create({
            baseURL: config.apiHost,
            headers: headers
        });
        this.routes = {
            profile: "/profile/auth",
            jwt: "profile/auth/jwt"
        }
    }

    checkJwt(jwt) {
        return this.service.get(this.routes.jwt, {
            headers: {
                Authorization: jwt
            }
        })
            .then(function(response) {
                return response.data.Status === true;
            })
            .catch(function(error) {
                if (error.response) {
                    throw error.response.data.Message;
                } else {
                    throw error;
                }
            });
    }

    getProfile(jwt) {
        return this.service.get(this.routes.profile, {
            headers: {
                Authorization: jwt
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

    changePassword(username, password, newPassword) {
        return this.service.put(this.routes.profile, {
            NewPassword: newPassword
        }, {
            auth: {
                username: username,
                password: password
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

    deleteProfile(username, password) {
        return this.service.delete(this.routes.profile, {
            auth: {
                username: username,
                password: password
            }
        })
            .catch(function(error) {
                if (error.response) {
                    throw error.response.data.Message
                } else {
                    throw error
                }
            })
    }

    getJwt(username, password) {
        return this.service.post(this.routes.jwt, {}, {
            auth: {
                username: username,
                password: password
            }})
            .then(function(response) {
                return response.data.Content;
            })
            .catch(function(error) {
                if (error.response) {
                    throw error.response.data.Message;
                } else {
                    throw error;
                }
            })
    }

    createProfile(username, password) {
        return this.service.post(this.routes.profile, {}, {
            auth: {
                username: username,
                password: password
            }})
            .then(function(response) {
                return response.data.Content
            })
            .catch(function(error) {
                if (error.response) {
                    throw error.response.data.Message;
                } else {
                    throw error;
                }
            })
    }
}