<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-auto">
        <div class="row">
          <Player :player="player"
                  :is-up="winRateIsUp"/>
        </div>
        <div class="row">
          <Streak :streak="streak"/>
        </div>
        <div class="row">
          <WinRateCharts v-if="winRate !== null"
                         :win-rate="winRate"/>
        </div>
      </div>
      <div class="col">
        <HeroesRates v-if="heroesWinCount !== null"
                     :heroes-win-count="heroesWinCount"/>
      </div>
    </div>
    <div class="row">
      <Matches ref="matches" class="container-fluid"
               :game-modes="gameModes"
               :lobby-types="lobbyTypes"
               :heroes="heroes"
               :matches="matches"/>
    </div>
  </div>
</template>

<script>
import Mika from "mika";
import Player from "@/components/guis/dota/Player";
import Matches from "@/components/guis/dota/Matches";
import WinRateCharts from "@/components/guis/dota/WinRateCharts";
import Streak from "@/components/guis/dota/Streak";
import HeroesRates from "@/components/guis/dota/HeroesRates";

export default {
  name: "Dashboard",
  components: {HeroesRates, Streak, WinRateCharts, Matches, Player},
  props: {
    accountId: Number,
  },
  computed: {
    winRateIsUp() {
      if (this.winRate === null) {
        return null
      } else return this.winRate >= 0.5;
    },
    winRate() {
      if (this.matches === null) {
        return null
      } else {
        let self = this;
        let winCount = 0;
        let totCount = this.matches.length;
        this.matches.forEach(function(m) {
          if (self.$refs.matches.victory(m)) {
            winCount += 1
          }
        })

        return winCount / totCount
      }
    },
    streak() {
      if (this.matches === null) {
        return null
      } else {
        let self = this;
        let previousIsWin = this.$refs.matches.victory(this.matches[0])
        let streakCount = 0;
        for (let i = 0; i < this.matches.length; i++) {
          let m = this.matches[i]
          let currentIsWin = self.$refs.matches.victory(m)
          if (currentIsWin !== previousIsWin) {
            return {
              count: i,
              isWin: previousIsWin
            }
          }
          previousIsWin = currentIsWin;
          streakCount += 1
        }

        return {
          count: streakCount,
          isWin: previousIsWin
        }
      }
    },
    heroesWinCount() {
      if (this.matches === null) {
        return null
      } else {
        let counts = [];
        let self = this;
        this.matches.forEach(function(m) {
          let hero = self.$refs.matches.hero(m);
          let heroIcon = self.$refs.matches.heroIcon(m);
          let isWin = self.$refs.matches.victory(m);
          let found = false;
          counts.forEach(function(c) {
            if (c.hero === hero) {
              c.totCount += 1;
              if (isWin) {
                c.winCount += 1;
              }
              found = true;
            }
          })

          if (!found) {
            let newHero = {hero, heroIcon, totCount: 1 , winCount: 0};
            if (isWin) {
              newHero.winCount = 1;
            }
            counts.push(newHero)
          }
        })

        return counts;
      }
    }
  },
  data() {
    return {
      openDota: null,

      // dynamic
      player: null,
      matches: null,

      // constants
      heroes: null,
      gameModes: null,
      lobbyTypes: null,

      limit: 150
    }
  },
  mounted() {
    this.openDota = new Mika()
    this.getHeroes()
    this.getGameModes()
    this.getLobbiesType()

    this.getPlayer()
  },
  methods: {
    getHeroes() {
      let self = this;
      this.openDota._requestHandler("GET", "/constants/heroes")
        .then(function(heroes) {
          self.heroes = heroes;
        })
    },

    getGameModes() {
      let self = this;
      this.openDota._requestHandler("GET", "/constants/game_mode")
        .then(function(gameModes) {
          self.gameModes = gameModes
        })
    },

    getLobbiesType() {
      let self = this;
      this.openDota._requestHandler("GET", "/constants/lobby_type")
          .then(function(lobbyTypes) {
            self.lobbyTypes = lobbyTypes
          })
    },

    getPlayer() {
      let self = this;
      this.openDota.getPlayer(this.accountId)
          .then(function(player) {
            self.player = player;
            self.getPlayerMatches()
          })
    },

    getPlayerMatches() {
      let self = this;
      let options = {
        limit: this.limit,
        game_mode: "22",
        lobby_type: "7"
      }
      this.openDota.getPlayerMatches(this.accountId, options)
        .then(function(matches) {
          self.matches = matches;
      })
    }
  }
}
</script>

<style scoped>
</style>