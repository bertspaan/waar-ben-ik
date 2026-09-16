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
      <div v-if="!submittedPoint && !showingSplash && !showEndResults"
        :class="['inset', mapToggled ? 'toggled' : '']">
        <div class="inset-toggle">
          <GameMap :image="image" @click="handleMapClicked" />
          <div class="buttons">
            <button class="skip-image" @click="nextRound()">Weet ik niet</button>
            <button @click="submit" :disabled="lastClickedPoint === undefined">Hier ben ik</button>
          </div>
        </div>
        <div class="buttons show-map">
          <template v-if="mapToggled">
            <button @click="toggle">Terug naar de foto</button>
          </template>
          <template v-else>
            <button @click="toggle">Laat kaart zien</button>
          </template>
        </div>
      </div>
      <div class="game-status" v-if="!showEndResults">
        <div class="rounds">
          <span>Foto {{rounds.length + 1}}/{{nrOfRounds}}</span>
        </div>
        <div class="points">
          <span>{{points}}&nbsp;punten</span>
        </div>
      </div>
    </main>
    <template v-if="showingSplash">
      <Splash @hide="hideSplash" />
    </template>
    <template v-else-if="showEndResults">
      <EndResults :rounds="rounds" @close="newGame" />
    </template>
    <template v-else-if="submittedPoint && image">
      <Results :image="image" :submittedPoint="submittedPoint"
        :buttonText="(rounds.length === nrOfRounds - 1) ? 'Naar eindresultaat' : 'Volgende foto'"
        @close="nextRound" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Point } from 'geojson'
import { coordinates2D } from './types'
import type { Panorama as PanoramaImage, Round, Submission, Triangulation } from './types'

interface GameState {
  showingSplash: boolean
  showEndResults: boolean
  mapToggled: boolean
  image?: PanoramaImage
  submittedPoint?: Point
  randomPoint?: () => Point
  lastClickedPoint?: Point
  nrOfRounds: number
  rounds: Round[]
}
import Splash from './components/Splash.vue'
import Panorama from './components/Panorama.vue'
import GameMap from './components/Map.vue'
import Results from './components/Results.vue'
import EndResults from './components/EndResults.vue'

import { sum } from 'lodash'

import get, { post } from './lib/fetch'
import { calculatePoints } from './lib/util'
import nearestImage from './lib/api'
import RandomPoint from './lib/random-point'

const devMode = import.meta.env.DEV

export default defineComponent({
  name: 'app',
  components: {
    Splash,
    Panorama,
    GameMap,
    Results,
    EndResults
  },
  data: function (): GameState {
    return {
      showingSplash: true,
      showEndResults: false,
      mapToggled: false,
      image: undefined,
      submittedPoint: undefined,
      randomPoint: undefined,
      lastClickedPoint: undefined,
      nrOfRounds: 5,
      rounds: []
    }
  },
  mounted: function () {
    get<Triangulation>('area-triangulation.geojson')
      .then((polygon) => {
        this.randomPoint = RandomPoint(polygon)
      })
      .then(this.newImage)
  },
  computed: {
    points: function () {
      return sum(this.rounds.map((round) => round.distance !== null ? calculatePoints(round.distance) : 0))
    }
  },
  methods: {
    nextRound: function (distanceToImage?: number) {
      if (distanceToImage !== undefined && this.image && this.submittedPoint) {
        this.rounds.push({
          distance: distanceToImage,
          submittedPoint: this.submittedPoint,
          image: this.image
        })
      } else {
        this.rounds.push({ distance: null, image: this.image })
      }

      this.lastClickedPoint = undefined
      this.submittedPoint = undefined

      if (this.rounds.length === this.nrOfRounds) {
        this.mapToggled = false
        this.showEndResults = true
      } else {
        this.newImage()
      }
    },
    newImage: function () {
      this.mapToggled = false
      this.showEndResults = false
      if (this.randomPoint) {
        nearestImage(this.randomPoint())
          .then((image) => {
            this.lastClickedPoint = undefined
            this.submittedPoint = undefined
            this.image = image
        })
      }
    },
    newGame: function () {
      this.rounds = []
      this.mapToggled = false
      this.showEndResults = false
      this.lastClickedPoint = undefined
      this.submittedPoint = undefined

      this.newImage()
    },
    toggle: function () {
      this.mapToggled = !this.mapToggled
    },
    submit: function () {
      if (this.image && this.lastClickedPoint) {
        const submission: Submission = {
          panoramaId: this.image.pano_id,
          pointSubmission: this.lastClickedPoint,
          pointLocation: {
            type: 'Point',
            coordinates: coordinates2D(this.image.geometry)
          }
        }

        if (!devMode) {
          post('https://waar-ben-ik.glitch.me/submissions', submission)
            .catch(() => {
              // console.error(err.message)
            })
        }

        this.submittedPoint = this.lastClickedPoint
      }
    },
    showSplash: function () {
      this.showingSplash = true
    },
    hideSplash: function () {
      this.showingSplash = false
    },
    handleMapClicked: function (point: Point) {
      this.lastClickedPoint = point
    }
  }
})
</script>

<style>
@import './assets/fonts.css';

body {
  position: absolute;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app {
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

button:not(.maplibregl-ctrl button):not(.maplibregl-popup-close-button) {
  cursor: pointer;
  background-color: white;
  color: #ec0000;
  font-weight: bold;
  text-transform: uppercase;
  border-width: 2px;
  border-style: solid;
  border-color: white;
  padding: 1em;
  transition: background-color 0.15s, border-color 0.15s;
  max-width: 200px;
  width: 200px;
  margin: 0 auto;
}

button:not(.maplibregl-ctrl button):not(.maplibregl-popup-close-button):not(:disabled):hover {
  background-color: #ec0000;
  color: white;
}

main {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.panorama {
  width: 100%;
  height: 100%;
}

.panorama, .panorama .marzipano > * {
  cursor: grab;
}

.modal {
  position: absolute;
  z-index: 1001;
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
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 600px;
  max-width: 100%;
  max-height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}

.buttons.show-map {
  display: none;
}

.inset {
  position: absolute;
  z-index: 1000;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  padding: 5px;
  height: 400px;
  width: 400px;
  max-width: calc(100% - 10px);
  max-height: 60%;
}

.inset > * {
  background-color: #ec0000;
  box-sizing: border-box;
  padding: 10px;
  pointer-events: all;
}

.inset-toggle {
  transition: width 0.15s, height 0.15s, padding 0.15s;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.buttons {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
}

.buttons > button:not(:first-child) {
  margin-left: 10px;
}

button.skip-image {
  color: white;
  background-color: #ec0000;
  /* border-color: #ec0000; */
}

button.skip-image:hover {
  border-color: rgba(255, 255, 255, 0.5);
}

button:disabled {
  opacity: 0.5;
  cursor: default;
}

.maplibregl-popup-content {
  color: #222;
  border-radius: 0;
}

.game-status {
  top: 0;
  position: absolute;
  padding: 5px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  /* flex-direction: column; */
  justify-content: flex-end;
}

.game-status > * {
  background-color: #ec0000;
  padding: 5px 10px;
  margin: 5px;
}

.game-status span {
  font-family: 'Source Code Pro', monospace;
  color: white;
  font-weight: bold;
}

@media only screen and (max-width: 768px) {
  header {
    justify-content: center;
  }

  header a {
    margin: 5px 6px;
    width: 80px;
  }

  .modal {
    padding: 0;
  }

  .box {
    height: 100%;
  }

  .buttons.show-map {
    display: flex;
  }

  .inset {
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    padding: 0;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    pointer-events: none;
  }

  .inset-toggle {
    height: 0;
    overflow: hidden;
    padding: 0 10px;
  }

  .toggled .inset-toggle {
    height: 100%;
    padding: 10px;
    padding-bottom: 0;
  }

  .game-status {
    flex-direction: row;
    justify-content: space-between;
  }
}

</style>
