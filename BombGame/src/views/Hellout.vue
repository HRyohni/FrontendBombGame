<script>
// imports
import axios from "axios";

export default {
  name: "App",
  components: {
    //components
  },

  data: () => ({
    username: "",
    email: "",
    password: ""
    //

  }),
  async mounted() {

  },

  methods: {

    async addData() {
      try {
        const res = await axios.post("http://localhost:3000/api/user/create", {
          username: this.username,
          email: this.email,
          password: this.password,

        }

        );
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    },

  },
};
</script>

<template>
  <v-container>
    <v-card class="pa-3">

      <v-card-text>username</v-card-text>
      <v-text-field v-model="username" ></v-text-field>

      <v-card-text>email</v-card-text>
      <v-text-field  v-model="email"></v-text-field>

      <v-card-text>password</v-card-text>
      <v-text-field  v-model="password"></v-text-field>


      <v-btn @click="addData()" class="pa-2">submit</v-btn>
    </v-card>
  </v-container>
</template>

<style scoped>

</style>