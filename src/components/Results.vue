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

<script lang="ts">
import { defineComponent, markRaw } from 'vue'
import type { PropType, Raw } from 'vue'
import type { Map } from 'maplibre-gl'
import type { Point } from 'geojson'
import type { Panorama } from '../types'
import Stars from './Stars.vue'
import distance from '@turf/distance'
import { resultGeoJSON, addResultsLayer, calculatePoints, createMap, formatDistance } from '../lib/util'

export default defineComponent({
  components: {
    Stars
  },
  emits: { close: (_distance: number) => true },
  name: 'Results',
  props: {
    buttonText: { type: String, required: true },
    image: { type: Object as PropType<Panorama>, required: true },
    submittedPoint: { type: Object as PropType<Point>, required: true }
  },
  data (): { map?: Raw<Map> } {
    return { map: undefined }
  },
  mounted: function () {
    const map = createMap(this.$refs.map as HTMLElement)

    const geojson = resultGeoJSON([{
      image: this.image,
      submittedPoint: this.submittedPoint
    }])

    addResultsLayer(map, geojson)
    this.map = markRaw(map)
  },
  beforeUnmount () {
    this.map?.remove()
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
})
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
