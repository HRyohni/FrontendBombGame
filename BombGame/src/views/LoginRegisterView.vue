<script setup>
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faHouse} from "@fortawesome/free-solid-svg-icons/faHouse";
</script>

<template>
  <v-container>
    <v-row v-if="isLogin">
      <v-col>
        <v-img width="500" src="/bomb_icon.png"></v-img>
      </v-col>

      <v-col>
        <h1>Login</h1>
        <h2>Username</h2>
        <v-text-field v-model="username" hint="Username"></v-text-field>
        <h2>Password</h2>
        <v-text-field type="password" v-model="password" hint="Password"></v-text-field>
        <div class="d-flex justify-end">
          <v-btn class="mr-3" variant="outlined" @click="isLogin = !isLogin">register</v-btn>
          <v-btn @click="onLogin">login</v-btn>
        </div>
      </v-col>
    </v-row>


    <v-row v-if="!isLogin">


      <v-col>
        <h1>Register</h1>
        <h2>Username</h2>
        <v-text-field v-model="username" hint="Username"></v-text-field>
        <h2>email</h2>
        <v-text-field v-model="mail" hint="Username"></v-text-field>
        <h2>Password</h2>
        <v-text-field v-model="password" type="password" hint="Password"></v-text-field>
        <div class="d-flex justify-end">
          <v-btn class="mr-3" variant="outlined" @click="isLogin = !isLogin">Login</v-btn>
          <v-btn @click="onRegister">register</v-btn>
        </div>
      </v-col>

      <v-col class="d-flex justify-center">
          <v-img width="500" src="/bomb_icon.png"></v-img>
      </v-col>
    </v-row>


  </v-container>
</template>

<script>
import axios from "axios";
import router from "@/router";
import {user} from '../../handelers/UserHandeler'

export default {
  data: () => ({
    username: "",
    mail: "",
    password: "",
    result: "",
    error: "",
    isLogin: true,
    //profilePics
    profilePics: ["img1.png", "img2.png", "img3.png", "img4.png", "img5.png", "img6.png", "img7.png", "img8.png", "img9.png", "img10.png", "img11.png"]

  }),
  async mounted() {

  },
  methods: {
    async onLogin() {
      try {
        const response = await axios.post("https://backendbombgane.onrender.com/api/login", {
          username: this.username,
          password: this.password
        });
        const token = response.data.token; // Assuming your API returns a JWT token

        localStorage.setItem('token', token); // Store the token securely

        // Update user data in Vuex store
        await user.updateUserData(response.data.user);

        await router.push("/");
      } catch (error) {
        // Handle login errors
        console.error(error);
      }
    },



    onRegister() {
      try {
        axios
            .post("https://backendbombgane.onrender.com/api/register", {
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
            .post("https://backendbombgane.onrender.com/api/add-gamemode", {name: "test", mail: "newmail"})
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

};
</script>

<style scoped>
</style>