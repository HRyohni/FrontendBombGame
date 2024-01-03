<script setup>

import GamemodeCard from "@/components/GamemodeCard.vue";
</script>

<template>


  <v-col>
    <v-row>
      <v-carousel show-arrows="hover" :cycle="true" hide-delimiter-background>
        <div v-for="x in 3">
          <v-carousel-item
              src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
              cover
          >
            <div class="d-flex flex-wrap ma-3 ">
              <h1 class="ma-3">GameModeName {{ x }}</h1>
              <v-spacer></v-spacer>
              <v-btn variant="outlined" color="primary">Play Now!</v-btn>
            </div>


          </v-carousel-item>
        </div>


      </v-carousel>


    </v-row>
  </v-col>
  <div class="ma-3 d-flex flex-wrap">
    <h1>Workshop Games</h1>
    <v-spacer></v-spacer>
    <v-combobox
        style="width: 100px"
        label="Search Game"
        :items="['game1', 'game2', 'game3', 'game4', 'game5', 'game6']"
        variant="outlined"
    ></v-combobox>
  </div>


  <v-card elevation="3" class="pa-2" color="#2F313D">
    <v-row style="height: 300px" class="overflow-x-auto">
      <v-col class="d-inline" v-for="x in 11">
        <gamemode-card></gamemode-card>
      </v-col>
    </v-row>
  </v-card>

  <v-divider></v-divider>
  <h1 class="pa-5">Official Games</h1>

  <v-card elevation="3" class="pa-2" color="#2F313D">
    <v-row style="height: 300px" class="overflow-x-auto">
      <v-col class="d-inline" v-for="x in 11">
        <gamemode-card></gamemode-card>
      </v-col>
    </v-row>
  </v-card>
  <v-btn color="black" @click="user.updateUserData('new test')">debug</v-btn>
  <p>{{this.userData}}</p>
</template>

<script>

import {user} from "../../handelers/UserHandeler"

export default {
  data: () => ({
    userData: null
  }),
  async mounted() {

    await user.changeUrlOnLogin();
    this.userData =  await user.getUserData()
  },


  methods: {},
};
</script>

<style scoped>
</style>