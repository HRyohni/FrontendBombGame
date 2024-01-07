<script setup>
import io from 'socket.io-client';
</script>

<template>
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
      <v-btn class="ma-1" @click="this.setLetters" color="black">reset Word</v-btn>
      <v-btn class="ma-1" @click="this.joinRoom" color="black">join room</v-btn>
      <v-btn class="ma-1" @click="this.leaveRoom" color="black">disconnected room</v-btn>
    </v-col>
    <v-col>
      <v-text-field suffix="ENTER" variant="outlined" label="type word."
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

export default {
  data: () => ({
    gameModeSettings: null,
    letters: "xx",

    guessedWord: "",
    chatMsg: "",

    roomName: "room1",
    isCorrectAnswer: true,

    // messages
    username: '',
    gameName: 'colors',
    message: '',
    messages: [],
    socket: null


  }),
  async mounted() {
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
      console.log(letters,",,,,,,,,,,,,")
      this.letters = letters;
    });

  },
  methods: {
    checkWord: async function (word) {
      if (word.includes(this.letters))
        return await gameModeMethods.checkWord(word, this.letters);
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
      await this.setLetters();
    },
    sendMessage() {
      this.socket.emit('chat message', {
        message: this.message,
        username: this.username,
        room: this.room
      });
      this.message = ''; // Clear the input field after sending the message
    },


    joinRoom() {
      playerMethods.connectToRoom(this.roomName);

    },
    leaveRoom() {
      playerMethods.disconnectFromRoom(this.roomName);
    },

    async   setLetters() {
      this.letters = await gameModeMethods.getLetters(this.gameName, this.roomName);
    },

    clearText() {
      this.guessedWord = "";
    },


  }
}
</script>
