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
              {{ msg.username+": "+ msg.message }}
            </div>

          </li>
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
        <v-card>
          <div v-for="user in this.roomSettings.playersName">
            <v-card color="blue" class="ma-2 "  >
              <v-avatar image="https://cdn.discordapp.com/avatars/718124223347818497/1d03ebf4cf9d399835133ba85edbbe7a.webp?size=80" size="70"></v-avatar>
              <p class="d-flex justify-center">{{ user }}</p>
            </v-card>

          </div>
          <v-btn color="green">Ready</v-btn>
        </v-card>



      </div>

      <v-text-field :disabled="this.isButtonDisabled" suffix="ENTER" variant="outlined" label="type word."
                    :rules="[true ]"
                    @keydown.enter.prevent="this.fetchNewWordIfCorrect(guessedWord)"
                    v-model="guessedWord"></v-text-field>
      <v-btn @click="this.fetchNewWordIfCorrect(guessedWord)">submit</v-btn>
    </v-col>
    <v-col><h1>letters: {{ this.letters }}</h1></v-col>
  </v-row>
  <v-btn @click="this.joinSocketRoom">join</v-btn>
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
    messages: [{username: "username",message: "new message"}],
    socket: null,

    // Toast
    toastMsg: "no msg",
    isToast: false,

  }),

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
    this.gameModeSettings = await this.fetchGameModeSettings(this.gameID);
    await this.joinSocketRoom(this.gameID,this.username)
    await this.updateSettings();
    console.log(this.roomSettings.playersName);
   // await this.leaveRoom();


    // join room


    this.socket.on('newMessage', (data) => {
      this.messages.push(data);
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

    async joinSocketRoom(roomName,username) {
      // todo: check if disconnect is correct
      //await this.socket.emit('disconnectFromAllRooms');
      await this.socket.emit('joinRoom', roomName, username);
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

    checkWord: async function (word) {
      if (word.includes(this.letters))
        if (await gameModeMethods.checkWord(word, this.letters)) {
          this.sendMessageToAll("guessed correct");
          return true;
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

    async showToast(message) {
      this.toastMsg = await message;
      this.isToast = !this.isToast;
    },

    async leaveRoom() {
      try {
        // Emit the socket event to disconnect the user from the room
        await this.socket.emit('disconnectUserFromRoom', this.gameID, this.username);
        console.log(`Successfully left room ${this.roomName}`);
      } catch (error) {
        console.error('Error leaving room:', error);
        // Handle the error appropriately (e.g., display an error message to the user)
      }
    }


  },

}
</script>
