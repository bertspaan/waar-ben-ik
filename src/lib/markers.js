/* global L */

import markerImage from '../assets/marker.svg'
import flagImage from '../assets/flag.svg'

const markerSize = [113, 150]
const markerScale = 0.25

const flagSize = [113, 150]
const flagScale = markerScale

export function marker (latLng) {
  const icon = L.icon({
    iconUrl: markerImage,
    popupAnchor: [0, -markerSize[1] * markerScale - 5],
    iconSize: [markerSize[0] * markerScale, markerSize[1] * markerScale],
    iconAnchor: [markerSize[0] * markerScale / 2, markerSize[1] * markerScale]
  })

  return L.marker(latLng, {icon})
}

export function flag (latLng) {
  const icon = L.icon({
    iconUrl: flagImage,
    popupAnchor: [3, -flagSize[1] * flagScale - 5],
    iconSize: [flagSize[0] * flagScale, flagSize[1] * flagScale],
    iconAnchor: [3, flagSize[1] * flagScale]
  })

  return L.marker(latLng, {icon})
}
