export function formatDistance(distance) {
  if (distance < 1000) {
    return `${distance} meter`
  } else if (distance < 10000) {
    return `${Math.round(distance / 10) / 100} km`
  } else {
    return `${Math.round(distance / 100) / 10} km`
  }
}