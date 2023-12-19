<script setup>

</script>

<template>


  <v-col>
  <v-row>
      <v-carousel >
        <v-carousel-item
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
            cover
        ></v-carousel-item>

        <v-carousel-item
            src="https://cdn.vuetifyjs.com/images/cards/hotel.jpg"
            cover
        ></v-carousel-item>

        <v-carousel-item
            src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
            cover
        ></v-carousel-item>
      </v-carousel>


  </v-row>

    <v-row>
      <div class="pa-2 d-flex">
        <v-row>
          <v-col><h1>Workshop Games</h1></v-col>

          <v-col  ><v-combobox
              style="width: 300px"
              label="Search Game"
              :items="['game1', 'game2', 'game3', 'game4', 'game5', 'game6']"
              variant="outlined"
          ></v-combobox></v-col>
        </v-row>


      </div>
    </v-row>

  </v-col>
</template>

<script>
import * as THREE from 'three';


export default {
  mounted() {

  },
  methods: {

  },
};
</script>

<style scoped>
</style>