<script setup>
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faHouse} from "@fortawesome/free-solid-svg-icons/faHouse";

</script>

<template>

  <v-container>
    <v-row>
      <v-col>
        <v-img width="500" src="../src/assets/bomb_icon.png"></v-img>
      </v-col>

      <v-col>
        <h1>Login</h1>
        <h2>Username</h2>
        <v-text-field v-model="this.username" hint="Username"></v-text-field>
        <h2>Password</h2>
        <v-text-field v-model="this.password" hint="Password"></v-text-field>
      </v-col>
    </v-row>


    <v-row>
      <v-col>
        <v-img width="500" src="../src/assets/bomb_icon.png"></v-img>
      </v-col>

      <v-col>
        <h1>Register</h1>
        <h2>Username</h2>
        <v-text-field v-model="this.username" hint="Username"></v-text-field>
        <h2>email</h2>
        <v-text-field v-model="this.mail" hint="Username"></v-text-field>
        <h2>Password</h2>
        <v-text-field v-model="this.password" hint="Password"></v-text-field>
      </v-col>
    </v-row>
<v-btn @click="this.onDebug()" color="black" >debug2</v-btn>

    <div class="d-flex justify-center">
      <v-btn @click="this.onLogin">login</v-btn>
      <div class="pa-3"></div>
      <v-btn @click="this.onRegister">register</v-btn>
    </div>
    <h1>{{ this.result }}</h1>

  </v-container>
</template>

<script>
import axios from "axios";
import router from "@/router";
import {user} from '../../handelers/UserHandeler'
export default {
  data: () => ({
    username: "yohni",
    mail: "",
    password: "yohni",
    result: "",
    error: "",
  }),
  async mounted() {
  },


  methods: {
    onLogin() {
      try {
        axios
            .post("/api/login", {username: this.username, password: this.password})
            .then(async (response) => {
              if (response.data.result) {
                await user.updateUserData(response.data.result);
                console.log(await user.getUserData());
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
            .post("/api/register", {username: this.username, mail: this.mail, password: this.password})
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
    onDebug()
    {
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
};
</script>

<style scoped>
</style>