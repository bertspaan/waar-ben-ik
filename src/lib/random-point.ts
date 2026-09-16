import area from '@turf/area'
import type { Point, Position } from 'geojson'
import type { Coordinates, Triangulation } from '../types'

export default function RandomPoint (triangulation: Triangulation): () => Point {
  const areas = triangulation.features
    .map((triangle) => area(triangle))

  const totalArea = areas.reduce((sum, area) => sum + area, 0)

  function scalePoint (point: Position, s: number): Coordinates {
    return [
      point[0] * s,
      point[1] * s
    ]
  }

  function translatePoint (point1: Position, point2: Position): Coordinates {
    return [
      point1[0] + point2[0],
      point1[1] + point2[1]
    ]
  }

  return function () {
    const randomSquareMeter = Math.random() * Math.ceil(totalArea)

    let area = 0
    let index = 0
    while (area < randomSquareMeter) {
      area += areas[index]
      index += 1
    }

    const randomTriangle = triangulation.features[index - 1]

    // Algorithm to compute random point in triangle, see:
    // https://math.stackexchange.com/questions/1785136/generating-randomly-distributed-points-inside-a-given-triangle

    const s = Math.random()
    const t = Math.sqrt(Math.random())

    const p1 = randomTriangle.geometry.coordinates[0][0]
    const p2 = randomTriangle.geometry.coordinates[0][1]
    const p3 = randomTriangle.geometry.coordinates[0][2]

    const randomPoint = translatePoint(
      scalePoint(p1, 1 - t),
      scalePoint(translatePoint(scalePoint(p2, 1 - s), scalePoint(p3, s)), t)
    )

    return {
      type: 'Point',
      coordinates: randomPoint
    }
  }
}
