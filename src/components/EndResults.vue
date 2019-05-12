<template>
  <div class="modal">
    <div class="box">
      In de afgelopen {{rounds.length}} rondes zat je er totaal {{sumDistance}} naast, dat is gemiddeld {{avgDistance}} per ronde.

      Wil je het nog eens proberen?

      <button @click="closeClick">Volgende foto</button>
    </div>
  </div>
</template>

<script>
import { mean, sum } from 'lodash';
import { formatDistance } from '../lib/util.js';

export default {
  name: 'EndResults',
  props: {
    rounds : Array
  },
  computed : {
    avgDistance() {
      return formatDistance(mean(this.rounds));
    },
    sumDistance() {
      return formatDistance(sum(this.rounds));
    }
  },
  methods : {
    closeClick() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.box {
  width: 900px;
}
</style>
