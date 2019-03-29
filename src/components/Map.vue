<template>
  <div class="map" ref="map" />
</template>

<script>
/* global L */

import { marker } from '../lib/markers'

export default {
  name: 'Map',
  props: {
    image: Object
  },
  mounted: function () {
    const element = this.$refs.map
    const map = L.map(element).setView([52.369, 4.922], 12)

    // const tileUrl = 'https://{s}.data.amsterdam.nl/topo_wm_light/{z}/{x}/{y}.png'
    const tileUrl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'

    L.tileLayer(tileUrl, {
      // subdomains: ['t1', 't2', 't3', 't4'],
      maxZoom: 19
    }).addTo(map)

    const guessLayer =  L.geoJSON(null, {
      pointToLayer: function (feature, latLng) {
        return marker(latLng)
      }
    }).addTo(map)



    map.on('moveend', () => {
      const center = map.getCenter()
      this.$emit('mapMoved', {
        type: 'Point',
        coordinates: [center.lng, center.lat]
      })
    })

    map.on('click', (event) => {
      const point = {
        type: 'Point',
        coordinates: [event.latlng.lng, event.latlng.lat]
      }

      this.mapClick(point)
    })

    map.on('movestart', () => this.$emit('moveStart'))
    map.on('moveend', () => this.$emit('moveEnd'))

    this.guessLayer = guessLayer
    this.map = map
  },
  watch: {
    image: function () {
      this.guessLayer.clearLayers()
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
