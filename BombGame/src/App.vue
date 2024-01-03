n
<script setup>
import {RouterLink, RouterView} from 'vue-router'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faHouse} from "@fortawesome/free-solid-svg-icons/faHouse";
import {faArrows} from "@fortawesome/free-solid-svg-icons/faArrows";
import '@fortawesome/fontawesome-free/css/all.css'
</script>

<template>
  <v-layout>
    <!--     For higher resolution and smaller -->
    <v-navigation-drawer
        elevation="6"
        expand-on-hover
        color="#2F313D"
        :rail="true"
        class="d-inline"
    >
      <v-list>
        <v-list-item
            prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
            v-if="this.userData"
            :title="this.userData.username"
            :subtitle="this.userData.mail"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>

        <v-list-item @click="goToHome"  title="" link="" ></v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="goToEditProfile()" prepend-icon="mdi-star" title="Edit Profileee" ></v-list-item>
        <v-list-item @click="goToHome" prepend-icon="mdi-star" title="Home" ></v-list-item>
        <v-list-item @click="goToLoginRegister" prepend-icon="mdi-star" title="Login/register" ></v-list-item>

        <v-list-item v-if="this.userData !== null"><v-btn color="red" @click="LogOut" >log out</v-btn></v-list-item>


      </v-list>

    </v-navigation-drawer>

    <v-main>
      <RouterView class="d-inline"/>
    </v-main>


    <!--     For mobile and smaller -->

    <v-bottom-navigation class="d-lg-none" :elevation="10" mode="shift">
      <v-btn value="recent">
        <h1>R</h1>
        <span>Recent</span>
      </v-btn>

      <v-btn value="favorites">
        <h1>H</h1>

        <span>Favorites</span>
      </v-btn>

      <v-btn value="nearby">
        <h1>N</h1>

        <span>Nearby</span>
      </v-btn>
    </v-bottom-navigation>
  </v-layout>

</template>


<script>

import router from "@/router";
import {faHome} from "@fortawesome/free-solid-svg-icons";
import {mapGetters} from "vuex";
import {user} from "../handelers/UserHandeler"

export default {
  name: "App",

  components: {
    //components
  },
  props:
  
      {

      },


  data: () => ({
    homeIcon : faHome,
    userData: null
  }),
  async mounted() {
    this.userData = user.getUserData();
  },

  methods: {


    goToEditProfile()
    {
      router.push("/profile-edit")
    },

    goToLoginRegister()
    {
      router.push("/login-register")
    },
    goToHome() {
      router.push("/")
    },
    LogOut() {
      user.logOutUser();
      user.changeUrlOnLogin();
    },

  },
};
</script>

<style scoped>

</style>
