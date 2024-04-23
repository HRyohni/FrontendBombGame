<script setup>
</script>

<template>

  <v-row>
    <v-col>
      <v-card class="pa-5" elevation="10" color="#494B57">
        <v-row>
          <v-col>


            <div class="d-flex justify-center">

              <v-card :color="randomColor()" class="ma-3 pa-2" width="70%">
                <div class="d-flex justify-center">
                  <div class="ma-3 text-md-h4 text-sm-h3">your scoreboard</div>
                </div>
                <div class="d-flex justify-space-between">
                  <div class="ma-3 text-md-h1 text-sm-h3">score:</div>
                  <div class="ma-3 text-md-h1 text-sm-h3"><b>{{ username.scoreboard }}</b></div>
                </div>
                <v-row>
                  <v-col>
                    <div class="d-flex justify-space-between justify-center align-center">
                      <div v-if="username.profilePicture" class="ma-3 text-md-h1 text-sm-h3">
                        <v-img width="200" :src="username.profilePicture"></v-img>
                      </div>
                      <div class="ma-3 text-md-h1 text-sm-h3"><b>{{ username.username }}</b></div>
                    </div>

                    <div class="justify-space-between d-flex">
                    </div>
                  </v-col>
                </v-row>


              </v-card>
            </div>


            <div class="d-flex justify-center">
              <div class="ma-3 text-md-h1 text-sm-h3">Scoreboard</div>
            </div>
            <div class="d-flex justify-center " v-for="(data,index) in this.allUsers">

              <v-card :loading="true" :border="randomColor()" :elevation="15" v-if="index+1 === 1"  :color="this.randomColor()" class="ma-3 pa-2" width="100%">

                <div class="ma-3 text-md-h3 text-sm-h3 d-flex justify-center">
                  <FontAwesomeIcon  :icon="trophyIcon"/>
                </div>
                <div class="ma-3 text-md-h3 text-sm-h3">{{ index + 1 }}</div>
                <div class="d-flex justify-center">

                  <div class="ma-3 text-md-h1 text-sm-h3">score:</div>
                  <div class="ma-3 text-md-h1 text-sm-h3"><b>{{ data.scoreboard }}</b></div>
                </div>
                <v-row>
                  <v-col>
                    <div class="d-flex justify-space-evenly align-center">
                      <div v-if="data.profilePicture" class="ma-3 text-md-h1 text-sm-h3">
                        <v-img width="200" :src="data.profilePicture"></v-img>
                      </div>
                      <div class="ma-3 text-md-h1 text-sm-h3"><b>{{ data.username }}</b></div>
                    </div>
                  </v-col>
                </v-row>
              </v-card>

              <v-card v-if="index+1 !== 1"  :color="this.randomColor()" class="ma-15 pa-2" width="100%">
                <div class="ma-3 text-md-h3 text-sm-h3">{{ index + 1 }}</div>
                <div class="d-flex justify-center">
                  <div class="ma-3 text-md-h1 text-sm-h3">score:</div>
                  <div class="ma-3 text-md-h1 text-sm-h3"><b>{{ data.scoreboard }}</b></div>
                </div>
                <v-row>
                  <v-col>
                    <div class="d-flex justify-space-evenly align-center">
                      <div v-if="data.profilePicture" class="ma-3 text-md-h1 text-sm-h3">
                        <v-img width="200" :src="data.profilePicture"></v-img>
                      </div>
                      <div class="ma-3 text-md-h1 text-sm-h3"><b>{{ data.username }}</b></div>
                    </div>
                  </v-col>
                </v-row>
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
import {faTrophy} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default {
  components: {
    FontAwesomeIcon
  },

  data: () => ({
    roomList: null,
    selectedPlayerName: null,
    roomNames: [],
    allUsers: null,
    socket: null,
    username: "",
    animateBestScore: true,
    trophyIcon: faTrophy,
    mousePosition: 0,
    colors: ["green", "red", "yellow", "pink", "purple", "blue", "indigo", "cyan", "teal", "amber", "orange", "brown", "grey", "blue-grey", "lime", "light-green", "deep-orange", "light-blue", "deep-purple", "light-blue"],

    searchQuery: ""
  }),
  async mounted() {
    this.username = await this.fetchUserData();
    this.fetchAllUsers()

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

    fetchAllUsers() {
      axios.get('/api/user/fetchAllUsers')
          .then(response => {
            this.allUsers = this.sortByScoreboard(response.data);
          })
          .catch(error => {
            console.error('Error fetching all users:', error);
          });
    },

    sortByScoreboard(allUsers) {
      return allUsers.sort((a, b) => b.scoreboard - a.scoreboard);
    },
    bestScoreAnimation() {
      return this.animateBestScore ? 'rainbow 5s infinite' : 'none';
    },

    handleMouseMove(event) {
      // Get mouse position from event object
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      // Do something with mouseX and mouseY (e.g., update data properties)
      // For example:
      this.updateMousePosition(mouseX, mouseY);
    },
    updateMousePosition(x, y) {
      // Update data properties or perform other actions with mouse position
      // For example:
      this.mousePosition = x;
      // this.mouseY = y;
    },


    async fetchAllRooms() {
      await axios.get('/api/room/fetch-rooms')
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
      console.log("Selected room name:", this.selectedPlayerName);

    },
    findUserByName(allUsers, username) {
      // Find the user with the provided username
      return allUsers.find(user => user.username === username);
    },

    findRoomIdByName(roomName) {
      for (let i = 0; i < this.roomList.length; i++) {
        if (this.roomList[i].Room.roomName === roomName) {
          return this.roomList[i]._id;
        }
      }
      return null; // Return null if room not found
    }
    ,


  }


}</script>

<style>
@keyframes rainbow {
  0% {
    color: red;
  }
  16.7% {
    color: orange;
  }
  33.3% {
    color: yellow;
  }
  50% {
    color: green;
  }
  66.7% {
    color: blue;
  }
  83.3% {
    color: indigo;
  }
  100% {
    color: violet;
  }
}

</style>
