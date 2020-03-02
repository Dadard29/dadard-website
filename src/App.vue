<template>
  <div id="app">
    <NotConnected msg="home"/>
    <Ribbon></Ribbon>
  </div>
</template>

<script>
import NotConnected from './components/NotConnected.vue'
import Ribbon from "@/components/Ribbon";

export default {
  name: 'DadardWebsite',
  components: {
    Ribbon,
    NotConnected
  }
}
</script>

<style>
  #app {
    font-family: "Lucida Console", monospace;
  }
</style>
