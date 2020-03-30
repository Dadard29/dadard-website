<template>
    <div class="container-fluid">
        <h3 id="generalities">Generalities</h3>
        <p>
            This website gives you access to Web REST APIS, so you can automate stuff.
        </p>
        <p>
            All the source code is published under the <a href="http://wtfpl.net">WTFPL</a> license.
        </p>
        <p>
            The APIs' documentations are published with <a href="https://postman.com">Postman</a>
        </p>
        <h3 id="">Personal data</h3>
        <p>
            I do not sell any data. The source code of my service is all
            <a href="https://github.com/Dadard29" target="_blank">public</a>.
            You can freely check it out.
        </p>
        <h3 id="resources">Resources</h3>
        <p>
            The APIs are written in <a href="https://golang.org">Go</a>.
            I use <a href="https://podman.io">Podman</a> to manage the APIs runtime.
            To build and deploy them, I use <a href="https://gitlab.com">Gitlab</a>.
        </p>
        <p>
            The front is using <a href="https://vuejs.org">VueJS</a> framework for JS part and
            <a href="https://getbootstrap.com">Bootstrap</a> for the HTML/CSS part.
            The icons are from <a href="https://icons8.com">Icons8</a>.
        </p>
    </div>
</template>

<script>
    export default {
        name: "About"
    }
</script>

<style scoped>
    p {
        padding-left: 15px;
    }

</style>