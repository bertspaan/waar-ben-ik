import type { Feature, FeatureCollection, LineString, Point, Polygon } from 'geojson'

export type Coordinates = [longitude: number, latitude: number]

export interface Panorama {
  pano_id: string
  geometry: Point
  cubic_img_pattern: string
  _links: { cubic_img_preview: { href: string } }
}

export interface PanoramaResponse {
  _embedded: { panoramas: Panorama[] }
}

export interface Result {
  image: Panorama
  submittedPoint: Point
}

export interface GuessedRound extends Result {
  distance: number
}

export interface SkippedRound {
  distance: null
  image?: Panorama
  submittedPoint?: Point
}

export type Round = GuessedRound | SkippedRound
export type Triangulation = FeatureCollection<Polygon>
export type ResultProperties = { panoramaId?: string; type?: 'submission' }
export type ResultFeature = Feature<Point | LineString, ResultProperties>
export type ResultGeoJSON = FeatureCollection<Point | LineString, ResultProperties>

export interface Submission {
  panoramaId: string
  pointSubmission: Point
  pointLocation: Point
}

export function coordinates2D (point: Point): Coordinates {
  return [point.coordinates[0], point.coordinates[1]]
}
