<script setup>
import ConfettiExplosion from "vue-confetti-explosion";
</script>

<template>

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


  <v-card v-if="this.overlayOn" class="pa-4">
    <confetti-explosion></confetti-explosion>
    <v-card-title class="ma-4 d-flex justify-center">Winner</v-card-title>
    <h1 class="d-flex justify-center"><b>{{ this.winnersUsername + '  ' }}</b>is Winner</h1>
    <h1 style="font-size: 60px" class="d-flex justify-center">{{ this.getPlayerScore(this.winnersUsername) }}</h1>
  </v-card>


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

  <v-card color="#3b3d4b">
    <v-btn color="black" class="ma-1" @click="this.leaveRoom">Lroom</v-btn>
    <v-btn @click="this.startTimer();" class="ma-2" color="black">STtimer</v-btn>
    <v-btn @click="forceStopAndResetTimer();" class="ma-2" color="black">S Ptimer</v-btn>
    <v-btn color="black" @click="testConnection()" class="ma-2">Tsend</v-btn>
    <v-btn color="black" @click="this.looseLife()" class="ma-2">LLife</v-btn>

    {{ this.timer }} {{ this.isCurrentPlayersTurn }}
    <h1 class="d-flex justify-center">GET READY!</h1>
    <div class="d-flex justify-center">
      <div class="" v-for="user in this.roomSettings.playersName" :key="user">
        <div class="ma-2 ml-4 mr-4 ">

          <div class="d-flex justify-center">
            <div class="ma-1" v-for="heartIndex in getPlayerLife(user)">
              <v-img width="30"
                     src="https://cdn.discordapp.com/attachments/902618947759788043/1225908018621710408/hp.png?ex=6622d6cf&is=661061cf&hm=658ca57b5475bd85bc5d8a8e78d4e5d5d3b93f31f8e59982a818804c40f28635&"></v-img>
            </div>
          </div>

          <div class="justify-center d-flex">
            <ConfettiExplosion :particleCount="20" :force="0.01"/>
            <v-avatar class="d-flex justify-center"
                      :class="{ 'outlineTurn': this.currentPlayerName === user }"
                      image="https://cdn.discordapp.com/avatars/718124223347818497/1d03ebf4cf9d399835133ba85edbbe7a.webp?size=80"
                      size="70">
            </v-avatar>

          </div>

          <h1 class="d-flex justify-center ma-2">{{ this.getPlayerScore(user) }}</h1>
          <p class="d-flex justify-center">{{ user }}</p>
          <div class="d-flex justify-center">
            <v-btn variant="outlined" :disabled="true" v-if="!isPlayerReadyStatus(user)" color="green">READY</v-btn>
            <v-btn v-if="isPlayerReadyStatus(user)" color="green">READY</v-btn>
          </div>

        </div>


      </div>
    </div>

    <div class="justify-center d-flex ma-2">


    </div>

    <div class="justify-end d-flex ma-5">
      <v-btn v-if="!this.isPlayerReady" @click="this.setNotReady()" variant="outlined"
             class="justify-center d-flex mr-1" color="red">set Not Ready
      </v-btn>
      <v-btn v-if="this.isPlayerReady" @click="this.setReady()" class="justify-center d-flex mr-1" color="green">set
        Ready
      </v-btn>
      <v-btn v-if="this.isPlayerHost && !this.isGameInProgress" :disabled="!this.isAllPlayersReady"
             @click="this.startGame()" color="red">Start Game
      </v-btn>
    </div>
  </v-card>

  <div class="ma-4">

    <h1 class="d-flex justify-center">Guess word</h1>
    <div class="d-flex justify-center">
      <v-progress-circular color="red" class="d-flex justify-center" :model-value="progressValue" :size="80" :width="7">
        <h1 class="d-flex justify-center">{{ this.letters }}</h1>
      </v-progress-circular>
    </div>


    <div class="ma-15 d-flex justify-center">
      <v-text-field v-model="guessedWord" :disabled="!this.isCurrentPlayersTurn" suffix="ENT"
                    @keydown.enter.prevent="checkWord(guessedWord)"
                    hint="write a word" placeholder="write a word"></v-text-field>
      <v-btn @click="checkWord(guessedWord)" class="ma-2" color="green">Guess</v-btn>

    </div>


  </div>
</template>

<script>

import {user} from "../../handelers/UserHandeler";
import axios from "axios";
import io from "socket.io-client";
import {mapGetters} from "vuex";


export default {
  props: ['gameID'],
  data: () => ({
    playersData: null,
    playersHp: 0,
    allPlayers: [], // all players in game
    winnersUsername: "",

    gameModeSettings: null,
    roomSettings: "nullString",
    letters: "xx",
    overlayOn: false,
    isButtonDisabled: false,
    // player that starts this turn
    RoomData: null,

    isPlayerReady: true,
    isPlayerHost: false,
    isCurrentPlayersTurn: false,
    currentPlayerName: "",
    playersReady: [],
    isAllPlayersReady: false,

    guessedWord: "",
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
    //timer
    serverTimer: 0, // Start the timer at 3 seconds
    timer: 0, // Start the timer at 3 seconds
    timerInterval: null,
    progressValue: 100,
    isTimerStopped: false,
    isGameInProgress: false,

  }),
  beforeUnmount() {
    // clearInterval(this.timerInterval);
  },

  async unmounted() {
    if (this.isPlayerHost) {
      clearInterval(this.timerInterval);
    }
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
    this.playersHp = this.roomSettings.lives;
    this.serverTimer = parseInt(this.roomSettings.timer.slice(0, -1))
    this.timer = this.serverTimer;
    this.gameModeSettings = await this.fetchGameModeSettings(this.gameID);

    await this.updateSettings();
    await this.joinSocketRoom(this.gameID, this.username)
    this.allPlayers = this.setAllPlayers(this.roomSettings, this.playersHp);
    this.checkHost();


    this.socket.on('newMessage', async (username, message) => {
      this.messages.push({username: username, message: message});
      this.roomSettings = await this.fetchRoomSettings(this.gameID);
    });

    this.socket.on('letters', (letters) => {
      this.letters = letters;
    });

    this.socket.on('getRoomData', (RoomData) => {
      this.RoomData = RoomData;
    });

    this.socket.on('fetchFirstPlayer', async (firstPlayer) => {
      this.overlayOn = false;
      this.gameModeSettings = await this.fetchGameModeSettings(this.gameID);
      this.playersHp = this.roomSettings.lives;
      this.allPlayers = this.setAllPlayers(this.roomSettings, this.playersHp);

      await this.startTurn(firstPlayer);
    });

    this.socket.on('receiveLetters', (letters) => {
      this.letters = letters;
    });

    this.socket.on('getNextPlayer', async (nextPlayer) => {
      await this.startTurn(nextPlayer);

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
      this.progressValue = (this.timer / this.roomSettings.timer.slice(0, -1)) * 100;
    });

    this.socket.on('getResetTimer', () => {
      console.log("i stoped time")
    });

    this.socket.on('fetchPlayerWin', (winnersName) => {
      this.isGameInProgress = false;
      this.winnersUsername = winnersName;
      this.overlayOn = true;
      this.forceStopAndResetTimer();
      this.gameModeSettings = this.fetchGameModeSettings(this.gameID);


    });

    this.socket.on('fetchScore', (username, points) => {
      console.log("recived points", username)
      this.getPoints(username, points)
    });

    this.socket.on('getLifeInfo', (player, playerHp) => {
      this.checkEliminatedPlayer(player, playerHp)
    });

    this.socket.on('isWordCorrect', (isWordCorrect) => {
      if (isWordCorrect) {

        this.socket.emit('timerUpdate', this.gameID, parseInt(this.roomSettings.timer.slice(0, -1))); //reset time back to 10
        this.forceStopAndResetTimer();
        if (this.isCurrentPlayersTurn) {

          this.socket.emit('onPointsReceived', this.gameID, this.username, 20);
        }
        //this.socket.emit('resetTimer');

        this.nextTurn();
      } else {

        this.showToast("incorrect word")
      }
    });

    this.socket.on('getTestConnection', () => {
      console.log("you have tested connection");
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
      if (!this.roomSettings.playersName.includes(this.username)) {
        this.roomSettings.playersName.push(this.username);
      }
      await axios.post("/api/room/update-room", {roomID: this.gameID, data: this.roomSettings});
    },

    async joinSocketRoom(roomName, username) {

      await this.socket.emit('userLeft', this.username, this.gameID, "is here finally here");
      await this.socket.emit('joinRoom', roomName, username);
    },

    randomFirstPlayer() {
      this.socket.emit('pickRandomFirstPlayer', this.gameID, this.roomSettings.playersName);
    },

    async startGame() {
      this.isGameInProgress = true;
      this.randomFirstPlayer();
    },

    async startTurn(player) {
      this.isCurrentPlayersTurn = player === this.username;
      this.currentPlayerName = player;

      if (this.isCurrentPlayersTurn) {
        await this.getLetters()
        this.startTimer();
      }
    },

    async getLetters() {
      this.socket.emit('getLetters', this.gameID, this.gameModeSettings.words);
    },

    startTimer() {
      console.log("i am time God")
      // Start a new timer interval that updates every second
      this.timerInterval = setInterval(() => {


        // Decrement timer by 1 second
        console.log("i am time master:", this.timer)
        if (this.timer > 0) {
          this.timer--;
          this.socket.emit('timerUpdate', this.gameID, this.timer);
          this.progressValue = (this.timer / this.roomSettings.timer.slice(0, -1)) * 100;

        } else {

          this.looseLife();
          clearInterval(this.timerInterval); // Stop the timer interval
          this.timer = parseInt(this.roomSettings.timer.slice(0, -1))
          this.socket.emit('timerUpdate', this.gameID, this.timer); //reset time back to 10
          this.nextTurn();

        }
      }, 1000);
      this.isTimerStopped = !this.isTimerStopped
    },

    looseLife() {
      this.playersHp -= 1;
      this.socket.emit('onLooseLife', this.gameID, this.username, this.playersHp);
    },


    checkEliminatedPlayer(playersName, playerHp) {
      if (playerHp < 1) {
        this.playerDead(playersName);
      }
      for (let player of this.allPlayers) {
        if (player.username === playersName) {
          player.life -= 1;
        }
      }
    },

    async playerDead(playersName) {
      await this.socket.emit('userLeft', this.username, this.gameID, "is Dead");
      if (this.checkLastManStanding()) {
        console.log("i am last man standing and i won")
        await this.socket.emit('userLeft', this.username, this.gameID, " is winner");
        await this.socket.emit('onPlayerWin', this.gameID, this.username);

      }
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
      if (word.includes(this.letters)) {
        this.socket.emit('checkCorrectWord', this.gameID, word, this.gameModeSettings.name);
      }
      this.clearText();
    },

    clearText() {
      this.guessedWord = "";
    },

    nextTurn() {
      if (this.isCurrentPlayersTurn) {
        this.socket.emit('nextPlayer', this.gameID, this.username, this.roomSettings.playersName);
      }
    },

    async showToast(message) {
      this.toastMsg = message;
      this.isToast = !this.isToast;
    },

    async leaveRoom() {
      try {
        this.roomSettings.playersName = this.roomSettings.playersName.filter(e => e !== this.username);
        await this.socket.emit('disconnectUserFromRoom', this.gameID, this.username);
        await this.socket.emit('userLeft', this.username, this.gameID, "left");
        // await this.socket.to(this.gameID).emit("playerLeftParty");
        console.log(`Successfully left room ${this.roomName}`);
      } catch (error) {
        console.error('Error leaving room:', error);
      }
    },

    checkHost() {
      if (this.roomSettings.host === this.username) {
        this.isPlayerHost = !this.isPlayerHost;
      }
    },

    async setReady() {
      this.isPlayerReady = !this.isPlayerReady;
      this.playersReady.push(this.username);
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
      // todo return this.arraysAreEqual(this.this.roomSettings.playersName, this.playersReady)
    },

    checkLastManStanding() {
      // Filter players with life greater than 0
      const alivePlayers = this.allPlayers.filter(player => player.life > 0);

      // If there's only one player alive and it's the current user, return true
      return alivePlayers.length === 1 && alivePlayers[0].username === this.username;
    },

    arraysAreEqual(arr1, arr2) {
      // todo fix
      return arr1.length === arr2.length;

    },

    setAllPlayers(data, life) {
      let tempPlayers = [];

      Object.keys(data.playersName).forEach(username => {
        tempPlayers.push({username: data.playersName[username], life: life, score: 0});
      });
      return tempPlayers;
    },

    forceStopAndResetTimer() {
      clearInterval(this.timerInterval);
    },

    testConnection() {
      console.log("send")
      this.socket.emit('sendTest', this.gameID);
    },
    getPlayerLife(username) {
      const player = this.allPlayers.find(player => player.username === username);
      return player ? player.life : 0; // Assuming life is the property that holds player's health
    },

    getPlayerScore(username) {
      const player = this.allPlayers.find(player => player.username === username);
      return player ? player.score : 0; // Assuming life is the property that holds player's health
    },

    getPoints(username, points) {
      const playerIndex = this.allPlayers.findIndex(player => player.username === username);
      if (playerIndex !== -1) {
        this.allPlayers[playerIndex].score += points;

        return true;
      }
      return false;
    }
  }


}
</script>

<style>
.outlineTurn {
  outline: 5px solid #ff0f0f; /* Adjust the color and width as needed */
}
</style>
