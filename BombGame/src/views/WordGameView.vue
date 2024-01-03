<script setup>

</script>

<template>
  <v-row>
    <v-col>
      <v-btn @click="this.setLetters" color="black">debug</v-btn>
    </v-col>
    <v-col><v-text-field></v-text-field><v-btn>submit</v-btn></v-col>
    <v-col><h1>letters: {{letters}}</h1></v-col>
  </v-row>
</template>

<script>

import {playerMethods} from "../../handelers/playerHandeler";
import {user} from "../../handelers/UserHandeler";
import axios from "axios";
import {gameModeMethods} from "../../handelers/gameModeHandeler";

export default {
  data: () => ({
    gameModeSettings: null,
    letters: null,
  }),
  async mounted() {
    console.log(await user.getUserData());
    playerMethods.connectToRoom("yohni:" + "test1");
    this.letters = await gameModeMethods.getLetters();

  },
  methods: {
    joinRoom() {
      console.log("press");
      playerMethods.connectToRoom("newRoom");
    },

    fetchGameModeSettings(GameModeName) {
      axios.get('/api/gameMode/' + GameModeName)
          .then(async (response) => {
            this.gameModeSettings = response.data;
          })
          .catch(function (error) {
            console.log(error);
          })
    },

    async setLetters() {
      this.letters = await gameModeMethods.getLetters();
    }

  }
};
</script>

<style scoped>
</style>