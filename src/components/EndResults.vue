<template>
  <div class="modal">
    <div class="box">
      <div class="score">
        <div class="distance">
          {{ avgDistance | formatDistance}}
        </div>
        <div>
          <stars :distanceToImage="avgDistance"></stars>
        </div>
      </div>
      <div class="explain">
        <p>
          In {{rounds.length}} rondes zat je er totaal {{sumDistance | formatDistance}} naast, dat is gemiddeld {{avgDistance | formatDistance}} per ronde.
        </p>

        <p>
            Wil je het nog eens proberen?
        </p>
      </div>
      <button @click="closeClick">Speel nogmaals</button>
    </div>
  </div>
</template>

<script>
import { mean, sum } from 'lodash';
import Stars from './Stars.vue';
import { formatDistance } from '../lib/util.js';

export default {
  name: 'EndResults',
  components : { Stars },
  props: {
    rounds : Array
  },
  computed : {
    avgDistance() {
      return mean(this.rounds);
    },
    sumDistance() {
      return sum(this.rounds);
    }
  },
  methods : {
    closeClick() {
      this.$emit('close');
    }
  },
  filters : {
    formatDistance
  }
}
</script>

<style scoped>
.box {
  width: 900px;
}

.score {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.distance {
  font-size: 2em;
  line-height: 1em;
  font-weight: bold;
}
</style>
