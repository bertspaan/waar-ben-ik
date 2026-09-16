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
          In {{rounds.length}} rondes zat je er totaal {{formatDistance(sumDistance)}} naast, dat is gemiddeld {{formatDistance(avgDistance)}} per ronde.
        </p>
        <!-- Link naar Observable! -->
        <!-- Zoveel punten! Daag een vriend uit! -->
      </div>

      <button @click="closeClick">Nieuw spel</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, markRaw } from 'vue'
import type { PropType, Raw } from 'vue'
import type { Map } from 'maplibre-gl'
import type { GuessedRound, Round } from '../types'
import { mean, sum } from 'lodash'
import Stars from './Stars.vue'
import { resultGeoJSON, addResultsLayer, createMap, calculatePoints, formatDistance } from '../lib/util'

export default defineComponent({
  emits: ['close'],
  name: 'EndResults',
  components: {
    Stars
  },
  props: {
    rounds: { type: Array as PropType<Round[]>, required: true }
  },
  data (): { map?: Raw<Map> } {
    return { map: undefined }
  },
  mounted: function () {
    const map = createMap(this.$refs.map as HTMLElement)

    const results = this.rounds.filter((round): round is GuessedRound => round.distance !== null)

    const geojson = resultGeoJSON(results)

    addResultsLayer(map, geojson)
    this.map = markRaw(map)
  },
  computed: {
    avgDistance () {
      return mean(this.rounds.map((round) => round.distance))
    },
    sumDistance () {
      return sum(this.rounds.map((round) => round.distance))
    },
    points: function () {
      return sum(this.rounds.map((round) => round.distance !== null ? calculatePoints(round.distance) : 0))
    }
  },
  beforeUnmount () {
    this.map?.remove()
  },
  methods: {
    formatDistance,
    closeClick () {
      this.$emit('close')
    }
  }
})
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
