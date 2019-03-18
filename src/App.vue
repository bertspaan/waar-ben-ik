<template>
  <div id="app">
    <header>
      <h1>Waar ben ik?</h1>
    </header>
    <div class="panes">
      <Panorama :image="image" />
      <Map :image="image" :results="results" @mapClicked="handleMapClicked"/>
    </div>
    <footer>
      <button @click="newImage">Nieuw</button>
      <button @click="submit" v:if :disabled="lastClickedPoint === undefined">Hier!</button>
    </footer>
  </div>
</template>

<script>

import Panorama from './components/Panorama.vue'
import Map from './components/Map.vue'

import distance from '@turf/distance'

import get from './lib/fetch'
import nearestImage from './lib/api'
import RandomPoint from './lib/random-point'

export default {
  name: 'app',
  components: {
    Panorama,
    Map
  },
  data: function () {
    return {
      image: undefined,
      results: 'beer',
      error: undefined,
      randomPoint: undefined,
      lastClickedPoint: undefined
    }
  },
  mounted: function () {
    get('area-triangulation.geojson')
      .then((polygon) => {
        this.randomPoint = RandomPoint(polygon)
      })
      .then(this.newImage)
  },
  methods: {
    newImage: function () {
      this.lastClickedPoint = undefined

      if (this.randomPoint) {
        nearestImage(this.randomPoint())
          .then((image) => {
            this.image = image
        })
      }
    },
    showResults: function () {
      this.results = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: this.image.geometry
          },
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                this.image.geometry.coordinates,
                this.lastClickedPoint.coordinates
              ]
            }
          },
          {
            type: 'Feature',
            properties: {},
            geometry: this.lastClickedPoint
          }
        ]
      }
    },
    submit: function () {
      if (this.image && this.lastClickedPoint) {
        this.showResults()

        const d = Math.round(distance(this.image.geometry, this.lastClickedPoint, {
          units: 'meters'
        }))

        setTimeout(() => {
          alert(`Afstand: ${d} meter`)
          this.newImage()
        }, 500)
      }
    },
    handleMapClicked: function (point) {
      this.lastClickedPoint = point
    }
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;

  width: 100vw;
  height: 100vh;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
}

.panes {
  display: flex;
  flex-direction: row;

  width: 100%;
  height: 100%;
}

.panes > * {
  height: 100%;
  width: 100%;
}
</style>
