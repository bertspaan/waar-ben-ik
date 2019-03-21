<template>
  <div class="modal">
    <div class="box">
      <h1>Waar ben ik?</h1>
      <p>
        Dit spel dropt je op een willekeurige plek in Amsterdam. Raad waar je bent! Hoe dichterbij, hoe beter!
      </p>
      <p>Gebaseerd op <a href="https://geoguessr.com/world/play">GeoGuessr</a>, maar dan voor Amsterdam en gemaakt met open source-tools en Amsterdamse open data. Lees meer over deze data op <a href="https://amsterdam.github.io/datablog">het Datablog van data.amsterdam.nl</a>!</p>
      <button @click="start">Start!</button>
      <img class="qrcode" src="../assets/qrcode.svg" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Splash',
  methods: {
    start: function () {
      this.$emit('hide')
    }
  }
}
</script>

<style scoped>
.box p:first-of-type {
  font-weight: bolder;
}

h1 {
  margin-top: 0;
}

.qrcode {
  width: 200px;
}
</style>
