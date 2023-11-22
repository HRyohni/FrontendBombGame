<script setup>

</script>

<template>
  <div class="d-flex justify-center">
    <v-row class="d-inline" >
      <v-col><div class=""><div class="d-flex justify-center"><v-img height="200" width="200" class="rounded d-flex"  src="../src/assets/profile.png"> </v-img></div></div></v-col>
      <v-col><div class=""><div class="d-flex justify-center"><v-img height="200" width="200" class="rounded d-flex"  src="../src/assets/profile.png"> </v-img></div></div></v-col>
      <v-col><div class=""><div class="d-flex justify-center"><v-img height="200" width="200" class="rounded d-flex"  src="../src/assets/profile.png"> </v-img></div></div></v-col>
    </v-row>

    <v-row class="d-inline" >
        <v-col><div class=""><div class="d-flex justify-center"><v-img height="200" width="200" class="rounded d-flex"  src="../src/assets/profile.png"> </v-img></div></div></v-col>
        <v-col><div class=""><div class="d-flex justify-center">
          <h1>se</h1>
          {{ countDown }}
        </div></div></v-col>
        <v-col><div class=""><div class="d-flex justify-center"><v-img height="200" width="200" class="rounded d-flex"  src="../src/assets/profile.png"> </v-img></div></div></v-col>
      </v-row>

    <v-row class="d-inline" >
        <v-col><div class=""><div class="d-flex justify-center"><v-img height="200" width="200" class="rounded d-flex"  src="../src/assets/profile.png"> </v-img></div></div></v-col>
        <v-col><div class=""><div class="d-flex justify-center"><v-img height="200" width="200" class="rounded d-flex"  src="../src/assets/profile.png"> </v-img></div></div></v-col>
        <v-col><div class=""><div class="d-flex justify-center"><v-img height="200" width="200" class="rounded d-flex"  src="../src/assets/profile.png"> </v-img></div></div></v-col>
    </v-row>
  </div>

  <v-text-field class="d-inline" ></v-text-field>
  <v-btn @click="pauseDownTimer" >Pause</v-btn>


</template>

<script>

import axios from "axios";

export default {
  data: () => ({
    // Axios Setup
    dataServiceBaseUrl : `http://127.0.0.1:3000`,

  // timer
    countDown: 4,

  }),
  mounted() {
    this.requestWords()
    this.countDownTimer()
  },
  methods: {
    countDownTimer () {
      if (this.countDown > 0) {
        setTimeout(() => {
          this.countDown -= 1
          this.countDownTimer()
          if (this.countDown === 0) {
            this.countDown = 4;
            this.countDownTimer()
          }
        }, 1000)
      }

    },

    async requestWords() {
      const data = {
        x: 1,
        arr: [1, 2, 3],
        arr2: [1, [2], 3],
        users: [{name: 'Peter', surname: 'Griffin'}, {name: 'Thomas', surname: 'Anderson'}],
      };

      await axios.post(this.dataServiceBaseUrl + "/api/getWords", data,
          {headers: {'content-type': 'application/x-www-form-urlencoded'}}
      );

      // axios.get(this.dataServiceBaseUrl + "/api/getWords")
      //     .then(response => {
      //       // Handle the successful response
      //       this.posts = response.data; // Assign the received data to the posts array
      //       console.log(response.data);
      //     })
      //     .catch(error => {
      //       // Handle any errors that occur during the request
      //       console.error('There was an error!', error);
      //     });


    },

    pauseDownTimer()
    {

    }
  },


};
</script>

<style scoped>
</style>