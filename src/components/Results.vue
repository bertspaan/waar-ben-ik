<template>
  <div class="modal">
    <div class="box">
      <div class="map" ref="map" />
      <div>Afstand: {{ displayDistance }}!</div>
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
import distance from '@turf/distance'

export default {
  name: 'Results',
  props: {
    image: Object,
    submittedPoint: Object
  },
  data: function () {
    return {
      pointsee: [
        {
          maxDistance: 10
        },
        {
          maxDistance: 25
        },
        {
          maxDistance: 50
        },
        {
          maxDistance: 100
        },
        {
          maxDistance: 250
        },
        {
          maxDistance: 500
        },
        {
          maxDistance: 1000
        }
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

    function createCircleMarker (feature, latlng) {
      const options = {
        radius: 8,
        color: 'black',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9
      }

      return L.circleMarker(latlng, options)
    }

    const resultsLayer =  L.geoJSON(this.geojson, {
      pointToLayer: createCircleMarker,
      style: function (feature) {
        if (feature.properties.type === 'submission') {
          return {
            fillColor: '#23b10f'
          }
        } else {
          return {
            fillColor: 'orange',
            radius: 2,
          }
        }
      }
    }).addTo(map)

    map.fitBounds(resultsLayer.getBounds())

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
</style>
