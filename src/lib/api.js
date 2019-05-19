import get from './fetch'

const baseUrl = 'https://api.data.amsterdam.nl/panorama'

function nearestUrl (point, radius) {
  const [lon, lat] = point.coordinates
  return `${baseUrl}/panoramas/?near=${lon},${lat}&srid=4326&radius=${radius}&page_size=1`
}

export default function nearestImage (point, radius = 250) {
  return get(nearestUrl(point, radius))
    .then((nearest) => {
      try {
        const panorama = nearest._embedded.panoramas[0]
        return panorama
      } catch (err) {
        throw new Error(`No panorama found within ${radius} meter of ${point.coordinates}!`)
      }
    })
}
