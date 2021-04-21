<template>
  <div>
    <div id="matches" v-if="matches !== null && gameModes !== null && lobbyTypes !== null">
      <div class="row" v-for="match in matches" :key="match.match_id" v-bind:class="{'bg-success': victory(match), 'bg-danger': !victory(match)}">
        <div class="col">{{match.match_id}}</div>
        <div class="col">{{startTime(match)}}</div>
        <div class="col">{{side(match)}}</div>
        <div class="col">{{ hero(match) }}</div>
      </div>
    </div>
    <div v-else>
      <span class="spinner-border spinner-border-sm"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Matches",
  props: {
    gameModes: Object,
    lobbyTypes: Object,
    heroes: Object,
    matches: Array
  },
  data() {
    return {
      sideDire: "Dire",
      sideRadiant: "Radiant",
    }
  },
  methods: {
    gameMode(match) {
      return this.gameModes[match.game_mode].name
    },
    lobbyType(match) {
      return this.lobbyTypes[match.lobby_type].name
    },
    side(match) {
      let slot = match.player_slot;
      if (slot >= 0 && slot <= 4) {
        return this.sideRadiant;
      } else {
        return this.sideDire;
      }
    },
    victory(match) {
      let slot = match.player_slot;
      let radiant_win = match.radiant_win;
      if (slot >= 0 && slot <= 4) {
        return radiant_win
      } else {
        return !radiant_win
      }
    },
    startTime(match) {
      let d = new Date(match.start_time * 1000)
      return d.toDateString()
    },
    hero(match) {
      return this.heroes[match.hero_id].localized_name
    },
    heroImg(match) {
      return `https://api.opendota.com${this.heroes[match.hero_id].img}`
    },
    heroIcon(match) {
      return `https://api.opendota.com${this.heroes[match.hero_id].icon}`
    }
  }
}
</script>

<style scoped>
#matches {
  color: white;
}
</style>