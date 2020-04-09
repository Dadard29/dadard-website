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
            profileConfirm: "/profile/auth/confirm",
            jwt: "/profile/auth/jwt",
            recoverySettings: "/profile/recovery/settings",
            recovery: "/profile/recovery"
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

    sendCode(username, password, confirmationWay, contact) {
        return this.service.post(this.routes.profile, {}, {
            params: {
                confirm_by: confirmationWay,
                contact: contact
            },
            auth: {
                username: username,
                password: password
            }})
            .then(function(response) {
                return response.data
            })
            .catch(function(error) {
                if (error.response) {
                    throw error.response.data.Message;
                } else {
                    throw error;
                }
            })
    }

    confirmCode(username, password, confirmationCode) {
        return this.service.post(this.routes.profileConfirm, {}, {
            params: {
                confirmation_code: confirmationCode
            },
            auth: {
                username: username,
                password: password
            }})
            .then(function(response) {
                return response.data
            })
            .catch(function(error) {
                if (error.response) {
                    throw error.response.data.Message
                } else {
                    throw error
                }
            })
    }

    updateRecoverySettings(username, password, recoverBy, contact) {
        return this.service.put(this.routes.recoverySettings, {}, {
            params: {
                recover_by: recoverBy,
                contact: contact
            },
            auth: {
                username: username,
                password: password
            }
        })
            .then(function(response) {
                return response.data.Message
            })
            .catch(function(error) {
                if (error.response) {
                    throw error.response.data.Message
                } else {
                    throw error
                }
            })
    }

    testRecoverySettings(username, password) {
        return this.service.get(this.routes.recoverySettings, {
            auth: {
                username: username,
                password: password
            }
        })
            .then(function(response) {
                return response.data.Message
            })
            .catch(function(error) {
                if (error.response) {
                    throw error.response.data.Message
                } else {
                    throw error
                }
            })
    }

    deleteRecoverySettings(username, password) {
        return this.service.delete(this.routes.recoverySettings, {
            auth: {
                username: username,
                password: password
            }
        })
            .then(function(response) {
                return response.data.Message
            })
            .catch(function(error) {
                if (error.response) {
                    throw error.response.data.Message
                } else {
                    throw error
                }
            })
    }

    lostPasswordSendCode(username) {
        return this.service.get(this.routes.recovery, {
            params: {
                username: username
            }
        })
            .then(function(response) {
                return response.data.Message
            })
            .catch(function(error) {
                if (error.response) {
                    throw error.response.data.Message
                } else {
                    throw error
                }
            })
    }
    lostPasswordConfirmCode(username, password, code) {
        return this.service.post(this.routes.recovery, {}, {
            auth: {
                username: username,
                password: password
            },
            params: {
                confirmation_code: code
            }
        })
            .then(function(response) {
                return response.data.Message
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