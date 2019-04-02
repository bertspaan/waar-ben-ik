<template>
  <div id="app">
    <header>
      <a href="#" @click="showSplash">
        <img src="./assets/waar-ben-ik.svg"
          alt="Waar ben ik?"/>
      </a>
    </header>
    <main>
      <Panorama class="panorama" :image="image" />
      <div v-if="!submittedPoint" :class="['inset', mapDragging ? 'dragging' : '']">
        <Map :image="image"
          @click="handleMapClicked"
          @moveStart="handleMapMoveStart"
          @moveEnd="handleMapMoveEnd" />
        <div class="buttons">
          <button class="new-image" @click="newImage">Weet ik niet</button>
          <button @click="submit" v:if :disabled="lastClickedPoint === undefined">Hier ben ik</button>
        </div>
      </div>
    </main>
    <template v-if="showingSplash">
      <Splash @hide="hideSplash" />
    </template>
    <template v-else-if="submittedPoint">
      <Results :image="image" :submittedPoint="submittedPoint" @close="newImage" />
    </template>
  </div>
</template>

<script>
import Splash from './components/Splash.vue'
import Panorama from './components/Panorama.vue'
import Map from './components/Map.vue'
import Results from './components/Results.vue'

import get from './lib/fetch'
import { post } from './lib/fetch'
import nearestImage from './lib/api'
import RandomPoint from './lib/random-point'

export default {
  name: 'app',
  components: {
    Splash,
    Panorama,
    Map,
    Results
  },
  data: function () {
    return {
      showingSplash: true,
      image: undefined,
      submittedPoint: undefined,
      error: undefined,
      randomPoint: undefined,
      lastClickedPoint: undefined,
      mapDragging: false
    }
  },

// if ('ontouchstart' in window) {


  mounted: function () {
    get('area-triangulation.geojson')
      .then((polygon) => {
        this.randomPoint = RandomPoint(polygon)
      })
      .then(this.newImage)
  },
  methods: {
    newImage: function () {
      if (this.randomPoint) {
        nearestImage(this.randomPoint())
          .then((image) => {
            this.lastClickedPoint = undefined
            this.submittedPoint = undefined
            this.image = image
        })
      }
    },
    submit: function () {
      if (this.image && this.lastClickedPoint) {
        const submission = {
          panoramaId: this.image.pano_id,
          pointSubmission: this.lastClickedPoint,
          pointLocation: {
            type: 'Point',
            coordinates: this.image.geometry.coordinates.slice(0, 2)
          }
        }

        post('https://waar-ben-ik.glitch.me/submissions', submission)
          .catch(() => {
            // console.error(err.message)
          })

        this.submittedPoint = this.lastClickedPoint
      }
    },
    showSplash: function () {
      this.showingSplash = true
    },
    hideSplash: function () {
      this.showingSplash = false
    },
    handleMapClicked: function (point) {
      this.lastClickedPoint = point
    },
    handleMapMoveStart: function () {
      this.mapDragging = true
    },
    handleMapMoveEnd: function () {
      this.mapDragging = false
    }
  }
}
</script>

<style>
@import './assets/fonts.css';

body {
  position: absolute;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: 'SourceCode';
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
}

header {
  pointer-events: none;
  z-index: 999;

  position: absolute;
  display: flex;
  justify-content: flex-start;
  width: 100%;
}

header a {
  pointer-events: all;
  width: 130px;
  margin: 18px 12px;
}

p a, p a:visited {
  color: white;
  font-weight: bold;
}

.modal > div {
  background-color: #ec0000;
  color: white;
  text-align: center;
}

.modal > div img {
  width: 200px;
  margin: 0 auto;
}

button {
  cursor: pointer;
  background-color: white;
  color: #ec0000;
  font-weight: black;
  text-transform: uppercase;
  border-width: 2px;
  border-style: solid;
  border-color: white;
  padding: 1em;
  transition: background-color .2s;
  max-width: 200px;
  width: 200px;
  margin: 0 auto;
}

button:not(disabled):hover {
  background-color: #ec0000;
  color: white;
}

main {
  display: flex;
  flex-direction: column;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.panorama {
  flex-basis: 100%;
}

.modal {
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 10px;
  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: center;
}

.box {
  padding: 12px;
  display: flex;
  flex-direction: column;
  width: 600px;
  max-width: 100%;
  max-height: 100%;
  overflow-y: auto;
}

.inset {
  background-color: #ec0000;
  position: absolute;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  z-index: 999;
  margin: 5px;
  padding: 12px;
  display: flex;
  flex-direction: column;

  height: 400px;
  width: 400px;
  max-width: calc(100% - 10px);
  max-height: 45%;

  transition: width .1s, height .1s;
}

.inset:hover, .inset.dragging {
  /* height: 400px; */
  /* width: 400px; */
  /* max-height: 40%; */
}

.buttons {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
}


button.new-image {
  color: white;
  background-color: #ec0000;
  border: none;

}



button:disabled {
  opacity: 0.5;
  cursor: default;
}



.leaflet-popup-content-wrapper {
  font-family: 'SourceCode';
  font-size: 18px;
  border-radius: 0;
}



@media only screen and (max-width: 768px) {
  header {
    justify-content: center;
  }

  header a {
    margin: 9px 6px;
    width: 80px;
  }

  .inset {

    right: auto;
    bottom: auto;
    position: static;
    max-width: 100%;
    width: 100%;

    margin: 0;
    height: 80%;

  }
}

</style>
