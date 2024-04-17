<script setup>
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faHouse} from "@fortawesome/free-solid-svg-icons/faHouse";

</script>

<template>

  <v-container>
    <v-row v-if="this.isLogin">
      <v-col>
        <v-img width="500" src="../src/assets/bomb_icon.png"></v-img>
      </v-col>

      <v-col>
        <h1>Login</h1>
        <h2>Username</h2>
        <v-text-field v-model="this.username" hint="Username"></v-text-field>
        <h2>Password</h2>
        <v-text-field v-model="this.password" hint="Password"></v-text-field>
        <div class="d-flex justify-end">
          <v-btn class="mr-3" variant="outlined" @click="this.isLogin = !this.isLogin">register</v-btn>
          <v-btn @click="this.onLogin">login</v-btn>
        </div>
      </v-col>
    </v-row>


    <v-row v-if="!this.isLogin">


      <v-col>
        <h1>Register</h1>
        <h2>Username</h2>
        <v-text-field v-model="this.username" hint="Username"></v-text-field>
        <h2>email</h2>
        <v-text-field v-model="this.mail" hint="Username"></v-text-field>
        <h2>Password</h2>
        <v-text-field v-model="this.password" hint="Password"></v-text-field>
        <div class="d-flex justify-end">
          <v-btn class="mr-3" variant="outlined" @click="this.isLogin = !this.isLogin">Login</v-btn>
          <v-btn @click="this.onRegister">register</v-btn>
        </div>
      </v-col>

      <v-col class="d-flex justify-center">
        <v-img width="500" src="../src/assets/bomb_icon.png"></v-img>
      </v-col>
    </v-row>


  </v-container>
</template>

<script>
import axios from "axios";
import router from "@/router";
import {user} from '../../handelers/UserHandeler'

export default {
  methods: {
    onLogin() {
      try {
        axios
            .post("/api/login", {username: this.username, password: this.password})
            .then(async (response) => {
              if (response.data.result) {
                await user.updateUserData(response.data.result);
                await router.push("/");
              } else {

                this.error = response.data.error;
              }
            }, (error) => {
              throw error || new Error(`Request failed`);
            })
      } catch (error) {
        // Consider implementing your own error handling logic here
        console.error(error);
      }
    },


    onRegister() {
      try {
        axios
            .post("/api/register", {
              username: this.username,
              mail: this.mail,
              password: this.password,
              profilePicture: this.pickRandomProfilePicture(),

            })
            .then((response) => {
              if (response.data.result) {
                router.push("/")
              }


            }, (error) => {
              throw error || new Error(`Request failed`);
            })
      } catch (error) {
        // Consider implementing your own error handling logic here
        console.error(error);
      }
    },

    pickRandomProfilePicture() {
      return this.profilePics[Math.floor(Math.random() * this.profilePics.length)]
    },

    onDebug() {
      try {
        axios
            .post("/api/add-gamemode", {name: "test", mail: "newmail"})
            .then((response) => {
              console.log(response);

            }, (error) => {
              throw error || new Error(`Request failed`);
            })
      } catch (error) {
        // Consider implementing your own error handling logic here
        console.error(error);
      }
    }


  },
  data: () => ({
    username: "yohni",
    mail: "",
    password: "yohni",
    result: "",
    error: "",
    isLogin: true,

    //profilePics
    profilePics: ["https://cdn.discordapp.com/attachments/902618947759788043/1226461548814405632/img1.png?ex=6624da53&is=66126553&hm=463a6d8fe6625b7cb110a4bc2850e27a0d1496037fc927d690747d6ba12fe7f0&", "https://cdn.discordapp.com/attachments/902618947759788043/1226461549032640522/img2.png?ex=6624da53&is=66126553&hm=114f3fd948d58d2c4941d4bfbd792c34d791601d80ebcd2aaace36a4e118eae6&", "https://cdn.discordapp.com/attachments/902618947759788043/1226461549258866718/img3.png?ex=6624da53&is=66126553&hm=0b4702e4d72eb1e2a9617856f2d6e90013a2eb7176dc88929214be3925cff64c&", "https://cdn.discordapp.com/attachments/902618947759788043/1226461549498077214/img4.png?ex=6624da53&is=66126553&hm=0d515eb28c558cd20616ef5541f30ba29312d2861d067792a64fe202dacd19be&", "https://cdn.discordapp.com/attachments/902618947759788043/1226461567265013810/img5.png?ex=6624da58&is=66126558&hm=e5fa52ee2d4a6130668e0da580ef31b73011c9c032d9453b27c835d343f0e7e3&", "https://cdn.discordapp.com/attachments/902618947759788043/1226461567579848704/img6.png?ex=6624da58&is=66126558&hm=4a1f2fbbb6ac38dd1bc1225dfa36080c984cd5e601b723552f4ef4b4f371c307&", "https://cdn.discordapp.com/attachments/902618947759788043/1226461567906742292/img7.png?ex=6624da58&is=66126558&hm=c2bd90b22d5a9443ff175d8a60a25add7ae9f1b09f488983137508304fd068a6&", "https://cdn.discordapp.com/attachments/902618947759788043/1226461566824878200/img8.png?ex=6624da58&is=66126558&hm=2e777fbb0503e14eb847b5c8b3b53e0122f0becaaec9666e8d39665673a8f69b&", "https://cdn.discordapp.com/attachments/902618947759788043/1226461583740371024/img9.png?ex=6624da5c&is=6612655c&hm=4920a4ad13079b89ba8934de9a9180ac43a0cd6478033c4d4a57ca8920922908&", "https://cdn.discordapp.com/attachments/902618947759788043/1226461582029094933/img10.png?ex=6624da5b&is=6612655b&hm=879ef7bb8f56cc3efb075a908fe0e3a6cffb996c8e560c3af6a5a2a9ab545385&", "https://cdn.discordapp.com/attachments/902618947759788043/1226461582457045002/img11.png?ex=6624da5b&is=6612655b&hm=32c55e8b32963783b0fcab74760b0dfbe324fa861d49ac995c95a343488a47a4&", "https://cdn.discordapp.com/attachments/902618947759788043/1226461582863896608/img12.png?ex=6624da5b&is=6612655b&hm=df2e2e3450db54bf227af99295830ef65779d9260b0a576690d54970b4d895c9&"]
  }),


  async mounted() {
  },
};
</script>

<style scoped>
</style>