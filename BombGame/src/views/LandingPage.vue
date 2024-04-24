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
          <v-carousel-item v-for="(slide, i) in gamemodes" :key="i">

            <v-sheet


                :color="colors[i]"
                height="100%"
            >
              <div>

                <div class="d-flex fill-height justify-center align-center">
                  <div class="justify-center">
                    <v-row class="mt-15" justify="center">
                      <v-col class="text-h3">
                        {{ slide.name }}
                      </v-col>

                      <v-col>
                        <div class="text-h5">By{{ ' ' + slide.Author }}</div>
                      </v-col>


                      <v-btn @click="startGame(slide.name)" variant="outlined" class="ml-15">Create Game</v-btn>
                    </v-row>
                  </div>
                </div>

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
          :items="gamemodeNames"
          variant="outlined"
      ></v-combobox>
    </div>


    <v-card elevation="3" class="pa-2" color="#2F313D">
      <v-row style="height: 500px" class="overflow-x-auto">
        <v-col class="d-inline" v-for="gamemode in gamemodes">

          <gamemode-card
              v-if="gamemode.Author !== 'yohni'"
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
      'indigo',
      'warning',
      'pink darken-2',
      'red lighten-1',
      'indigo',
      'warning',
      'pink darken-2',
      'red lighten-1',

    ],
    slides: [],
  }),
  async mounted() {

    this.userData = await user.getUserData();
    await this.fetchAllGamemodes();


  },


  methods: {
    fetchAllGamemodes: function () {
      axios.get('https://backendbombgane.onrender.com/api/gamemode/fetch-gamemodes')
          .then(async (response) => {
            console.log(response);
            this.gamemodes = response.data;
            for (let gamemode in this.gamemodes) {
              this.gamemodeNames.push(this.gamemodes[gamemode].name);

            }

          })
          .catch(function (error) {
            console.log(error);
          })
    },

    startGame(gamemodeName) {
      router.push("/new-room/" + gamemodeName)
    }

  },
};
</script>

<style scoped>
</style>