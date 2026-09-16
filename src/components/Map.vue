<template>
  <div class="map" ref="map" />
</template>

<script lang="ts">
import { defineComponent, markRaw } from 'vue'
import type { PropType, Raw } from 'vue'
import type { Map, Marker } from 'maplibre-gl'
import type { Point } from 'geojson'
import { coordinates2D } from '../types'
import type { Panorama } from '../types'
import { createMap } from '../lib/util'
import { marker } from '../lib/markers'

export default defineComponent({
  name: 'GameMap',
  emits: { click: (_point: Point) => true },
  props: {
    image: Object as PropType<Panorama>
  },
  data (): { map?: Raw<Map>; guessMarker?: Raw<Marker> } {
    return { map: undefined, guessMarker: undefined }
  },
  mounted () {
    this.map = markRaw(createMap(this.$refs.map as HTMLElement))
    this.map.on('click', (event) => {
      this.mapClick({
        type: 'Point',
        coordinates: [event.lngLat.lng, event.lngLat.lat]
      })
    })
  },
  beforeUnmount () {
    this.guessMarker?.remove()
    this.map?.remove()
  },
  watch: {
    image () {
      this.guessMarker?.remove()
      this.guessMarker = undefined
    }
  },
  methods: {
    mapClick (point: Point) {
      if (!this.map) return
      this.$emit('click', point)
      if (this.guessMarker) {
        this.guessMarker.setLngLat(coordinates2D(point))
      } else {
        this.guessMarker = markRaw(marker(coordinates2D(point)).addTo(this.map))
      }
    }
  }
})
</script>

<style scoped>
.map {
  width: 100%;
  height: 100%;
}
</style>
