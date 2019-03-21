<template>
  <div class="map" ref="map" />
</template>

<script>
/* global L */

export default {
  name: 'Map',
  props: {
    image: Object
  },
  mounted: function () {
    const element = this.$refs.map
    const map = L.map(element).setView([52.369, 4.922], 12)

    L.tileLayer('https://{s}.data.amsterdam.nl/topo_wm_light/{z}/{x}/{y}.png', {
      subdomains: ['t1', 't2', 't3', 't4'],
      maxZoom: 19
    }).addTo(map)

    const guessLayer =  L.geoJSON().addTo(map)

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
