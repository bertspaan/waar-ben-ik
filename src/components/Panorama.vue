<template>
  <div>
    <div class="marzipano" ref="marzipano" />
  </div>
</template>

<script>
import Marzipano from 'marzipano'

export default {
  name: 'Panorama',
  props: {
    image: Object
  },
  mounted: function () {
    const element = this.$refs.marzipano

    var viewerOptions = {
      stageType: null,
      stage: {
        preserveDrawingBuffer: true,
        width: 960
      }
    }

    this.viewer = new Marzipano.Viewer(element, viewerOptions)
  },
  watch: {
    image: function (newImage) {
      this.createScene(newImage)
    }
  },
  methods: {
    createScene (image) {
      const source = Marzipano.ImageUrlSource.fromString(image.cubic_img_pattern, {
        cubeMapPreviewUrl: image._links.cubic_img_preview.href
      })

      const initialView = {
        yaw: Math.random() * 360,
        fov: 90 * Math.PI / 180,
        pitch: 0,
      }

      const viewLimiter = Marzipano.RectilinearView.limit.traditional(12 * 1024, Math.PI / 2)
      const view = new Marzipano.RectilinearView(initialView, viewLimiter)

      const levelPropertiesList = [
        {
          tileSize: 256,
          size: 256,
          fallbackOnly: true
        },
        {
          tileSize: 512,
          size: 512
        },
        {
          tileSize: 512,
          size: 1024
        },
        {
          tileSize: 512,
          size: 2048
        }
      ]

      const scene = this.viewer.createScene({
        source,
        geometry: new Marzipano.CubeGeometry(levelPropertiesList),
        view,
        pinFirstLevel: true
      })

      scene.switchTo({
        transitionDuration: 500
      })
    }
  }
}
</script>

<style scoped>
.marzipano {
  width: 100%;
  height: 100%;
}
</style>
