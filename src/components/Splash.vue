<template>
  <div class="modal">
    <div class="box">
      <img src="../assets/waar-ben-ik.svg"
          alt="Waar ben ik?"/>
      <h2>
        Je wordt gedropt op een willekeurige plek in Amsterdam.
        Kun je raden waar je bent? Hoe dichterbij, hoe hoger je score.
      </h2>
      <p>
        Gebruik je muis of je touch screen om rond te kijken, net zoals met Google Street View.
        Klik in de kaart als je weet waar de foto genomen is.
      </p>
      <button @click="start">Start</button>
      <p>
        Geïnspireerd door <a href="https://geoguessr.com/world/play">GeoGuessr</a>, maar dan voor
        Amsterdam en gemaakt met open source-tools en Amsterdamse open data.
        Lees meer over deze data op het <a href="https://amsterdam.github.io/datablog/2019/03/21/360-gradenfotos-van-de-hele-stad/">Datablog van
        data.amsterdam.nl</a>.
      </p>
      <p>
        Gemaakt door <a href="https://bertspaan.nl/">Bert Spaan</a>, ontworpen door <a href="http://luukvandeven.nl/">Luuk van de Ven</a>.
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

h2 {
  margin: 0;
}

</style>
