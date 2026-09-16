import { Map, NavigationControl, LngLatBounds, Popup, setWorkerUrl } from 'maplibre-gl'
import { marker, flag } from './markers'
import type { Marker } from 'maplibre-gl'
import type { Point } from 'geojson'
import { coordinates2D } from '../types'
import type { Result, ResultFeature, ResultGeoJSON } from '../types'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'

// Let Vite bundle the worker and its shared modules for development and deployment.
setWorkerUrl(workerUrl)

export function createMap (element: HTMLElement) {
  const map = new Map({
    container: element,
    attributionControl: false,
    style: 'https://tiles.openfreemap.org/styles/positron',
    center: [4.90034, 52.37278],
    // MapLibre uses 512px tiles: one zoom level lower matches Leaflet’s view.
    zoom: 10,
    minZoom: 8,
    maxZoom: 18,
    dragRotate: false,
    pitchWithRotate: false,
    touchPitch: false
  })
  map.touchZoomRotate.disableRotation()
  map.addControl(new NavigationControl({ showCompass: false }), 'top-left')

  // The inset animates its height on mobile, independently of window resize.
  const observer = new ResizeObserver(() => map.resize())
  observer.observe(element)
  map.on('remove', () => observer.disconnect())
  return map
}

export function resultGeoJSON (results: Result[]): ResultGeoJSON {
  return {
    type: 'FeatureCollection',
    features: results.map(resultFeatures).flat()
  }
}

export function resultFeatures (result: Result): ResultFeature[] {
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

function createMapUrl (point: Point) {
  const coordinates = point.coordinates
  return `https://data.amsterdam.nl/data/geozoek/?modus=kaart&legenda=true&locatie=${coordinates[1]}%2C${coordinates[0]}`
}

export function addResultsLayer (map: Map, geojson: ResultGeoJSON) {
  const bounds = new LngLatBounds()
  const markers: Marker[] = []
  for (const feature of geojson.features) {
    if (feature.geometry.type !== 'Point') continue
    const coordinates = coordinates2D(feature.geometry)
    bounds.extend(coordinates)
    const pointMarker = feature.properties.type === 'submission'
      ? marker(coordinates)
      : flag(coordinates)
    const link = document.createElement('a')
    link.href = createMapUrl(feature.geometry)
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.textContent = 'Bekijk deze locatie'
    pointMarker.setPopup(new Popup({ offset: 40 }).setDOMContent(link)).addTo(map)
    markers.push(pointMarker)
  }

  // A game in which every round was skipped has no result bounds.
  if (!bounds.isEmpty()) {
    map.fitBounds(bounds, { padding: 50, maxZoom: 18, duration: 0 })
  }

  const addLines = () => {
    map.addSource('results', { type: 'geojson', data: geojson })
    map.addLayer({
      id: 'result-lines',
      type: 'line',
      source: 'results',
      filter: ['==', ['geometry-type'], 'LineString'],
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': 'black',
        'line-width': 4,
        'line-opacity': 0.7,
        'line-dasharray': [0, 2.5]
      }
    })
  }
  if (map.isStyleLoaded()) addLines()
  else map.once('load', addLines)
  map.on('remove', () => markers.forEach(marker => marker.remove()))
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

export function calculatePoints (distance: number) {
  const p = Math.max(maxDistance - distance, 0) / maxDistance
  return Math.round(Math.pow(p, 2) * (maxPoints / pointSteps)) * pointSteps
}

export function formatDistance (distance: number) {
  if (distance < 1000) {
    return `${distance} meter`
  } else if (distance < 10000) {
    return `${Math.round(distance / 10) / 100} km`
  } else {
    return `${Math.round(distance / 100) / 10} km`
  }
}
