<template>
  <div class="modal">
    <div class="box">
      <div class="score">
        <div class="points">
          Totaal: {{points}}&nbsp;punten
        </div>
        <div>
          <stars :distanceToImage="avgDistance"></stars>
        </div>
      </div>
      <div class="map" ref="map" />
      <div class="explain">
        <p>
          In {{rounds.length}} rondes zat je er totaal {{sumDistance | formatDistance}} naast, dat is gemiddeld {{avgDistance | formatDistance}} per ronde.
        </p>
        <!-- link naar observable! -->
        <!-- zoverel punten! daag een vriend uit! -->
      </div>

      <button @click="closeClick">Nog een keer!</button>
    </div>
  </div>
</template>

<script>
import { mean, sum } from 'lodash'
import Stars from './Stars.vue'
import { resultGeoJSON, addResultsLayer, createMap, calculatePoints, formatDistance } from '../lib/util.js'

export default {
  name: 'EndResults',
  components: {
    Stars
  },
  props: {
    rounds: Array
  },
  mounted: function () {
    const map = createMap(this.$refs.map)

    const results = this.rounds.filter((round) => round.distance !== null)

    const geojson = resultGeoJSON(results)

    this.resultsLayer = addResultsLayer(map, geojson)
    this.map = map
  },
  computed: {
    avgDistance () {
      return mean(this.rounds.map((round) => round.distance))
    },
    sumDistance () {
      return sum(this.rounds.map((round) => round.distance))
    },
    points: function () {
      return sum(this.rounds.map((round) => round.distance ? calculatePoints(round.distance) : 0))
    }
  },
  methods: {
    closeClick () {
      this.$emit('close')
    }
  },
  filters: {
    formatDistance
  }
}
</script>

<style scoped>
.box {
  width: 900px;
}

.score {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.points {
  font-size: 2em;
  line-height: 1em;
  font-weight: bold;
}

.map {
  width: 100%;
  height: 500px;
}

@media only screen and (max-height: 568px) {
  .map {
    height: 400px;
  }
}

@media only screen and (max-width: 768px) {
  .map {
    height: 100%;
  }
}
</style>
