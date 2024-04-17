<script setup>

import GamemodeCard from "@/components/GamemodeCard.vue";
import {gameModeMethods} from "../../handelers/gameModeHandeler";
</script>

<template>

  <div v-if="!true" class="d-flex justify-center">
    <v-progress-circular color="error" indeterminate :size="49" :width="12"></v-progress-circular>
  </div>

  <div v-if="userData.username">
    <v-col>
      <v-row>
        <h1>Official Game Modes</h1>
        <v-carousel
            height="400"
            show-arrows="hover"
            cycle
            hide-delimiter-background
        >
          <v-carousel-item
              v-for="(slide, i) in gamemodes"
              :key="i"
          >

            <v-sheet
                v-if="slide.Author === 'yohni'"
                :color="colors[i]"
                height="100%"
            >

              <div class="d-flex fill-height justify-center align-center">
                <div class="text-h2">
                  {{ slide.name }}
                </div>
                {{ slide.Author }}
                <div>


                </div>
                <v-btn @click="this.startGame(slide.name)" variant="outlined" class="ml-15">Create Game</v-btn>
              </div>


            </v-sheet>

          </v-carousel-item>
        </v-carousel>


      </v-row>
    </v-col>
    <div class="ma-3 d-flex flex-wrap">
      <h1>Workshop Games</h1>
      <v-spacer></v-spacer>
      <v-combobox
          style="width: 100px"
          label="Search Game Mode"
          :items="this.gamemodeNames"
          variant="outlined"
      ></v-combobox>
    </div>


    <v-card elevation="3" class="pa-2" color="#2F313D">
      <v-row style="height: 300px" class="overflow-x-auto">
        <v-col class="d-inline" v-for="gamemode in gamemodes">
          <gamemode-card
              v-if="gamemode.Author === 'yohni'"
              :game-mode-author="gamemode.Author"
              :game-mode-description="gamemode.description"
              :game-mode-name="gamemode.name"
          />
        </v-col>
      </v-row>
    </v-card>


  </div>

</template>

<script>

import {user} from "../../handelers/UserHandeler"
import axios from "axios";
import router from "@/router";

export default {
  data: () => ({
    userData: false,
    gamemodes: null,
    gamemodeNames: [],
    colors: [
      'indigo',
      'warning',
      'pink darken-2',
      'red lighten-1',
      'deep-purple accent-4',
    ],
    slides: [
      'First',
      'Second',
      'Third',
      'Fourth',
      'Fifth',
    ],
  }),
  async mounted() {
    await user.changeUrlOnLogin();
    this.userData = await user.getUserData();
    await this.fetchAllGamemodes();


  },


  methods: {
    fetchAllGamemodes: function () {
      axios.get('/api/gamemode/fetch-gamemodes')
          .then(async (response) => {
            this.gamemodes = response.data;
            for (let gamemode in this.gamemodes) {
              this.gamemodeNames.push(this.gamemodes[gamemode].name);

            }

          })
          .catch(function (error) {
            console.log(error);
          })
    },

    startGame(gamemodeName)
    {
      router.push("/create-gamemode/"+gamemodeName)
    }

  },
};
</script>

<style scoped>
</style>