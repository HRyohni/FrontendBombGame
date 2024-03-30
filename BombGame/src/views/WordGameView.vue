<script setup>
import io from 'socket.io-client';


</script>

<template>
  <v-btn @click="this.leaveRoom">leave room</v-btn>
  <v-snackbar
      v-model="isToast"
  >
    <template v-slot:actions>
      <v-btn
          color="pink"
          variant="text"
          @click="isToast = false"
      >
        Close
      </v-btn>
      <h4>{{ this.toastMsg }}</h4>
    </template>
  </v-snackbar>

  <v-navigation-drawer :width="292" color="#332941" location="right">
    <v-list-item title="Chat" subtitle="dont be rude  ❤ ️"></v-list-item>
    <v-divider></v-divider>


    <div>
      <h3 class="ma-3">chat</h3>
      <v-card class="pa-2 " height="500" color="#332941">

        <ul>
          <li v-for="(msg, index) in messages" :key="index">
            <div>
              {{ msg.username + ": " + msg.message }}
            </div>

          </li>
        </ul>

      </v-card>

      <v-text-field suffix="ENT" @keydown.enter.prevent="sendMessage" v-model="message"
                    placeholder="Type your message"></v-text-field>
    </div>
  </v-navigation-drawer>


  <v-card class="">
    <h1 class="d-flex justify-center">GET READY!</h1>
    <div class="d-flex justify-center">
      <div class="" v-for="user in this.roomSettings.playersName" :key="user">
        <div class="ma-2">
          <v-avatar class="justify-center d-flex"
                    image="https://cdn.discordapp.com/avatars/718124223347818497/1d03ebf4cf9d399835133ba85edbbe7a.webp?size=80"
                    size="70"></v-avatar>
          <p class="d-flex justify-center">{{ user }}</p>
          <v-btn v-if="!isPlayerReadyStatus(user)" variant="outlined" color="blue">not READY</v-btn>
          <v-btn v-if="isPlayerReadyStatus(user)" color="green">READY</v-btn>
        </div>


      </div>
    </div>

    <div class="justify-center d-flex ma-2">

      <v-btn v-if="this.isPlayerReady" @click="this.setReady()" class="justify-center d-flex" color="green">set Ready
      </v-btn>
      <v-btn v-if="!this.isPlayerReady" @click="this.setNotReady()" variant="outlined" class="justify-center d-flex"
             color="red">set Not Ready
      </v-btn>
      <v-btn @click="this.startTimer();" class="ma-2" color="black">start timer</v-btn>
      {{ this.timer }}
    </div>

    <div class="justify-end d-flex ma-5">
      <v-btn v-if="this.isPlayerHost" :disabled="!this.isAllPlayersReady" @click="this.StartGame()" color="red">Start
        Game
      </v-btn>
    </div>
  </v-card>

  <div class="ma-4">
    <!--    <v-row class="justify-center d-flex">-->
    <!--      <v-col>-->
    <!--        <v-card height="150px" width="100%" class="justify-center d-flex"><h1>playerName</h1></v-card>-->
    <!--      </v-col>-->
    <!--      <v-col>-->
    <!--        <v-card height="150px" width="100%" class="justify-center d-flex"><h1>playerName</h1></v-card>-->
    <!--      </v-col>-->
    <!--      <v-col>-->
    <!--        <v-card height="150px" width="100%" class="justify-center d-flex"><h1>playerName</h1></v-card>-->
    <!--      </v-col>-->
    <!--    </v-row>-->
    <!--    <v-row class="justify-center d-flex">-->
    <!--      <v-col>-->
    <!--        <v-card height="150px" width="100%" class="justify-center d-flex"><h1>playerName</h1></v-card>-->
    <!--      </v-col>-->
    <!--      &lt;!&ndash;todo      <v-col class=""><v-img id="arrowImage" src="../src/assets/arrow.png"></v-img></v-col> &ndash;&gt;-->
    <!--      <v-col>-->
    <!--        <v-card height="150px" width="100%" class="justify-center d-flex"><h1></h1></v-card>-->
    <!--      </v-col>-->
    <!--      <v-col>-->
    <!--        <v-card height="150px" width="100%" class="justify-center d-flex"><h1>playerName</h1></v-card>-->
    <!--      </v-col>-->
    <!--    </v-row>-->
    <!--    <v-row class="justify-center d-flex">-->
    <!--      <v-col>-->
    <!--        <v-card height="150px" width="100%" class="justify-center d-flex"><h1>playerName</h1></v-card>-->
    <!--      </v-col>-->
    <!--      <v-col>-->
    <!--        <v-card height="150px" width="100%" class="justify-center d-flex"><h1>playerName</h1></v-card>-->
    <!--      </v-col>-->
    <!--      <v-col>-->
    <!--        <v-card height="150px" width="100%" class="justify-center d-flex"><h1>playerName</h1></v-card>-->
    <!--      </v-col>-->
    <!--    </v-row>-->

    <h1 class="d-flex justify-center">Letters:</h1>
    <h2 class="d-flex justify-center">{{ this.letters }}</h2>

    <div class="ma-15 d-flex justify-center">
      <v-text-field :disabled="!this.isCurrentPlayersTurn" suffix="ENT" @keydown.enter.prevent="sendMessage"
                    hint="write a word" placeholder="write a word"></v-text-field>
      <v-btn class="ma-2" color="green">Guess</v-btn>
    </div>


    <v-btn @click="rotateArrow()">rotate</v-btn>
  </div>
</template>

<script>

import {playerMethods} from "../../handelers/playerHandeler";
import {gameModeMethods} from "../../handelers/gameModeHandeler";
import {user} from "../../handelers/UserHandeler";
import axios from "axios";
import io from "socket.io-client";
import {mapGetters} from "vuex";


export default {
  props: ['gameID'],
  data: () => ({
    playersData: null,

    gameModeSettings: null,
    roomSettings: "nullString",
    letters: "xx",
    isButtonDisabled: false,
    // player that starts this turn
    RoomData: null,

    isPlayerReady: true,
    isPlayerHost: false,
    isCurrentPlayersTurn: false,
    playersReady: [],
    isAllPlayersReady: false,

    guessedWord: "",
    isCorrectAnswer: true,

    // messages
    username: '',
    gameName: 'colors',
    message: '',
    messages: [{username: "username", message: "new message"}],
    socket: null,

    // Toast
    toastMsg: "no msg",
    isToast: false,
    //timer
    timer: 0, // Start the timer at 3 seconds
    // Add timer interval variable to store setInterval reference
    timerInterval: null

  }),
  beforeUnmount() {
    clearInterval(this.timerInterval);
  },

  async unmounted() {
    try {
      // Clean up any resources or subscriptions before the component is destroyed
      await this.leaveRoom();
      console.log('Component is about to be destroyed');
    } catch (error) {
      console.error('Error during component destruction:', error);
    }
  },
  async mounted() {
    this.socket = io("http://localhost:3000"); // Connect to the Socket.IO server

    this.playersData = await this.fetchUserData();
    this.username = this.playersData.username;
    this.roomSettings = await this.fetchRoomSettings(this.gameID);
    this.timer = parseInt(this.roomSettings.timer.slice(0, -1))
    this.gameModeSettings = await this.fetchGameModeSettings(this.gameID);

    await this.joinSocketRoom(this.gameID, this.username)
    await this.updateSettings();
    this.checkHost();
    await this.getLetters();


    //await this.setLetters();

    this.socket.on('newMessage', (username, message) => {
      this.messages.push({username: username, message: message});
    });

    this.socket.on('letters', (letters) => {
      this.letters = letters;
    });

    this.socket.on('getRoomData', (RoomData) => {
      this.RoomData = RoomData;
    });

    this.socket.on('fetchFirstPlayer', async (firstPlayer) => {
      this.startTimer();
      await this.showToast("first player is: " + firstPlayer)
      this.isCurrentPlayersTurn = firstPlayer === this.username;
    });

    this.socket.on('receiveLetters', (letters) => {
      this.letters = letters;
    });

    this.socket.on('getNextPlayer', (mainPlayer) => {
      console.log(mainPlayer);
    });

    this.socket.on('getPlayerReady', async (player) => {
      await this.getPlayerReady(player);
      this.isAllPlayersReady = this.checkIfAllPlayersReady();
    });

    this.socket.on('getPlayerNotReady', async (player) => {
      await this.setPlayerNotReady(player);
      this.isAllPlayersReady = this.checkIfAllPlayersReady();
    });

    this.socket.on('newPlayerJoined', async (player) => {
      this.roomSettings = await this.fetchRoomSettings(this.gameID);
    });

    this.socket.on('playerLeftParty', async () => {
      this.roomSettings = await this.fetchRoomSettings(this.gameID);
    });

    this.socket.on('timerGetUpdate', (timerValue) => {
      this.timer = timerValue;
    });


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

    async fetchUserData() {
      return await user.getUserData();
    },

    async fetchRoomSettings(roomID) {
      try {
        const response = await axios.get('/api/room/fetch-room/' + roomID);
        return response.data;
      } catch (error) {
        console.error(error);
        return null; // Return null or handle the error as per your requirement
      }
    },

    async fetchGameModeSettings(GameModeName) {
      try {
        const response = await axios.get('/api/gameMode/' + GameModeName);
        return response.data;
      } catch (error) {
        console.error(error);
        return null; // Return null or handle the error as per your requirement
      }
    },

    async updateSettings() {
      this.roomSettings.playersName.push(this.username)
      await axios.post("/api/room/update-room", {roomID: this.gameID, data: this.roomSettings});
    },

    async joinSocketRoom(roomName, username) {

      await this.socket.emit('userLeft', this.username, this.gameID, "is here finally here");
      await this.socket.emit('joinRoom', roomName, username);
    },

    async StartGame() {
      this.randomFirstPlayer();
    },

    randomFirstPlayer() {
      this.socket.emit('pickRandomFirstPlayer', this.gameID, this.roomSettings.playersName);
    },

    sendMessage() {
      const message = {
        message: this.message,
        username: this.username,
        room: this.gameID
      };
      this.socket.emit('sendMessage', message);
      this.messages.push(message);
      this.message = "";
    },

    startTimer() {
      this.getLetters();
      // Clear any existing timer interval
      clearInterval(this.timerInterval);

      // Start a new timer interval that updates every second
      this.timerInterval = setInterval(() => {
        // Decrement timer by 1 second
        if (this.timer > 0) {
          this.timer--;

          // Emit the timer value to the server
          this.socket.emit('timerUpdate', this.gameID, this.timer);
        } else {
          // Timer has reached 0, stop the timer and handle timeout scenario
          clearInterval(this.timerInterval); // Stop the timer interval
          this.timer = parseInt(this.roomSettings.timer.slice(0, -1))
        }
      }, 1000); // 1000 milliseconds = 1 second
    },

    checkWord: async function (word) {
      if (word.includes(this.letters)) {
        this.socket.emit('checkWord', this.gameID, this.timer);

      }


    },

    async fetchNewWordIfCorrect(guessedWord) {
      this.clearText();
      if (await this.checkWord(guessedWord)) {
        await this.setLetters();
      } else {
        console.log("wrong guess");
        return false;
      }
    },


    async getLetters() {
      this.socket.emit('getLetters', this.gameID, this.gameModeSettings.words);
    },

    clearText() {
      this.guessedWord = "";
    },

    nextTurn() {
      this.socket.emit('nextPlayer', this.roomName, this.mainPlayer);
    },


    async startGame() {
      this.randomFirstPlayer()
    },

    async showToast(message) {
      this.toastMsg = message;
      this.isToast = !this.isToast;
    },

    async leaveRoom() {
      try {
        // Emit the socket event to disconnect the user from the room
        await this.socket.emit('disconnectUserFromRoom', this.gameID, this.username);
        await this.socket.emit('userLeft', this.username, this.gameID, "left");
        await this.socket.to(this.gameID).emit("playerLeftParty");
        console.log(`Successfully left room ${this.roomName}`);
      } catch (error) {
        console.error('Error leaving room:', error);
        // Handle the error appropriately (e.g., display an error message to the user)
      }
    },

    checkHost() {
      if (this.roomSettings.host === this.username) {
        this.isPlayerHost = !this.isPlayerHost;
      }
    },

    async setReady() {
      this.isPlayerReady = !this.isPlayerReady;
      this.playersReady.push(this.username)
      await this.socket.emit('sendPlayerReady', this.username, this.gameID);
    },

    async setNotReady() {
      this.isPlayerReady = !this.isPlayerReady;
      this.playersReady = this.playersReady.filter(p => p !== this.username);
      await this.socket.emit('sendPlayerNotReady', this.username, this.gameID);
    },

    isPlayerReadyStatus(player) {
      return this.playersReady.includes(player);
    },

    async getPlayerReady(player) {
      console.log("user: ", player, " is ready");
      this.playersReady.push(player);
      console.log("Players Ready:", this.playersReady); // Verify that playersReady is updated
    },

    async setPlayerNotReady(player) {

      console.log("user: ", player, " is NOT ready");
      this.playersReady = this.playersReady.filter(p => p !== player);
      console.log("Players not Ready:", this.playersReady); // Verify that playersReady is updated
    },

    async checkIfAllPlayersReady() {
      return this.arraysAreEqual(this.this.roomSettings.playersName, this.playersReady)
    },

    arraysAreEqual(arr1, arr2) {
      // todo fix
      return arr1.length === arr2.length;

    },

    rotateArrow() {
      const arrowImage = document.getElementById('arrowImage');
      // Get the current rotation angle from the image style or default to 0
      let rotation = parseFloat(arrowImage.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;
      // Increment rotation by 45 degrees
      rotation += 45;
      // Apply the new rotation
      arrowImage.style.transform = `rotate(${rotation}deg)`;
    }
  },

}
</script>
