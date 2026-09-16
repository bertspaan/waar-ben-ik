// The subset of Marzipano 0.8's public API used by the panorama component.
// Signatures follow the installed package's src/{Viewer,Scene,views,geometries,sources}.
declare module 'marzipano' {
  interface ViewParameters {
    yaw: number
    pitch: number
    fov: number
    width?: number
    height?: number
  }

  type ViewLimiter = (parameters: ViewParameters) => ViewParameters

  export class RectilinearView {
    constructor(parameters: Partial<ViewParameters>, limiter?: ViewLimiter)
    static limit: {
      traditional(maxResolution: number, maxVFov: number, maxHFov?: number): ViewLimiter
    }
  }

  export class ImageUrlSource {
    static fromString(url: string, options?: { cubeMapPreviewUrl?: string }): ImageUrlSource
  }

  export class CubeGeometry {
    constructor(levels: Array<{ tileSize: number; size: number; fallbackOnly?: boolean }>)
  }

  export class Scene {
    switchTo(options?: { transitionDuration?: number }, done?: () => void): void
  }

  export class Viewer {
    constructor(element: HTMLElement, options?: {
      stageType?: 'webgl' | 'css'
      stage?: { preserveDrawingBuffer?: boolean; width?: number }
    })
    createScene(options: {
      source: ImageUrlSource
      geometry: CubeGeometry
      view: RectilinearView
      pinFirstLevel?: boolean
    }): Scene
    destroy(): void
  }
}
