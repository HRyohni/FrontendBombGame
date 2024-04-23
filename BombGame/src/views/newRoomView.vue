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
        <v-card color="#53566B" width="100%" elevation="4" class="pa-5">
          <div class="pa-4 d-flex justify-center">
            <h3>CREATE ROOM</h3>
          </div>
          <hr>

          <div class="pa-3">

            <v-expansion-panels class="mb-3">
              <v-expansion-panel color="#21232B" title="Room Name"
                                 text="Name your room so other players can find it."></v-expansion-panel>
            </v-expansion-panels>
            <v-text-field variant="outlined" hint="write" v-model="this.game"></v-text-field>


            <v-expansion-panels class="mb-3">
              <v-expansion-panel color="#21232B" title="Game Modes" text="Pick Game Mode to play."></v-expansion-panel>
            </v-expansion-panels>
            <v-text-field :disabled="true" v-model="this.gamename" variant="outlined" hint="what gamemode you want to play" ></v-text-field>

            <v-expansion-panels class="mb-3">
              <v-expansion-panel color="#21232B" title="lives" text="how many lives will each player have. "></v-expansion-panel>
            </v-expansion-panels>

            <v-slider class="mt-10" thumb-label elevation="4" label="lifes" :min="1" :max="10" :step="1"
                      v-model="this.lives"></v-slider>




            <v-expansion-panels class="mb-3">
              <v-expansion-panel color="#21232B" title="Timer" text="set timer for players turn"></v-expansion-panel>
            </v-expansion-panels>
            <v-combobox
                variant="outlined"
                style="width: auto"
                class="ma-2"
                :items="['3s','4s','5s','6s','7s','10s']"
                label="Time"
                v-model="this.timePerPlayer"
            ></v-combobox>


          </div>

          <div class="d-flex justify-space-between">
            <v-btn @click="this.CancelCreatingRoom()" class="ma-2" color="red">Cancel</v-btn>
            <v-btn class="ma-2" color="blue" @click="this.createRoom">Create</v-btn>
          </div>
        </v-card>
      </v-col>

      <!--for phone-->
      <v-col cols="12" lg="49" xl="4" class="d-none d-lg-flex justify-center">
        <v-card color="#53566B" width="100%" elevation="4" class="pa-5">
          <div class="pa-4 d-flex justify-center">
            <h3>CREATE ROOM</h3>
          </div>
          <hr>

          <div class="pa-3">

            <v-expansion-panels class="mb-3">
              <v-expansion-panel color="#21232B" title="Room Name"
                                 text="Name your room so other players can find it."></v-expansion-panel>
            </v-expansion-panels>
            <v-text-field  variant="outlined" hint="write" v-model="this.roomName"></v-text-field>


            <v-expansion-panels class="mb-3">
              <v-expansion-panel color="#21232B"  title="Game Modes" text="Game mode you picked to play."></v-expansion-panel>
            </v-expansion-panels>
            <v-text-field :disabled="true" v-model="this.gamename" variant="outlined"  ></v-text-field>

            <v-expansion-panels class="mb-3">
              <v-expansion-panel color="#21232B" title="lives" text="how many lives will each player have. "></v-expansion-panel>
            </v-expansion-panels>

            <v-slider class="mt-10" thumb-label elevation="4" label="lifes" :min="1" :max="10" :step="1"
                      v-model="this.lives"></v-slider>




            <v-expansion-panels class="mb-3">
              <v-expansion-panel color="#21232B" title="Timer" text="set timer for players turn"></v-expansion-panel>
            </v-expansion-panels>
            <v-combobox
                variant="outlined"
                style="width: auto"
                class="ma-2"
                :items="['3s','4s','5s','6s','7s','10s']"
                label="Time"
                v-model="this.timePerPlayer"
            ></v-combobox>
          </div>

          <div class="d-flex justify-space-between">
            <v-btn @click="this.CancelCreatingRoom" class="ma-2" color="red">Cancel</v-btn>
            <v-btn @click="this.createRoom" class="ma-2" color="blue">Create</v-btn>
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
    roomName: "",
    gameModeName: "colors",
    lives: "",
    timer: "no timer",
    timePerPlayer: "",

    snackbarMessage: "",
    snackbar: false,
  }),
  async mounted() {

    this.username = await user.getUserData();

  },
  methods: {


    createRoom() {
      if (this.checkInput())
        if (!this.checkIfNameAlreadyUsed(this.roomName))
        {

          this.sendData();

        }

        else {
          this.showSnackbar("Room name already exists")
        }
      else
        this.showSnackbar("input missing");

    },

    sendData() {
      try {
        axios
            .post("https://backendbombgane.onrender.com/api/room/create-room", {
              host: this.username.username,
              roomName: this.roomName,
              gameModeName: this.gameModeName,
              lives: this.lives,
              timer: this.timer,
              timePerPlayer: this.timePerPlayer
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
