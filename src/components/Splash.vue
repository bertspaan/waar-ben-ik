<template>
  <div class="modal">
    <div class="box">
      <img src="../assets/waar-ben-ik.svg"
          alt="Waar ben ik?"/>
      <h2>
        Je wordt gedropt op een willekeurige plek in Amsterdam.
        Kun je raden waar je bent? Hoe dichterbij, hoe hoger je score.
      </h2>
      <button @click="start">Start</button>
      <p>
        Gebaseerd op <a href="https://geoguessr.com/world/play">GeoGuessr</a>, maar dan voor
        Amsterdam en gemaakt met open source-tools en Amsterdamse open data.
        Lees meer over deze data op het <a href="https://amsterdam.github.io/datablog">Datablog van
        data.amsterdam.nl</a>.
      </p>
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

</style>
