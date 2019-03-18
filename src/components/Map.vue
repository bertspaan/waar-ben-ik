<template>
  <div class="container">
    <div class="map" ref="map" />
  </div>
</template>

<script>
export default {
  name: 'Map',
  props: {
    image: Object,
    results: Object
  },
  mounted: function () {
    const element = this.$refs.map
    const map = L.map(element).setView([52.369, 4.922], 12)

    L.tileLayer('https://{s}.data.amsterdam.nl/topo_wm_light/{z}/{x}/{y}.png', {
      subdomains: ['t1', 't2', 't3', 't4'],
      maxZoom: 19
    }).addTo(map)

    const guessLayer =  L.geoJSON().addTo(map)
    const resultsLayer =  L.geoJSON().addTo(map)

    map.on('moveend', (event) => {
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

    this.guessLayer = guessLayer
    this.resultsLayer = resultsLayer

    this.map = map
  },
  watch: {
    image: function () {
      this.resultsLayer.clearLayers()
    },
    results: function (newResults) {
      this.guessLayer.clearLayers()
      this.resultsLayer.addData(newResults)
    }
  },
  methods: {
    mapClick: function (point) {
      this.$emit('mapClicked', point)
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
