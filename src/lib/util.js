/* global L */

import { marker, flag } from './markers'

export function createMap (element) {
  const map = L.map(element, {
    minZoom: 8,
    maxZoom: 19,
    center: [52.37278, 4.90034],
    zoom: 11
  })

  // const tileUrl = 'https://t{s}.data.amsterdam.nl/topo_wm_light/{z}/{x}/{y}.png'
  // const tileUrl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
  // const tileUrl = 'https://geodata.nationaalgeoregister.nl/tiles/service/wmts?' +
  //   'layer=brtachtergrondkaart&style=default&tilematrixset=EPSG%3A3857&Service=WMTS' +
  //   '&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={z}&TileCol={x}&TileRow={y}'

  const mapboxToken = 'pk.eyJ1IjoiYmVydHNwYWFuIiwiYSI6ImNqdnRlZ2g5NzM1NGw0OXJ0MTh0cWxtcTQifQ.pokO3qHHr-_lHZaJpmY4WQ'
  // const mapboxToken = 'pk.eyJ1IjoiYmVydHNwYWFuIiwiYSI6ImR3dERiQk0ifQ.DLbScmbRohc3Sqv7prfhqw'
  const tileUrl = `https://api.mapbox.com/styles/v1/bertspaan/cjvtebmyb0q071co9dq8qajp0/tiles/256/{z}/{x}/{y}@2x?access_token=${mapboxToken}`

  L.tileLayer(tileUrl, {
    minZoom: 8,
    maxZoom: 19
  }).addTo(map)

  return map
}

export function resultGeoJSON (results) {
  return {
    type: 'FeatureCollection',
    features: results.map(resultFeatures).flat()
  }
}

export function resultFeatures (result) {
  return [{
    type: 'Feature',
    properties: {
      panoramaId: result.image.pano_id
    },
    geometry: result.image.geometry
  },
  {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [
        result.image.geometry.coordinates,
        result.submittedPoint.coordinates
      ]
    }
  },
  {
    type: 'Feature',
    properties: {
      type: 'submission'
    },
    geometry: result.submittedPoint
  }]
}

function createMapUrl (point) {
  const coordinates = point.coordinates
  return `https://data.amsterdam.nl/data/geozoek/?modus=kaart&legenda=true&locatie=${coordinates[1]}%2C${coordinates[0]}`
}

function createPopup (feature, layer) {
  if (feature.properties.type === 'submission' || feature.properties.panoramaId) {
    const mapUrl = createMapUrl(feature.geometry)
    const link = `<a href="${mapUrl}" target="_blank">Bekijk deze locatie</a>`
    layer.bindPopup(link)
  }
}

export function addResultsLayer (map, geojson) {
  const resultsLayer = L.geoJSON(geojson, {
    onEachFeature: createPopup,
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
        opacity: 0.7,
        dashArray: '0,10',
        lineJoin: 'round'
      }
    }
  }).addTo(map)

  map.fitBounds(resultsLayer.getBounds(), {
    padding: [25, 25]
  })

  return resultsLayer
}

export const stars = [
  5000,
  1000,
  500,
  100,
  25
]

const maxDistance = stars[0]
const maxPoints = 1000
const pointSteps = 10

export function calculatePoints (distance) {
  const p = Math.max(maxDistance - distance, 0) / maxDistance
  return Math.round(Math.pow(p, 2) * (maxPoints / pointSteps)) * pointSteps
}

export function formatDistance (distance) {
  if (distance < 1000) {
    return `${distance} meter`
  } else if (distance < 10000) {
    return `${Math.round(distance / 10) / 100} km`
  } else {
    return `${Math.round(distance / 100) / 10} km`
  }
}
