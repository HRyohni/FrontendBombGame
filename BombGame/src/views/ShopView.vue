<script setup>
</script>

<template>

  <v-row>
    <v-col>
      <v-card>
        <v-tabs
            bg-color="red"
            fixed-tabs
            v-model="tab"
        >
          <v-tab>
            Special Offers
          </v-tab>
          <v-tab>
            Backgrounds
          </v-tab>

          <v-tab>
            konfeti
          </v-tab>
        </v-tabs>
        <v-card elevation="0" class="ma-10 pa-10">
          <v-window v-model="tab">
            <v-window-item value="one">
              <v-row>
                <v-col cols="3">

                  <v-card width="100%" class="pa-10" color="grey">
                    <v-row class="">
                      <v-card width="100%" color="blue">
                        <v-card-title>Profile Background!</v-card-title>

                        <div class="pa-2  d-flex justify-center">
                          <v-img width="200"
                                 src="https://cdn.discordapp.com/attachments/902618947759788043/1226461567265013810/img5.png?ex=6624da58&is=66126558&hm=e5fa52ee2d4a6130668e0da580ef31b73011c9c032d9453b27c835d343f0e7e3&"></v-img>
                        </div>
                        <v-card color="primary" class="justify-center d-flex pa-3">
                          <v-btn color="red">price</v-btn>
                        </v-card>
                      </v-card>
                    </v-row>

                    <v-row class="">
                      <v-card class="mt-2" width="100%" color="blue">
                        <v-card-title>Profile Background!</v-card-title>

                        <div class="pa-2  d-flex justify-center">
                          <v-img width="200"
                                 src="https://cdn.discordapp.com/attachments/902618947759788043/1226461567265013810/img5.png?ex=6624da58&is=66126558&hm=e5fa52ee2d4a6130668e0da580ef31b73011c9c032d9453b27c835d343f0e7e3&"></v-img>
                        </div>
                        <v-card color="primary" class="justify-center d-flex pa-3">
                          <v-btn color="red">10 $</v-btn>
                        </v-card>
                      </v-card>
                    </v-row>


                  </v-card>
                </v-col>

                <v-col>
                  <v-row>
                    <v-col>
                      <v-card height="100%" color="yellow" class="ma-10 pa-5">
                        <h1>Confeti</h1>
                      </v-card>
                    </v-col>

                    <v-col>
                      <v-card height="100%" color="yellow" class="ma-10 pa-5">
                        <h1>Confeti</h1>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>


                <v-col>
                  <v-row>
                    <v-col>
                      <v-card height="100%" color="yellow" class="ma-10 pa-5">
                        <h1>Confeti</h1>
                      </v-card>
                    </v-col>

                    <v-col>
                      <v-card height="100%" color="yellow" class="ma-10 pa-5">
                        <h1>Confeti</h1>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>


                <v-col>
                  <v-card height="100%" color="yellow" class="ma-10 pa-5">
                    <h1>Confeti</h1>
                  </v-card>
                </v-col>


              </v-row>
            </v-window-item>

            <v-window-item value="two">
              Two
            </v-window-item>

            <v-window-item value="three">
              Three
            </v-window-item>
          </v-window>
        </v-card>

      </v-card>
    </v-col>

  </v-row>

</template>

<script>

import axios from "axios";
import io from "socket.io-client";
import router from "@/router";
import {mapGetters} from "vuex";
import {user} from "../../handelers/UserHandeler";
import Router from "@/router";

export default {


  data: () => ({
    tab: null,
  }),
  async mounted() {


  },

  methods: {}

}</script>

<style>

</style>
