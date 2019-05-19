<template>
  <div class="modal">
    <div class="box">
      <div class="score">
        <div class="text">
          <span class="distance">{{ displayDistance }}</span>: {{ points }}&nbsp;punten
        </div>
        <div>
          <stars :distanceToImage="distanceToImage"></stars>
        </div>
      </div>
      <div class="map" ref="map" />
      <button @click="closeClick">{{buttonText}}</button>
    </div>
  </div>
</template>

<script>
import Stars from './Stars.vue'
import distance from '@turf/distance'
import { resultGeoJSON, addResultsLayer, calculatePoints, createMap, formatDistance } from '../lib/util.js'

export default {
  components: {
    Stars
  },
  name: 'Results',
  props: {
    buttonText: String,
    image: Object,
    submittedPoint: Object
  },
  mounted: function () {
    const map = createMap(this.$refs.map)

    const geojson = resultGeoJSON([{
      image: this.image,
      submittedPoint: this.submittedPoint
    }])

    this.resultsLayer = addResultsLayer(map, geojson)
    this.map = map
  },
  methods: {
    closeClick: function () {
      this.$emit('close', this.distanceToImage)
    }
  },
  computed: {
    distanceToImage: function () {
      return Math.round(distance(this.image.geometry, this.submittedPoint, {
        units: 'meters'
     }))
    },
    points: function () {
      return calculatePoints(this.distanceToImage)
    },
    displayDistance: function () {
      return formatDistance(this.distanceToImage)
    }
  }
}
</script>

<style scoped>
.box {
  width: 900px;
}

.map {
  width: 100%;
  height: 500px;
}

.score {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.score, .map {
  margin-bottom: 12px;
}

.score .text {
  font-size: 2em;
  line-height: 1em;
}

.score .text .distance {
  font-weight: bold;
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
