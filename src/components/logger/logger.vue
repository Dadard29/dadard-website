<template>
    <div>
        {{loggerService.messages.length}}
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

</style>