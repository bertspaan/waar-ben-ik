import { Marker } from 'maplibre-gl'
import type { Coordinates } from '../types'
import markerImage from '../assets/marker.svg'
import flagImage from '../assets/flag.svg'

function createMarker (coordinates: Coordinates, image: string, offset: [number, number], label: string) {
  const element = document.createElement('div')
  element.style.width = '28.25px'
  element.style.height = '37.5px'
  element.style.backgroundImage = `url("${image}")`
  element.style.backgroundSize = 'contain'
  element.style.backgroundRepeat = 'no-repeat'
  element.setAttribute('role', 'img')
  element.setAttribute('aria-label', label)
  return new Marker({ element, anchor: 'bottom', offset })
    .setLngLat(coordinates)
}

export function marker (coordinates: Coordinates) {
  return createMarker(coordinates, markerImage, [0, 0], 'Jouw locatie')
}

export function flag (coordinates: Coordinates) {
  return createMarker(coordinates, flagImage, [11.125, 0], 'Locatie van de foto')
}
