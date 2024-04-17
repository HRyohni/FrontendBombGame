<script setup>
import io from 'socket.io-client';
const props = defineProps({
  gamename: String // Assuming gamename is a string
});
</script>

<template>
  <v-container fluid="true">
    <v-row class="d-flex justify-center">
      <!--for desktop-->
      <v-col cols="12" class="d-lg-none">
        <v-card width="100%" elevation="4" class="pa-5">
          <div class="pa-4 d-flex justify-center">
            <h3>CREATE NEW GAMEMODE</h3>
          </div>
          <hr>

          <div class="pa-3">

            <v-expansion-panels class="mb-3">
              <v-expansion-panel color="primary" title="Gamemode name"
                                 text="Name your room so other players can find it."></v-expansion-panel>
            </v-expansion-panels>
            <v-text-field variant="outlined" hint="write" v-model="this.GamemodeName"></v-text-field>


            <v-expansion-panels class="mb-3">
              <v-expansion-panel color="primary" title="Game Modes" text="Pick Game Mode to play."></v-expansion-panel>
            </v-expansion-panels>
            <v-text-field variant="outlined" hint="what gamemode you want to play"
                          v-model="this.gameModeDescription"></v-text-field>

            <v-expansion-panels class="mb-3">
              <v-expansion-panel color="primary" title="Words"
                                 text="place words with spaces in between"></v-expansion-panel>
            </v-expansion-panels>

            <v-text-field variant="outlined" hint="place words with spaces in between"
                          v-model="this.words"></v-text-field>


          </div>

          <div class="d-flex justify-center">
            <v-btn @click="this.CancelCreatingRoom()" class="ma-2" color="red">Cancel</v-btn>
            <v-btn class="ma-2" color="blue" @click="this.createGamemode()">Create</v-btn>
          </div>
        </v-card>
      </v-col>

      <!--for phone-->
      <v-col cols="12" lg="49" xl="4" class="d-none d-lg-flex justify-center">
        <v-card width="100%" elevation="4" class="pa-5">
          <div class="pa-4 d-flex justify-center">
            <h3>CREATE NEW ROOM</h3>
          </div>
          <hr>

          <div class="pa-3">

            <v-expansion-panels class="mb-3">
              <v-expansion-panel color="primary" title="Gamemode name"
                                 text="Name your room so other players can find it."></v-expansion-panel>
            </v-expansion-panels>
            <v-text-field variant="outlined" hint="write" v-model="this.GamemodeName"></v-text-field>


            <v-expansion-panels class="mb-3">
              <v-expansion-panel color="primary" title="Description" text="Pick Game Mode to play."></v-expansion-panel>
            </v-expansion-panels>
            <v-text-field variant="outlined" hint="put description of gamemode"
                          v-model="this.gameModeDescription"></v-text-field>

            <v-expansion-panels class="mb-3">
              <v-expansion-panel color="primary" title="Words"
                                 text="place words with spaces in between"></v-expansion-panel>
            </v-expansion-panels>

            <v-text-field variant="outlined" hint="place words with spaces in between"
                          v-model="this.words"></v-text-field>


          </div>

          <div class="d-flex justify-center">
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



  },
  methods: {
    createGamemode() {
      if (this.checkInput())
      {
        if (!this.checkIfNameAlreadyUsed(this.GamemodeName))
          this.sendData()

        else {
          this.showSnackbar("Room name already exists")
        }

      }
      else
        this.showSnackbar("input missing");

    },
    sendData() {
      try {
        axios
            .post("/api/gamemode/add-gamemode", {
              name: this.GamemodeName,
              words: this.words.split(' '),
              description: this.gameModeDescription,
              Author: this.username.username,

            }).then((response) => {
          console.log(response);
          router.push("/");
        }, (error) => {
          throw error || new Error(`Request failed`);
        })
      } catch (error) {
        console.error(error);
      }
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

  }
}</script>
