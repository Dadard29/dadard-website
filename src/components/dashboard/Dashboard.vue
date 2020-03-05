<template>
    <div>
        <h3>Dashboard</h3>
        <div>

        </div>
    </div>
</template>

<script>
    import LoggerService from "@/models/logger";

    const axios = require('axios').default;
    const config = require("../../assets/config.json");

    export default {
        name: "dashboard",
        data: function() {
            return {
                logger: null,
                service: null,
                apiUrl: config.apiHost,
                subRoute: "/subs",
                subListRoute: "/subs/list"
            }
        },
        created: function() {
            this.logger = new LoggerService();
            let token = localStorage.getItem(config.jwt.tokenKey);
            this.service = axios.create({
                baseURL: this.apiUrl,
                headers: {
                    Authorization: token
                }
            });
            this.fetchSubs();
        },
        methods: {
            fetchSubs() {
                this.logger.info('fetch subs')
                // let self = this;
                // this.service.get(this.subListRoute)
            }
        }
    }
</script>

<style scoped>

</style>