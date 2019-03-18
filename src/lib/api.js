import get from './fetch'

const baseUrl = 'https://api.data.amsterdam.nl/panorama'

function nearestUrl (point) {
  const [lon, lat] = point.coordinates
  return `${baseUrl}/thumbnail/?lat=${lat}&lon=${lon}&width=438&radius=250`
}

function imageUrl (panoramaId) {
  return `${baseUrl}/panoramas/${panoramaId}`
}

export default function nearestImage (point) {
  return get(nearestUrl(point))
    .then((nearest) => {
      // TODO: error when empty!
      return get(imageUrl(nearest.pano_id))
    })
}
