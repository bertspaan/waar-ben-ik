<template>
  <div id="app">
    <header>
      <img src="./assets/andreas.svg" />
      <h1>Waar ben ik?</h1>
    </header>
    <Panorama class="panorama" :image="image" />
    <div v-if="!submittedPoint" :class="['inset', mapDragging ? 'dragging' : '']">
      <Map :image="image"
        @click="handleMapClicked"
        @moveStart="handleMapMoveStart"
        @moveEnd="handleMapMoveEnd" />
      <div class="buttons">
        <button class="new-image" @click="newImage">Ik weet ‘t niet…</button>
        <button @click="submit" v:if :disabled="lastClickedPoint === undefined">Hier is ’t!</button>
      </div>
    </div>
    <Splash v-if="showSplash" @hide="hideSplash" />
    <Results v-if="submittedPoint" :image="image" :submittedPoint="submittedPoint" @close="newImage" />
  </div>
</template>

<script>

import Splash from './components/Splash.vue'
import Panorama from './components/Panorama.vue'
import Map from './components/Map.vue'
import Results from './components/Results.vue'

import get from './lib/fetch'
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
      showSplash: true,
      image: undefined,
      submittedPoint: undefined,
      error: undefined,
      randomPoint: undefined,
      lastClickedPoint: undefined,
      mapDragging: false
    }
  },
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
        this.submittedPoint = this.lastClickedPoint
      }
    },
    hideSplash: function () {
      this.showSplash = false
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
body {
  margin: 0;
  padding: 0;

  width: 100vw;
  height: 100vh;

  font-family: 'Open Sans';
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  width: 100%;
  height: 100%;
}

header {
  position: absolute;
  box-sizing: border-box;
  z-index: 999;
  margin: 5px;
  padding: 5px;
  display: flex;
}

header h1 {
  margin: 0;
  font-size: 38px;
  margin-left: 10px;
  line-height: .8em;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.9);
}

header img {
  height: 100px;
}

.panorama {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.modal {
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px;
  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: center;
}

.box {
  background-color: white;
  padding: 1em;
  display: flex;
  flex-direction: column;
  width: 400px;
  max-width: 100%;
  max-height: 100%;
  overflow-y: scroll;
}

.inset {
  position: absolute;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  z-index: 999;
  background-color: white;
  margin: 5px;
  padding: 5px;
  display: flex;
  flex-direction: column;

  height: 350px;
  width: 350px;
  max-width: calc(100% - 10px);
  max-height: 25%;

  transition: width .1s, height .1s;
}

.inset:hover, .inset.dragging {
  height: 400px;
  width: 400px;
  max-height: 40%;
}

.buttons {
  display: flex;
  justify-content: flex-end;
}

button {
  display: inline-block;
  text-align: center;
  text-decoration: none;
  cursor: pointer;

  font-size: 18px;

  margin: 2px 0;
  border: solid 1px transparent;
  border-radius: 2px;
  padding: 0.5em 1em;

  color: #ffffff;
  background-color: #308424;
}

button:hover {
  background-color: #23b10f;
}

button.new-image {
  color: black;
  background-color: white;
  text-decoration: underline;
}

button.new-image:hover {
  background-color: #eee  ;
}

button:disabled {
  opacity: 0.5;
  cursor: default;
}

</style>
