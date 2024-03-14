<script setup>
import io from 'socket.io-client';
</script>

<template>
  <v-snackbar
      v-model="isToast"
  >
    {{ this.toastMsg }}
    <template v-slot:actions>
      <v-btn
          color="pink"
          variant="text"
          @click="isToast = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>

  <v-navigation-drawer :width="292" color="#332941" location="right">
    <v-list-item title="Chat" subtitle="dont be rude  ❤ ️"></v-list-item>
    <v-divider></v-divider>


    <div>
      <div class="d-flex">
        <v-text-field class="pa-1" v-model="username" placeholder="your username"></v-text-field>
        <v-text-field class="pa-1" v-model="roomName"></v-text-field>
      </div>

      <v-btn @click="joinChat">Join Chat</v-btn>
      <v-card class="pa-2 " height="500" color="#332941">
        <ul>
          <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
        </ul>
      </v-card>

      <v-text-field suffix="ENT" @keydown.enter.prevent="sendMessage" v-model="message"
                    placeholder="Type your message"></v-text-field>
    </div>
  </v-navigation-drawer>


  <v-row>
    <v-col>
      <v-btn class="ma-1" @click="this.setLetters" color="black">set Word</v-btn>
      <v-btn class="ma-1" @click="this.startGame" color="black">start game</v-btn>

    </v-col>
    <v-col>
      <div>
        <h1 class="d-flex justify-center">users joined!</h1>
        <div class="pa-2 d-flex justify-center">
          <v-btn class="ma-2"></v-btn>
        </div>



      </div>

      <v-text-field :disabled="this.isButtonDisabled" suffix="ENTER" variant="outlined" label="type word."
                    :rules="[true ]"
                    @keydown.enter.prevent="this.fetchNewWordIfCorrect(guessedWord)"
                    v-model="guessedWord"></v-text-field>
      <v-btn @click="this.fetchNewWordIfCorrect(guessedWord)">submit</v-btn>
    </v-col>
    <v-col><h1>letters: {{ this.letters }}</h1></v-col>
  </v-row>
</template>

<script>

import {playerMethods} from "../../handelers/playerHandeler";
import axios from "axios";
import {gameModeMethods} from "../../handelers/gameModeHandeler";
import io from "socket.io-client";
import {mapGetters} from "vuex";

export default {
  props: ['gameID'],
  data: () => ({
    gameModeSettings: null,
    letters: "xx",
    isButtonDisabled: false,
    // player that starts this turn
    mainPlayer: "name",
    RoomData: null,
    firstPlayer: null,

    guessedWord: "",
    chatMsg: "",

    roomName: "room1",
    isCorrectAnswer: true,

    // messages
    username: '',
    gameName: 'colors',
    message: '',
    messages: [],
    socket: null,

    // Toast
    toastMsg: "no msg",
    isToast: false,

  }),
  async mounted() {
    await this.fetchGameModeSettings("color");
    this.showToast(this.gameModeSettings);

    this.socket = io("http://localhost:3000"); // Connect to the Socket.IO server

    this.socket.on('chat message', (data) => {
      this.messages.push(`${data.username}: ${data.message}`);
    });

    this.socket.on('user joined', (username) => {
      this.messages.push(`${username} joined the chat`);
    });

    this.socket.on('user left', (username) => {
      this.messages.push(`${username} left the chat`);
    });

    this.socket.on('letters', (letters) => {
      this.letters = letters;
    });

    this.socket.on('getRoomData', (RoomData) => {
      this.RoomData = RoomData;
    });

    this.socket.on('fetchFirstPlayer', (firstPlayer) => {
      console.log(firstPlayer, "<--");

      this.mainPlayer = firstPlayer;

      this.checkPriority();
    });

    this.socket.on('getNextPlayer', (mainPlayer) => {
      console.log(mainPlayer);
    });

    this.socket.on('disconnect', function () {

      console.log("user disconnected!!!!!!!!!!!!!!!!!!!!");
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


    checkWord: async function (word) {
      if (word.includes(this.letters))
        if (await gameModeMethods.checkWord(word, this.letters)) {
          this.sendMessageToAll("guessed correct");
          return true;
        }

    },

    async fetchGameModeSettings(GameModeName) {
      await axios.get('/api/gameMode/' + GameModeName)
          .then(async (response) => {
            this.gameModeSettings = response.data;
            return response.data;
          })
          .catch(function (error) {
            console.log(error);
          })
    },

    async fetchRoomSettings(roomID)
    {

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

    async joinChat() {
      await this.socket.emit('disconnectFromAllRooms');
      this.messages = [];
      await this.socket.emit('new user', {username: this.username, room: this.roomName});
      //await this.setLetters();
    },

    sendMessage() {
      this.socket.emit('chat message', {
        message: this.message,
        username: this.username,
        room: this.roomName
      });
      this.message = ''; // Clear the input field after sending the message
    },

    sendMessageToAll(message) {
      this.socket.emit('chat message', {
        message: message,
        username: this.username,
        room: this.roomName
      });
      this.message = ''; // Clear the input field after sending the message
    },

    joinRoom() {
      //playerMethods.connectToRoom(this.roomName);

    },

    leaveRoom() {
      playerMethods.disconnectFromRoom(this.roomName);
    },

    async setLetters() {
      this.letters = await gameModeMethods.getLetters(this.gameName, this.roomName);
    },

    clearText() {
      this.guessedWord = "";
    },

    waitForTurn() {

    },

    nextTurn() {
      this.socket.emit('nextPlayer', this.roomName, this.mainPlayer);
    },

    checkPriority() {
      if (this.username === this.mainPlayer)
        this.isButtonDisabled = false;
    },

    randomFirstPlayer() {
      this.socket.emit('randomFirstPlayer', this.roomName);

    },

    fetchRoomData() {
      this.socket.emit('fetchUsers', this.roomName);
    },

    async startGame() {
      this.randomFirstPlayer()
    },

    showToast(message) {
      this.toastMsg = message;
      this.isToast = !this.isToast;
    },
  }
}
</script>
