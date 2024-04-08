<script setup>
import io from 'socket.io-client';
</script>

<template>

  <v-row>
    <v-col>
      <v-card class="pa-5" elevation="10" color="#494B57">
        <div class="d-flex justify-center" v-for="data in this.roomList">
          <v-card class="ma-3 pa-2" width="50%">

            <v-card-title>{{ data.Room.roomName }}</v-card-title>
            <v-card-title>{{ data.Room.gameModeName }}</v-card-title>
            <div class="justify-end d-flex">
              <v-btn :to="'game/'+data._id" class="ma-4" color="blue">Join</v-btn>
            </div>
          </v-card>

        </div>
      </v-card>

    </v-col>
  </v-row>

</template>

<script>

import axios from "axios";
import io from "socket.io-client";
import router from "@/router";
import {mapGetters} from "vuex";

export default {
  data: () => ({
    roomList: null,
    socket: null,
    username: "test",
  }),
  async mounted() {
    //this.username = this.getUsername.username;
    await this.fetchAllRooms();
    this.socket = io("http://localhost:3000");

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
      await axios.get('/api/room/fetch-rooms')
          .then(async (response) => {
            console.log(response);
            this.roomList = response.data;
            console.log(this.roomList);
          })
          .catch(function (error) {
            console.log("error occured: " + error);
          })
    },


  }
}</script>
