<template>
  <div class="map" ref="map" />
</template>

<script>
/* global L */

import { createMap } from '../lib/util'
import { marker } from '../lib/markers'

export default {
  name: 'Map',
  props: {
    image: Object,
    toggled: Boolean
  },
  mounted: function () {
    const map = createMap(this.$refs.map)

    const guessLayer =  L.geoJSON(null, {
      pointToLayer: (feature, latLng) => {
        return marker(latLng)
      }
    }).addTo(map)

    map.on('click', (event) => {
      const point = {
        type: 'Point',
        coordinates: [event.latlng.lng, event.latlng.lat]
      }

      this.mapClick(point)
    })

    this.guessLayer = guessLayer
    this.map = map
  },
  watch: {
    image: function () {
      this.guessLayer.clearLayers()
    },
    toggled: function () {
      if (this.toggled) {
        window.setTimeout(() => {
          this.map.invalidateSize()
        }, 150)
      }
    }
  },
  methods: {
    mapClick: function (point) {
      this.$emit('click', point)
      this.guessLayer.clearLayers()
      this.guessLayer.addData(point)
    }
  }
}
</script>

<style scoped>
.map {
  width: 100%;
  height: 100%;
}
</style>
