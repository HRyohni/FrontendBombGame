<script setup>
import io from 'socket.io-client';

</script>

<template>
  <v-container fluid="true">
    <v-row class="d-flex justify-center">
      <!--for desktop-->
      <v-col cols="12" class="d-lg-none">
        <v-card color="#53566B" width="100%" elevation="4" class="pa-5">
          <div class="pa-4 d-flex justify-center">
            <h3>CREATE GAMEMODE</h3>
          </div>
          <hr>

          <div class="pa-3">

            <v-expansion-panels class="mb-3">
              <v-expansion-panel color="#21232B" title="Gamemode name"
                                 text="Name your room so other players can find it."></v-expansion-panel>
            </v-expansion-panels>
            <v-text-field variant="outlined" hint="write" v-model="this.GamemodeName"></v-text-field>


            <v-expansion-panels class="mb-3">
              <v-expansion-panel color="#21232B" title="Game Modes" text="Pick Game Mode to play."></v-expansion-panel>
            </v-expansion-panels>
            <v-text-field variant="outlined" hint="what gamemode you want to play"
                          v-model="this.gameModeDescription"></v-text-field>

            <v-expansion-panels class="mb-3">
              <v-expansion-panel color="#21232B" title="Words"
                                 text="place words with spaces in between "></v-expansion-panel>
            </v-expansion-panels>

            <v-text-field variant="outlined" hint="Example colors: red yellow green white black "
                          v-model="this.words"></v-text-field>


          </div>

          <div class="d-flex justify-space-between">
            <v-btn @click="this.CancelCreatingRoom()" class="ma-2" color="red">Cancel</v-btn>
            <v-btn class="ma-2" color="blue" @click="this.createGamemode()">Create</v-btn>
          </div>
        </v-card>
      </v-col>

      <!--for phone-->
      <v-col cols="12" lg="49" xl="4" class="d-none d-lg-flex justify-center">
        <v-card color="#53566B" width="90%" elevation="4" class="pa-5">
          <div class="pa-4 d-flex justify-center">
            <h3>CREATE GAMEMODE</h3>
          </div>
          <hr>

          <div class="pa-3">

            <v-expansion-panels class="mb-3">
              <v-expansion-panel color="#21232B" title="Gamemode name"
                                 text="give special name to your gamemode"></v-expansion-panel>
            </v-expansion-panels>

            <v-text-field variant="outlined" hint="put description of gamemode"
                          v-model="this.GamemodeName"></v-text-field>


            <v-expansion-panels class="mb-3">
              <v-expansion-panel color="#21232B" title="Description" text="Give players info about gamemode"></v-expansion-panel>
            </v-expansion-panels>
            <v-text-field variant="outlined" hint="put description of gamemode"
                          v-model="this.gameModeDescription"></v-text-field>

            <v-expansion-panels class="mb-3">
              <v-expansion-panel color="#21232B" title="Words"
                                 text="place words with spaces in between"></v-expansion-panel>
            </v-expansion-panels>

            <v-text-field variant="outlined" hint="Example colors: red yellow green white black "
                          v-model="this.words"></v-text-field>


          </div>

          <div class="d-flex justify-space-between">
            <v-btn @click="this.CancelCreatingRoom" class="ma-2" color="red">Cancel</v-btn>
            <v-btn @click="this.createGamemode()" class="ma-2" color="blue">Create</v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
  <v-snackbar
      color="blue-red"
      v-model="snackbar"
  >
    {{ this.snackbarMessage }}

    <template v-slot:actions>
      <v-btn
          color="pink"
          variant="text"
          @click="snackbar = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>


<script>
import axios from "axios";
import router from "@/router";
import {user} from "../../handelers/UserHandeler";

export default {

  data: () => ({
    username: "",
    words: "",
    gamemodes: [],


    GamemodeName: "",
    gameModeDescription: "",
    lives: "",
    timer: "no timer",
    timePerPlayer: "",

    snackbarMessage: "",
    snackbar: false,
  }),
  async mounted() {

    this.username = await this.fetchUserData();
    this.GamemodeName = this.gamename;
    this.fetchGameModes();
    console.log(this.gamemodes);



  },
  methods: {
    createGamemode() {
      if (this.checkInput() && this.validateWords()) {
        if (!this.checkIfNameAlreadyUsed(this.GamemodeName))
        {
          this.sendData();
        }
      else
        this.showSnackbar("Room name already exists");
      }
    },
    sendData() {
      try {
        axios
            .post("https://backendbombgane.onrender.com/api/gamemode/add-gamemode", {
              name: this.GamemodeName,
              words: this.words.split(' '),
              description: this.gameModeDescription,
              Author: this.username.username,

            }).then((response) => {

        }, (error) => {
          throw error || new Error(`Request failed`);
        })
      } catch (error) {
        console.error(error);
      }
      router.push("/room-list");
    },

    checkInput() {
      return (!!this.GamemodeName.trim() || !!this.gameModeDescription.trim() || !!this.lives.trim());
    },

    checkIfNameAlreadyUsed(gamemodeName) {
      axios.get('/api/gamemode/fetch-gamemodes')
          .then(async (response) => {
            const gamemode = response.data.map(gamemode => gamemode.name.toLowerCase());
            return gamemode.includes(gamemodeName.toLowerCase());
          })
          .catch(function (error) {
            console.log(error);
          })
      return false;
    },

    fetchGameModes(gamemodeName) {
      axios.get('/api/gamemode/fetch-gamemodes')
          .then(async (response) => {
            this.gamemodes = response.data.map(gamemode => gamemode.name.toLowerCase());
            console.log(this.gamemodes);
          })
          .catch(function (error) {
            console.log(error);
          })
      return false;
    },
    showSnackbar(message) {
      this.snackbarMessage = message;
      this.snackbar = true;
    },

    CancelCreatingRoom() {
      router.push("/")
    },

    async fetchUserData() {
      return await user.getUserData();
    },

    validateWords() {
      const wordsArray = this.words.split(' ');

      if (wordsArray.length <= 5) {
        this.showSnackbar("Game mode must have more then 5 words and words must have space in between");

        return false;
      }
      return true;
    },

  }
}</script>
