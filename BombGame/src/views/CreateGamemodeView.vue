<script setup>
import io from 'socket.io-client';
</script>

<template>

  <v-container fluid="true">
    <v-row class="d-flex justify-center">
      <!--for desktop-->
      <v-col cols="12" class="d-lg-none">
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
            <v-text-field variant="outlined" hint="write" v-model="this.roomName"></v-text-field>


            <v-expansion-panels class="mb-3">
              <v-expansion-panel color="primary" title="Game Modes" text="Pick Game Mode to play."></v-expansion-panel>
            </v-expansion-panels>
            <v-text-field variant="outlined" hint="what gamemode you want to play" v-model="this.gameModeName"></v-text-field>

            <v-expansion-panels class="mb-3">
              <v-expansion-panel color="primary" title="lives" text="how many lives will each player have. "></v-expansion-panel>
            </v-expansion-panels>

            <v-slider class="mt-10" thumb-label elevation="4" label="lifes" :min="1" :max="10" :step="1"
                      v-model="this.lives"></v-slider>


            <v-expansion-panels class="mb-3" >
              <v-expansion-panel color="primary" title="Clock" text="set timer for whole game"></v-expansion-panel>
              <template >
                x
              </template>

            </v-expansion-panels>

            <v-combobox
                variant="outlined"
                style="width: auto"
                class="ma-2"
                :items="['no timer','3s','5s','10s']"
                label="Clock"
                v-model="this.timer"
            ></v-combobox>

            <v-expansion-panels class="mb-3">
              <v-expansion-panel color="primary" title="Timer" text="set timer for players turn"></v-expansion-panel>
            </v-expansion-panels>
            <v-combobox
                variant="outlined"
                style="width: auto"
                class="ma-2"
                :items="['no timer','3s','5s','10s']"
                label="Time"
                v-model="this.timePerPlayer"
            ></v-combobox>


          </div>

          <div class="d-flex justify-center">
            <v-btn @click="this.CancelCreatingRoom()" class="ma-2" color="red">Cancel</v-btn>
            <v-btn class="ma-2" color="blue" @click="this.createGamemode">Create</v-btn>
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
            <v-text-field  variant="outlined" hint="write" v-model="this.roomName"></v-text-field>


            <v-expansion-panels class="mb-3">
              <v-expansion-panel color="primary"  title="Description" text="Pick Game Mode to play."></v-expansion-panel>
            </v-expansion-panels>
            <v-text-field  variant="outlined" hint="put description of gamemode" v-model="this.gameModeName"></v-text-field>

             <v-expansion-panels class="mb-3">
              <v-expansion-panel color="primary"  title="Words" text="place words with spaces in between"></v-expansion-panel>
            </v-expansion-panels>

            <v-text-field  variant="outlined" hint="place words with spaces in between" v-model="this.words"></v-text-field>


          </div>

          <div class="d-flex justify-center">
            <v-btn @click="this.CancelCreatingRoom" class="ma-2" color="red">Cancel</v-btn>
            <v-btn @click="this.createGamemode" class="ma-2" color="blue">Create</v-btn>
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

export default {
  data: () => ({
    words: "",


    roomName: "",
    gameModeName: "colors",
    lives: "",
    timer: "no timer",
    timePerPlayer: "",

    snackbarMessage: "",
    snackbar: false,
  }),
  async mounted() {


  },
  methods: {
    createGamemode() {
      if (this.checkInput())
        if (this.checkIfNameAlreadyUsed(this.roomName))
          this.sendData()
        else {
          this.showSnackbar("Room name already exists")
        }
      else
        this.showSnackbar("input missing");

    },

    sendData() {
      try {
        axios
            .post("/api/room/create-room", {
              roomName: this.roomName,
              gameModeName: this.gameModeName,
              lives: this.lives,
              timer: this.timer,
              timePerPlayer: this.timePerPlayer
            }).then((response) => {
          console.log(response);
        }, (error) => {
          throw error || new Error(`Request failed`);
        })
      } catch (error) {
        console.error(error);
      }
    },

    checkInput() {
      return (!!this.roomName.trim() || !!this.gameModeName.trim() || !!this.lives.trim());
    },

    checkIfNameAlreadyUsed(roomName) {
      axios.get('/api/room/fetch-rooms')
          .then(async (response) => {
            console.log(response.data);
            const roomNames = response.data.map(room => room.Room.roomName);
            console.log(roomName);
            console.log(roomNames);
            console.log(roomNames.includes(roomName));
            return roomNames.includes(roomName);

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
    }

  }
}</script>
