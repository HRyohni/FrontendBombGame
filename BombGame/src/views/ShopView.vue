<script setup>
import ConfettiExplosion from "vue-confetti-explosion";
</script>

<template>

  <v-row>
    <v-col>


      <v-card class="pa-2">
        <div class="d-flex align-center justify-end ">
          <div class="d-flex">
            <h1 class="mr-1">{{ this.money }} </h1>
            <v-img src="../src/assets/coin.png" style="height: 2em; width: 3em"></v-img>
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
        <v-card  color="#065690" elevation="0" class="ma-10 pa-10">

          <v-window v-model="tab">
            <v-window-item value="one">
              <v-row class="d-flex justify-center">

                <div v-for="profile in this.profilePics">
                  <v-col cols="50">
                    <v-card elevation="12" width="300px" color="#0475c2">
                      <div class="pa-2  d-flex justify-center">
                        <v-img
                            :src="profile"></v-img>
                      </div>
                      <v-card color="primary" class="justify-center d-flex pa-3">
                        <v-btn class="h-auto w-100 pa-4" color="red">
                          <h1 class="mr-2">1000</h1>
                          <v-img
                              @click="buyBackground(profile)"
                              class="w-75" src="../src/assets/coin.png"></v-img>
                        </v-btn>

                      </v-card>
                    </v-card>
                  </v-col>
                </div>

              </v-row>

            </v-window-item>

            <v-window-item value="two">
              <v-row class="d-flex justify-center">


                <v-card color="white" style="" elevation="12" class="ma-2 pa-3" width="50%">
                  <v-row>
                    <v-col class="pt-4 pl-4 pr-4 pb-16">
                      <v-card min-width="200px" :color="this.backgroundColor" width="100%" height="100%">
                        <h1 class="d-flex justify-center">{{ this.userData.username }}</h1>
                        <h2 class="justify-center d-flex">Wins</h2>
                        <ConfettiExplosion :colors="[confettiColor]" v-if="visible"/>
                      </v-card>
                      <v-btn class="mt-2" @click="explode" :color="confettiColor">Explode</v-btn>


                    </v-col>
                    <v-col>

                      <v-card-title class="d-flex justify-space-evenly">
                        <h3>Confetti Color</h3>
                        <h3>background Color</h3>
                      </v-card-title>
                      <div class="d-flex justify-center">
                        <v-color-picker class="ma-2" elevation="10" v-model="this.confettiColor"></v-color-picker>
                        <v-color-picker class="ma-2" elevation="10" v-model="this.backgroundColor"></v-color-picker>
                      </div>
                      <v-btn class="ma-3 " color="red">
                        <h3 class="">1000</h3>
                        <v-img
                            @click="buyConfetti()"
                            class="w-75" src="../src/assets/coin.png"></v-img>
                      </v-btn>
                    </v-col>
                  </v-row>

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
    profilePics: ["https://cdn.discordapp.com/attachments/902618947759788043/1226461548814405632/img1.png?ex=6624da53&is=66126553&hm=463a6d8fe6625b7cb110a4bc2850e27a0d1496037fc927d690747d6ba12fe7f0&", "https://cdn.discordapp.com/attachments/902618947759788043/1226461549032640522/img2.png?ex=6624da53&is=66126553&hm=114f3fd948d58d2c4941d4bfbd792c34d791601d80ebcd2aaace36a4e118eae6&", "https://cdn.discordapp.com/attachments/902618947759788043/1226461549258866718/img3.png?ex=6624da53&is=66126553&hm=0b4702e4d72eb1e2a9617856f2d6e90013a2eb7176dc88929214be3925cff64c&", "https://cdn.discordapp.com/attachments/902618947759788043/1226461549498077214/img4.png?ex=6624da53&is=66126553&hm=0d515eb28c558cd20616ef5541f30ba29312d2861d067792a64fe202dacd19be&", "https://cdn.discordapp.com/attachments/902618947759788043/1226461567265013810/img5.png?ex=6624da58&is=66126558&hm=e5fa52ee2d4a6130668e0da580ef31b73011c9c032d9453b27c835d343f0e7e3&", "https://cdn.discordapp.com/attachments/902618947759788043/1226461567579848704/img6.png?ex=6624da58&is=66126558&hm=4a1f2fbbb6ac38dd1bc1225dfa36080c984cd5e601b723552f4ef4b4f371c307&", "https://cdn.discordapp.com/attachments/902618947759788043/1226461567906742292/img7.png?ex=6624da58&is=66126558&hm=c2bd90b22d5a9443ff175d8a60a25add7ae9f1b09f488983137508304fd068a6&", "https://cdn.discordapp.com/attachments/902618947759788043/1226461566824878200/img8.png?ex=6624da58&is=66126558&hm=2e777fbb0503e14eb847b5c8b3b53e0122f0becaaec9666e8d39665673a8f69b&", "https://cdn.discordapp.com/attachments/902618947759788043/1226461583740371024/img9.png?ex=6624da5c&is=6612655c&hm=4920a4ad13079b89ba8934de9a9180ac43a0cd6478033c4d4a57ca8920922908&", "https://cdn.discordapp.com/attachments/902618947759788043/1226461582029094933/img10.png?ex=6624da5b&is=6612655b&hm=879ef7bb8f56cc3efb075a908fe0e3a6cffb996c8e560c3af6a5a2a9ab545385&", "https://cdn.discordapp.com/attachments/902618947759788043/1226461582457045002/img11.png?ex=6624da5b&is=6612655b&hm=32c55e8b32963783b0fcab74760b0dfbe324fa861d49ac995c95a343488a47a4&", "https://cdn.discordapp.com/attachments/902618947759788043/1226461582863896608/img12.png?ex=6624da5b&is=6612655b&hm=df2e2e3450db54bf227af99295830ef65779d9260b0a576690d54970b4d895c9&"]
  }),
  async mounted() {

    this.socket = io("http://localhost:3000");
    this.userData = await this.fetchUserData();

    console.log(this.userData);

    await this.fetchUserMoney();


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
      if (this.money >= 1000) {
        this.money -= 1000;

        this.userData.money = this.money;
        this.userData.profilePicture = profilePicture;

        user.updateUserData(this.userData);

        console.log("money wasted")

        this.socket.emit('updateProfilePicture', this.userData.username, profilePicture);
        this.socket.emit('wasteMoney', this.userData.username, this.money);
        window.location.reload();
      }
    },


      buyConfetti()
      {
        console.log("test")
        if (this.money >= 1000) {
          this.money -= 1000;

          this.userData.money = this.money;
          this.userData.backgroundColor = this.backgroundColor;
          this.userData.confettiColor = this.confettiColor;
          user.updateUserData(this.userData);

          console.log("money wasted")
          this.socket.emit('updateConfetti', this.userData.username, this.confettiColor, this.backgroundColor);
          this.socket.emit('wasteMoney', this.userData.username, this.money);
          window.location.reload();
        }
      },
      async explode()
      {
        this.visible = false; // Hide the confetti
        await nextTick();
        this.visible = true; // Show the confetti again, triggering the explosion
        },


    }

  }</script>

<style>

</style>
