<template>
  <div class="modal">
    <div class="box">
      <div class="score">
        <div class="distance">
          {{ displayDistance }}
        </div>
        <div v-if="distanceToImage > 10000" class="emoji">
          😩
        </div>
        <div>
          <ol class="stars">
            <li v-for="point in points" :key="point">
              <template v-if="distanceToImage <= point">
                <img src="../assets/star-white.svg" />
              </template>
              <template v-else>
                <img src="../assets/star-transparent.svg" />
              </template>
            </li>
          </ol>
        </div>
      </div>
      <div class="map" ref="map" />

      <div>
        <!-- <ol>

        </ol> -->
      </div>
      <div><a :href="url">Open deze panorama in data.amsterdam.nl</a>.</div>
      <button @click="closeClick">Volgende foto!</button>

    </div>
  </div>
</template>

<script>
/* global L */

import distance from '@turf/distance'
import { marker, flag } from '../lib/markers'

export default {
  name: 'Results',
  props: {
    image: Object,
    submittedPoint: Object
  },
  data: function () {
    return {
      points: [
        2000,
        1000,
        500,
        100,
        25
      ]
    }
  },
  mounted: function () {
    const element = this.$refs.map
    const map = L.map(element)

    L.tileLayer('https://{s}.data.amsterdam.nl/topo_wm_light/{z}/{x}/{y}.png', {
      subdomains: ['t1', 't2', 't3', 't4'],
      maxZoom: 19
    }).addTo(map)

    const resultsLayer =  L.geoJSON(this.geojson, {
      pointToLayer: function (feature, latLng) {
        if (feature.properties.type === 'submission') {
          return marker(latLng)
        } else {
          return flag(latLng)
        }
      },
      style: function () {
        return {
          color: 'black',
          weight: 4,
          opacity: .7,
          dashArray: '0,10',
          lineJoin: 'round'
        }
      }
    }).addTo(map)

    map.fitBounds(resultsLayer.getBounds(), {
      padding: [2, 2]
    })

    this.resultsLayer = resultsLayer
    this.map = map
  },

  methods: {
    closeClick: function () {
      this.$emit('close')
    }
  },
  computed: {
    distanceToImage: function () {
      return Math.round(distance(this.image.geometry, this.submittedPoint, {
        units: 'meters'
     }))
    },
    displayDistance: function () {
      if (this.distanceToImage < 1000) {
        return `${this.distanceToImage} meter`
      } else if (this.distanceToImage < 10000) {
        return `${Math.round(this.distanceToImage / 10) / 100} km`
      } else {
        return `${Math.round(this.distanceToImage / 100) / 10} km`
      }
    },
    url: function () {
      return `https://data.amsterdam.nl/data/panorama/${this.image.pano_id}/?modus=volledig`
    },
    geojson: function () {
      return {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              type: 'image'
            },
            geometry: this.image.geometry
          },
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                this.image.geometry.coordinates,
                this.submittedPoint.coordinates
              ]
            }
          },
          {
            type: 'Feature',
            properties: {
              type: 'submission'
            },
            geometry: this.submittedPoint
          }
        ]
      }
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

.stars {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 0;
  padding: 0;
}

.distance {
  font-size: 2em;
  line-height: 2em;
  font-weight: bold;
}

.stars img {
  width: 2em;
  padding: 6px;
}

.emoji {
  font-size: 2.2em;
  line-height: 2em;
}
</style>
