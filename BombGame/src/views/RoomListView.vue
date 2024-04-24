<script setup>
</script>

<template>

  <v-row>
    <v-col>
      <v-card class="pa-5" elevation="10" color="#494B57">
        <v-row>
          <v-col>

            <v-combobox
                label="Combobox"
                :items="roomNames"
                v-model="selectedRoomName"
                class="mb-10"
            ></v-combobox>

            <div class="d-flex ajustify-center" v-for="data in roomList">
              <v-card v-if="selectedRoomName === null  || data.Room.roomName.includes(selectedRoomName)" :color="randomColor()" class="ma-3 pa-2" width="100%">
                <div>
                  <div class="d-flex">
                    <div class="ma-3 text-md-h1 text-sm-h3"><b>{{ data.Room.roomName }}</b></div>
                    <div class="ma-3 text-md-h3 text-sm-h3">{{ data.Room.gameModeName }}</div>
                  </div>

                  <v-row>
                    <v-col class="d-flex justify-center">
                      <div class="text-lg-h4 text-sm-h5">Lives: <b>{{ data.Room.lives }}</b></div>
                    </v-col>
                    <v-col class="d-flex justify-center">
                      <div class="text-lg-h4 text-sm-h5">Timer: <b>{{ data.Room.timePerPlayer }}</b></div>
                    </v-col>
                    <v-col class="d-flex justify-center">
                      <div class="text-lg-h4 text-sm-h5">players: <b>{{ data.Room.playersName.length }}/6</b></div>
                    </v-col>
                  </v-row>
                  <div class="justify-space-between d-flex">
                    <v-btn :disabled="data.Room.playersName.length>=6" :to="'game/'+data._id" class="ma-4" color="blue">
                      Join
                    </v-btn>
                  </div>
                </div>

              </v-card>
            </div>
          </v-col>

        </v-row>

      </v-card>

    </v-col>
  </v-row>

</template>

<script>

import axios from "axios";
import io from "socket.io-client";
import router from "@/router";
import {mapGetters} from "vuex";
import {user} from "../../handelers/UserHandeler";
import Router from "@/router";

export default {

  watch: {
    selectedRoomName(newVal, oldVal) {
      console.log("Selected room name:", newVal);
      const roomId = this.findRoomIdByName(newVal);
      console.log("Room ID:", roomId);
      if (roomId) {
        router.push('/game/' + roomId);
      }
      // Do whatever you need to do when the selection changes
    }
  },


  data: () => ({
    roomList: null,
    selectedRoomName: null,
    roomNames: [],
    socket: null,
    username: "",
    colors: ["green", "red", "yellow", "pink", "purple"],
    searchQuery: ""
  }),
  async mounted() {

    this.username = await this.fetchUserData();
    await this.fetchAllRooms();

    console.log("wat");
    console.log(this.roomNames);
    this.socket = io("https://backendbombgane.onrender.com");

  },
  computed: {
    // Use mapGetters to map the getUser getter from the store to a local computed property
    ...mapGetters(['getUser']),
    getUsername() {
      // Access the user object from the store using the computed property
      return this.getUser;
    }
  },
  methods: {
    async fetchAllRooms() {
      await axios.get('https://backendbombgane.onrender.com/api/room/fetch-rooms')
          .then(async (response) => {
            console.log(response);
            this.roomList = response.data.sort((a, b) => {
              if (a.Room.host === this.username.username && b.Room.host !== this.username.username) {
                return -1;
              } else if (a.Room.host !== this.username.username && b.Room.host === this.username.username) {
                return 1;
              } else {
                return 0;
              }
            });
            this.roomNames = this.roomList.map(item => item.Room.roomName);
          })
          .catch(function (error) {
            console.log("error occurred: " + error);
          })
    },

    randomColor() {
      return this.colors[Math.floor(Math.random() * this.colors.length)]
    },
    async fetchUserData() {
      return await user.getUserData();
    },

    getNames: async function () {
      return this.roomList.map(item => this.roomList.Room.roomName)
    },

    handleRoomSelection() {
      console.log("Selected room name:", this.selectedRoomName);

    },

    findRoomIdByName(roomName) {
      for (let i = 0; i < this.roomList.length; i++) {
        if (this.roomList[i].Room.roomName === roomName) {
          return this.roomList[i]._id;
        }
      }
      return null; // Return null if room not found
    },



  }


}</script>

<style>

</style>
