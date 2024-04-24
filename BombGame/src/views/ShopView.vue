<script setup>
import ConfettiExplosion from "vue-confetti-explosion";
</script>

<template>

  <v-row>
    <v-col>


      <v-card color="#53566B" class="pa-2">
        <div class="d-flex align-center justify-end ">
          <div class="d-flex">
            <h1 class="mr-1">{{ userData.money }} </h1>
            <v-img src="/coin.png" style="height: 2em; width: 3em"></v-img>
          </div>

        </div>
        <v-tabs
            bg-color="red"
            fixed-tabs
            v-model="tab"
        >
          <v-tab>
            Backgrounds
          </v-tab>
          <v-tab>
            konfeti
          </v-tab>


        </v-tabs>
        <v-card width="auto" color="#065690" elevation="3" class=" pa-3">

          <v-window v-model="tab">
            <v-window-item value="one">
              <v-row align="center" no-gutters="" class="d-flex justify-center">

                <div v-for="profile in profilePics">
                  <v-col>
                    <v-card elevation="12" color="#0475c2">
                      <div class="pa-2  d-flex justify-center">
                        <v-img
                            :src="profile"></v-img>
                      </div>
                      <v-card color="primary" class="justify-center d-flex pa-3">
                        <v-btn @click="buyBackground(profile)" class="h-auto w-100 pa-4" color="red">
                          <h1 class="mr-2">1000</h1>
                          <v-img

                              class="w-25" src="/coin.png"></v-img>
                        </v-btn>

                      </v-card>
                    </v-card>
                  </v-col>
                </div>

              </v-row>

            </v-window-item>

            <v-window-item value="two">
              <v-row class="d-flex justify-center">


                <v-card color="#21232B" style="" elevation="12" class="ma-2 pa-3" width="100%">
                  <v-card :color="backgroundColor" width="100%">

                    <h1 class="d-flex justify-center">{{ userData.username }}</h1>
                    <h2 class="justify-center d-flex">Wins</h2>
                    <div class="d-flex justify-space-between">
                      <ConfettiExplosion :colors="[confettiColor]" v-if="visible"/>
                      <ConfettiExplosion :colors="[confettiColor]" v-if="visible"/>
                    </div>
                    <v-btn class="ma-2" @click="explode" :color="confettiColor">Explode</v-btn>
                  </v-card>
                  <v-row>

                    <v-col>
                      <v-card-title class="d-flex justify-space-evenly">
                        <div class="text-h3">Confetti Color</div>
                      </v-card-title>
                      <div class="d-flex justify-center">
                        <v-color-picker mode="rgb" class="ma-2" elevation="10" v-model="confettiColor"></v-color-picker>
                      </div>
                    </v-col>

                    <v-col>
                      <v-card-title class="d-flex justify-space-evenly">
                        <div class="text-h3">background Color</div>
                      </v-card-title>

                      <div class="d-flex justify-center">
                        <v-color-picker mode="rgb" class="ma-2" elevation="10" v-model="backgroundColor"></v-color-picker>
                      </div>

                    </v-col>


                  </v-row>
                  <v-btn class="ma-3 " color="red">
                    <h3 class="">1000</h3>
                    <v-img
                        @click="buyConfetti()"
                        class="w-75" src="/coin.png"></v-img>
                  </v-btn>

                </v-card>

              </v-row>

            </v-window-item>


          </v-window>
        </v-card>

      </v-card>
    </v-col>

  </v-row>

</template>

<script>

import io from "socket.io-client";
import {user} from "../../handelers/UserHandeler";
import {nextTick} from "vue";

export default {


  data: () => ({
    userData: null,
    tab: null,
    socket: null,
    money: 0,
    visible: false,
    confettiColor: null,
    backgroundColor: null,
    profilePics: ["img1.png", "img2.png", "img3.png", "img4.png", "img5.png", "img6.png", "img7.png", "img8.png", "img9.png", "img10.png", "img11.png"]
  }),
  async mounted() {

    this.socket = io("https://backendbombgane.onrender.com");
    this.userData = await this.fetchUserData();


    this.socket.on('fetchUserMoney', (money) => {
      console.log("money: ", money);
      this.money = money;
    });

  },


  methods: {
    async fetchUserData() {
      return await user.getUserData();
    },

    async fetchUserMoney() {
      this.socket.emit('getMoney', this.userData.username);


    },
    buyBackground(profilePicture) {

      if (this.userData.money >= 1000) {
        this.userData.money -= 1000;

        this.userData.profilePicture = profilePicture;

        user.updateUserData(this.userData);


        this.socket.emit('updateProfilePicture', this.userData.username, profilePicture);
        this.socket.emit('wasteMoney', this.userData.username, this.userData.money);
      }
    },


    buyConfetti() {
      if (this.userData.money >= 1000) {
        this.userData.money -= 1000;

        this.userData.backgroundColor = this.backgroundColor;
        this.userData.confettiColor = this.confettiColor;
        user.updateUserData(this.userData);

        console.log("money wasted")
        this.socket.emit('updateConfetti', this.userData.username, this.confettiColor, this.backgroundColor);
        this.socket.emit('wasteMoney', this.userData.username, this.userData.money);
      }
    },
    async explode() {
      this.visible = false; // Hide the confetti
      await nextTick();
      this.visible = true; // Show the confetti again, triggering the explosion
    },


  }

}</script>

<style>

</style>
