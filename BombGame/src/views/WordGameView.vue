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
      <h4>{{ toastMsg }}</h4>
    </template>
  </v-snackbar>




  <v-navigation-drawer :width="292" color="#332941" location="right">
    <v-list-item title="Chat" subtitle="dont be rude  ❤ ️"></v-list-item>
    <v-divider></v-divider>


    <div>

      <h3 class="ma-3">chat</h3>
      <v-card class="pa-2 " height="500" color="#332941">

        <ul>
          <li class="overflow-x-auto" v-for="(msg, index) in messages" :key="index">
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


  <!--    <v-btn color="black" class="ma-1" @click="leaveRoom">Lroom</v-btn>-->
  <!--    <v-btn @click="startTimer();" class="ma-2" color="black">STtimer</v-btn>-->
  <!--    <v-btn @click="forceStopAndResetTimer();" class="ma-2" color="black">S Ptimer</v-btn>-->
  <!--    <v-btn color="black" @click="testConnection()" class="ma-2">Tsend</v-btn>-->
  <!--    <v-btn color="black" @click="looseLife()" class="ma-2">LLife</v-btn>-->

  <!--    {{ timer }} {{ isCurrentPlayersTurn }}-->
  <div class="justify-end d-flex ma-5">
    <v-btn v-if="!isPlayerReady" @click="setNotReady()" variant="outlined"
           class="justify-center d-flex mr-1" color="red">set Not Ready
    </v-btn>
    <v-btn v-if="isPlayerReady" @click="setReady()" class="justify-center d-flex mr-1" color="green">set
      Ready
    </v-btn>
    <v-btn v-if="isPlayerHost && !isGameInProgress" :disabled="!isAllPlayersReady"
           @click="startGame()" color="red">Start Game
    </v-btn>
  </div>

<div class="justify-center d-flex">
  <v-row>
    <v-col v-for="user in roomSettings.playersName" :key="user" cols="12" sm="6" md="4" lg="3">
      <div class="ma-2 ml-4 mr-4">
        <div class="d-flex justify-center">
          <div class="ma-1" v-for="heartIndex in getPlayerLife(user)">
            <v-img width="30" src="/hp.png"></v-img>
          </div>
        </div>

        <div class="justify-center d-flex">
          <ConfettiExplosion :particleCount="20" :force="0.01"/>
          <v-avatar class="d-flex justify-center d-sm-none d-md-flex " :class="{ 'outlineTurn': currentPlayerName === user }" size="70">
            <template v-if="true">
              <v-img :src="'/'+setProfilePicture(user)" width="70" height="70"></v-img>
            </template>
            <template v-else>
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </template>
          </v-avatar>
        </div>

        <h1 class="d-flex justify-center ma-2">{{ getPlayerScore(user) }}</h1>
        <p class="d-flex justify-center">{{ user }}</p>
        <div class="d-flex justify-center">
          <v-btn variant="outlined" :disabled="!isPlayerReadyStatus(user)" color="green">READY</v-btn>
        </div>
      </div>
    </v-col>
  </v-row>
</div>



  <div class="ma-4">

    <v-card :color="playersData.backgroundColor" v-if="overlayOn" class="pa-4">
      <confetti-explosion :colors="[playersData.confettiColor]"></confetti-explosion>
      <h1 class="d-flex justify-center"><b>{{ winnersUsername + " " }}</b></h1>
      <h1 class="d-flex justify-center">Wins</h1>
      <h1 style="font-size: 60px" class="d-flex justify-center">{{ getPlayerScore(winnersUsername) }}</h1>
      <h4 class="d-flex justify-center">score</h4>
    </v-card>

    <h1 v-if="gameModeSettings" class="d-flex justify-center">{{gameModeSettings.name}}</h1>
    <div class="d-flex justify-center">
      <v-progress-circular color="red" class="d-flex justify-center" :model-value="progressValue" :size="80" :width="7">
        <h1 class="d-flex justify-center">{{ letters }}</h1>
      </v-progress-circular>
    </div>
    <div class="d-flex justify-center">
      <h3 v-if="isCurrentPlayersTurn">Your Turn</h3>
    </div>



    <div class="ma-8">
      <v-row>
        <v-col  class="justify-center d-flex">
          <v-text-field  :focused="true" :single-line="true" class="justify-center" v-model="guessedWord"  suffix="ENT"
                        @keydown.enter.prevent="checkWord(guessedWord)"
                        hint="write a word" placeholder="Guess word"></v-text-field>
        </v-col>
      </v-row>

      <v-btn @click="checkWord(guessedWord)" class="ma-2" color="green">Guess</v-btn>

    </div>


  </div>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
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
    playerProfilePictures: [],

  }),
  beforeUnmount() {
     clearInterval(this.timerInterval);
     this.forceStopAndResetTimer()
  },

  async unmounted() {
    if (this.isPlayerHost) {
      clearInterval(this.timerInterval);
    }
    try {
      // Clean up any resources or subscriptions before the component is destroyed
      await this.leaveRoom();
    } catch (error) {
      console.error('Error during component destruction:', error);
    }
  },

  async mounted() {
    this.socket = io("https://backendbombgane.onrender.com"); // Connect to the Socket.IO server

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


    this.roomSettings.playersName.forEach(async (player) => {
      const profilePicture = await this.getUserProfilePicture(player);
      this.playerProfilePictures.push({username: player, profilePicture: profilePicture});
    });


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
      this.$forceUpdate();
      this.roomSettings = await this.fetchRoomSettings(this.gameID);
      this.playerProfilePictures = []
      this.roomSettings.playersName.forEach(async (player) => {
        const profilePicture = await this.getUserProfilePicture(player);
        this.playerProfilePictures.push({username: player, profilePicture: profilePicture});
      });
    });

    this.socket.on('playerLeftParty', async () => {
      this.roomSettings = await this.fetchRoomSettings(this.gameID);
    });

    this.socket.on('timerGetUpdate', (timerValue) => {
      this.timer = timerValue;
      this.progressValue = (this.timer / this.roomSettings.timer.slice(0, -1)) * 100;
    });

    this.socket.on('getResetTimer', () => {
    });

    this.socket.on('fetchPlayerWin', (winnersName) => {
      this.savePoints(this.username);
      this.isGameInProgress = false;
      this.winnersUsername = winnersName;
      this.overlayOn = true;
      this.forceStopAndResetTimer();
      this.gameModeSettings = this.fetchGameModeSettings(this.gameID);


    });

    this.socket.on('fetchScore', (username, points) => {
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
        const response = await axios.get('https://backendbombgane.onrender.com/api/room/fetch-room/' + roomID);
        return response.data;
      } catch (error) {
        console.error(error);
        return null; // Return null or handle the error as per your requirement
      }
    },

    async fetchGameModeSettings(GameModeName) {
      try {
        const response = await axios.get('https://backendbombgane.onrender.com/api/gameMode/' + GameModeName);
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
      await axios.post("https://backendbombgane.onrender.com/api/room/update-room", {
        roomID: this.gameID,
        data: this.roomSettings
      });
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
      this.timerInterval = setInterval(() => {


        // Decrement timer by 1 second
        console.log("i start timer", this.timer)
        if (this.timer > 0) {
          this.timer--;
          this.socket.emit('timerUpdate', this.gameID, this.timer);
          this.progressValue = (this.timer / this.roomSettings.timer.slice(0, -1)) * 100;

        } else {

          this.looseLife();
          clearInterval(this.timerInterval); // Stop the timer interval
          this.timer = parseInt(this.roomSettings.timer.slice(0, -1))
          this.socket.emit('timerUpdate', this.gameID, this.timer); //reset time back to 10
          this.guessedWord = ""
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

      if (word.includes(this.letters) && this.isCurrentPlayersTurn) {
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
      this.playersReady.push(player);
    },

    async setPlayerNotReady(player) {

      this.playersReady = this.playersReady.filter(p => p !== player);
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
    },

    savePoints(username) {
      const playerIndex = this.allPlayers.findIndex(player => player.username === username);
      if (playerIndex !== -1) {
        const player = this.allPlayers[playerIndex];
        player.score = this.getPlayerScore(username)
        this.socket.emit('savePoints', player);
        return true;
      }
      return false;
    },

    async getUserProfilePicture(username) {
      try {
        const response = await axios.get(`https://backendbombgane.onrender.com/api/user/profilePicture/${username}`);

        return response.data;
      } catch (error) {
        console.error('Error fetching profile picture:', error);
        return null;
      }
    },

    setProfilePicture(user) {
      try {
        return this.playerProfilePictures.find(item => item.username === user).profilePicture;
      } catch (e) {
      }
    }
  },


}
</script>

<style>
.outlineTurn {
  outline: 5px solid #ff0f0f; /* Adjust the color and width as needed */
}
</style>
