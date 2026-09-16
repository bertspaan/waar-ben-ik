import get from './fetch'
import type { Point } from 'geojson'
import type { Panorama, PanoramaResponse } from '../types'

const baseUrl = 'https://api.data.amsterdam.nl/panorama'

function nearestUrl (point: Point, radius: number) {
  const [lon, lat] = point.coordinates
  return `${baseUrl}/panoramas/?near=${lon},${lat}&srid=4326&radius=${radius}&page_size=1`
}

export default function nearestImage (point: Point, radius = 250): Promise<Panorama> {
  return get<PanoramaResponse>(nearestUrl(point, radius))
    .then((nearest) => {
      try {
        const panorama = nearest._embedded.panoramas[0]
        if (!panorama) throw new Error('Empty panorama response')
        return panorama
      } catch (err) {
        throw new Error(`No panorama found within ${radius} meter of ${point.coordinates}!`)
      }
    })
}
