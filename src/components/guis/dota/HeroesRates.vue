<template>
  <div class="container-fluid">
    <div v-for="hc in heroWinRatesSorted" :key="hc.hero" class="row">
      <div class="col-auto-sm"><img :src="hc.heroIcon" alt="heroIcon"/></div>
      <div class="col-2">{{hc.hero}}</div>
      <div class="col-1">{{hc.totCount}}</div>
      <div class="col-1">{{hc.winCount}}</div>
      <div class="col">
        <div class="progress">
          <div class="progress-bar" :class="{
            'bg-success': hc.rate > 60,
            'bg-warning': hc.rate > 40 && hc.rate < 60,
            'bg-danger': hc.rate < 40
          }" role="progressbar" :style="{width: `${hc.rate}%`}" :aria-valuenow="hc.rate" aria-valuemin="0" aria-valuemax="100">
            {{hc.rate}}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "heroesRates",
  props: {
    heroesWinCount: Array
  },
  computed: {
    heroWinRatesSorted() {
      let totCounts = this.heroesWinCount.slice();
      let compareTotCountDesc = function (a, b) {
        if (a.totCount > b.totCount) {
          return -1;
        } else if (a.totCount < b.totCount) {
          return 1;
        } else {
          return 0
        }
      }
      totCounts.sort(compareTotCountDesc);
      totCounts.forEach(function (r) {
        r.rate = Math.floor((r.winCount / r.totCount) * 100);
      });
      return totCounts;
    }
  }
}
</script>

<style scoped>

</style>