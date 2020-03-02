<template>
  <div class="container-fluid" style="padding: 40px">
    <div class="row">
      <div class="col-lg">
        <Home/>
      </div>
      <div class="col-1">
        <div class="verticalBar"></div>
      </div>
      <div class="col-lg">
        <ConnectionForm/>
      </div>
    </div>
    <div class="row" style="padding: 40px">
      <div class="col-lg text-center">
        <img src="../assets/start_wolf.png" />
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
      msg: String
    },
    components: {
      ConnectionForm,
      Home
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .home {
    position: absolute;

  }

  .connectionForm {
    position: absolute;
    left: 52%;
  }

  .verticalBar {
    border-left: 1px solid white;
    height: 94%;
  }

</style>
