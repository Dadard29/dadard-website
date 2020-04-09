<template>
  <div class="container-fluid not-connected" style="padding: 40px">
    <div class="row">
      <div class="col-lg">
        <Home/>
      </div>
      <div class="col-1">
        <div class="verticalBar"></div>
      </div>
      <div class="col-lg">
          <ConnectionForm @connect="connect"/>
      </div>
    </div>
  </div>
</template>

<script>
  import ConnectionForm from "@/components/connection/ConnectionForm";
  import Home from "@/components/home/Home";

  export default {
    name: 'NotConnected',
    props: {
      connected: Boolean
    },
    components: {
      ConnectionForm,
      Home
    },
    methods: {
      connect: function(value) {
        this.$emit('connect', value)
      }
    }
  }

</script>

<style scoped>
  .verticalBar {
    border-left: 1px solid white;
    height: 94%;
  }

  .not-connected {
    /*background-image: url("../assets/start_wolf.png");*/
    /*background-repeat: no-repeat;*/
    /*background-attachment: fixed;*/
    /*background-position: bottom;*/
    position: absolute;
    height: 100%;
  }


</style>
