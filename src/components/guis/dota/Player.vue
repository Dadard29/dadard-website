<template>
  <div class="container mt-2 mb-2">
    <div v-if="player !== null">
      <div class="rank">{{player.profile.personaname}} -
        <span v-if="isUp === null" class="spinner-border spinner-border-sm"></span>
        <img class="is-up" v-else-if="isUp === true" src="../../../assets/icons/icons8-send-letter-48.png" alt="up">
        <img class="is-down" v-else-if="isUp === false" src="../../../assets/icons/icons8-send-letter-down-48.png" alt="down">{{player.mmr_estimate.estimate}} -
        {{rank}}
      </div>
    </div>
    <div v-else>
      <span class="spinner-border spinner-border-sm"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Player",
  computed: {
    rank() {
      if (this.player === null) {
        return ""
      }

      let ranks = ["Herald", "Guardian", "Crusader", "Archon", "Legend", "Ancient", "Divine", "Immortal"]
      let rankIndex = Math.floor(this.player.rank_tier / 10) - 1
      let rankSubTier = this.player.rank_tier % 10;
      return `${ranks[rankIndex]} ${'I'.repeat(rankSubTier)}`
    }
  },
  props: {
    player: Object,
    isUp: Boolean
  }
}
</script>

<style scoped>

.rank {
  font-size: 24px;
}

.is-up {

}

.is-down {
  transform: rotate(180deg);
}
</style>