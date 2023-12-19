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
        <v-text-field v-model="this.username"  hint="Username" ></v-text-field>
        <h2>Password</h2>
        <v-text-field  v-model="this.password"  hint="Password"  ></v-text-field>
      </v-col>
    </v-row>


    <v-row>
      <v-col>
        <v-img width="500" src="../src/assets/bomb_icon.png"></v-img>
      </v-col>

      <v-col>
        <h1>Register</h1>
        <h2>Username</h2>
        <v-text-field v-model="this.username"  hint="Username" ></v-text-field>
        <h2>email</h2>
        <v-text-field v-model="this.mail" hint="Username" ></v-text-field>
        <h2>Password</h2>
        <v-text-field  v-model="this.password"  hint="Password"  ></v-text-field>
      </v-col>
    </v-row>



    <div class="d-flex justify-center">
      <v-btn @click="this.onLogin" >login</v-btn>
      <div class="pa-3"></div>
      <v-btn @click="this.onRegister" >register</v-btn>
      <h1>{{this.result}}</h1>
    </div>
  </v-container>
</template>

<script>
import * as THREE from 'three';
import axios from "axios";


export default {
  data: () => ({
    username: "",
    mail: "",
    password: "",
    result: "",
  }),
  mounted() {

  },
  methods: {
    onLogin()
    {
      try {
        axios
            .post("/api/login", { username: this.username, password: this.password })
            .then((response) => {
              this.result = response.data.result;
            }, (error) => {
              throw error || new Error(`Request failed`);
            })
      } catch(error) {
        // Consider implementing your own error handling logic here
        console.error(error);
        alert(error.message);
      }
    },

    onRegister()
    {
      try {
        axios
            .post("/api/register", { username: this.username,mail: this.mail, password: this.password })
            .then((response) => {
              this.result = response.data.result;
            }, (error) => {
              throw error || new Error(`Request failed`);
            })
      } catch(error) {
        // Consider implementing your own error handling logic here
        console.error(error);
        alert(error.message);
      }
    },



  },
};
</script>

<style scoped>
</style>