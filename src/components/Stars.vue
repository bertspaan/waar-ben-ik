<template>
  <ol class="stars">
    <li v-for="point in points" :key="point">
      <template v-if="distanceToImage <= point">
        <img src="../assets/star-white.svg" />
      </template>
      <template v-else>
        <img src="../assets/star-transparent.svg" />
      </template>
    </li>
  </ol>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { stars } from '../lib/util'

export default defineComponent({
  data() {
    return {
      points: stars
    }
  },
  props: {
    distanceToImage: { type: Number, required: true }
  }
})
</script>

<style scoped>
.stars {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 0;
  padding: 0;
}

.stars img {
  width: 2em;
  padding: 0 6px;
}
</style>