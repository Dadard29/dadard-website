<template>
    <div class="logger-global">
        <small class="text-muted">logger</small>
        <div class="logger">
            <span v-for="msg in loggerService.getLastMessages()" :key="msg.key">
                <span :style="`color: ${msg.color}`">{{msg.date}} {{msg.msg}}</span><br>
            </span>
        </div>
    </div>
</template>

<script>
    import LoggerService from "@/models/logger";

    export default {
        name: "logger",
        props: {
            loggerService: LoggerService
        }
    }
</script>

<style scoped>
    .logger-global {
        padding: 15px;
        margin: 15px;
    }

    .logger {
        padding: 15px;
        border: solid 1px white;
        position: relative;
        background: rgba(0, 0, 0, 0.7);
        z-index: 1;
        width: 100%;
        height: 140px;
        overflow: auto;
    }
</style>