<template>

  <v-layout >
    <v-main>
      <RouterView class="d-inline"/>
    </v-main>
    <!-- For higher resolution and smaller -->
    <v-navigation-drawer elevation="6" expand-on-hover color="#2F313D" :rail="true" class="d-inline">
      <v-list>
        <v-list-item :prepend-avatar="user.profilePicture" v-if="user" :title="user.username"
                     :subtitle="user.mail"></v-list-item>

      </v-list>
      <v-divider></v-divider>
      <v-list density="compact" nav>
        <!-- Navigation Items with Icons -->
        <v-list-item @click="goToHome" class="menu-item">
          <div class="d-flex align-center">
            <FontAwesomeIcon :icon="homeIcon"/>
            <h4 class="ml-2">Home</h4>
          </div>
        </v-list-item>

        <v-list-item @click="goScoreboard" class="menu-item">
          <div class="d-flex align-center">
            <FontAwesomeIcon :icon="trophyIcon"/>
            <h4 class="ml-2">Scoreboard</h4>
          </div>
        </v-list-item>
        <v-list-item @click="goToShop" class="menu-item">
          <div class="d-flex align-center">
            <FontAwesomeIcon :icon="shopIcon"/>
            <h4 class="ml-2">Shop</h4>
          </div>
        </v-list-item>


        <v-list-item @click="goToCreateNewGamemode" class="menu-item">
          <div class="d-flex align-center">
            <FontAwesomeIcon :icon="createGamemodeIcon"/>
            <h4 class="ml-2">New Gamemode</h4>
          </div>
        </v-list-item>
        <v-list-item @click="goToRoomList" class="menu-item">
          <div class="d-flex align-center">
            <FontAwesomeIcon :icon="roomListIcon"/>
            <h4 class="ml-2">RoomList</h4>
          </div>
        </v-list-item>


        <v-list-item @click="LogOut" class="menu-item">
          <div class="d-flex align-center">
            <FontAwesomeIcon :icon="singOut"/>
            <h4 class="ml-3">Sign Out</h4>
          </div>
        </v-list-item>


      </v-list>
      <!-- Edit Profile -->

    </v-navigation-drawer>

    <!-- For mobile and smaller -->
    <v-bottom-navigation color="red" bg-color="primary"  class="d-lg-none" :elevation="10" mode="shift">
      <v-btn @click="goToHome">
        <FontAwesomeIcon :icon="homeIcon"/>
      </v-btn>
      <v-btn @click="goScoreboard">
        <FontAwesomeIcon :icon="trophyIcon"/>
      </v-btn>
      <v-btn @click="goToShop">
        <FontAwesomeIcon :icon="shopIcon"/>
      </v-btn>

      <v-btn @click="goToCreateNewGamemode">
        <FontAwesomeIcon :icon="createGamemodeIcon"/>
      </v-btn>
      <v-btn @click="goToRoomList">
        <FontAwesomeIcon :icon="roomListIcon"/>
      </v-btn>
      <v-btn @click="LogOut" color="red">
        <FontAwesomeIcon :icon="singOut"/>
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
  <v-layout>

  </v-layout>

</template>

<script>
import router from "@/router";
import {
  faHome,
  faShoppingCart,
  faUser,
  faSpellCheck,
  faSignOutAlt,
  faEdit,
  faTrophy,
  faSignOut,
  faPlusSquare, faGamepad, faList
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {user} from "../handelers/UserHandeler"
import io from "socket.io-client";
import {mapGetters} from "vuex";

export default {
  name: "App",
  components: {
    FontAwesomeIcon
  },
  data: () => ({
    homeIcon: faHome,
    shopIcon: faShoppingCart,
    loginRegisterIcon: faUser,
    createRoomIcon: faPlusSquare,
    createGamemodeIcon: faGamepad,
    roomListIcon: faList,
    editProfileIcon: faEdit,
    singOut: faSignOut,
    trophyIcon: faTrophy,
    userData: null,
    socket: null,
  }),

  computed: {
    ...mapGetters({ user: "getUser" }),
  },
  async mounted() {
    this.socket = io("http://localhost:3000");
    console.log("sssss",this.user);
    this.userData = user;

    this.socket.on('changeUserData', () => {
      console.log("data changed");
      this.userData = this.fetchUserData();
    });
  },
  methods: {
    LogOut() {
      user.logOutUser();
      user.changeUrlOnLogin();
    },

    goToCreateNewGamemode() {
      router.push("/create-gamemode");
    },
    goToEditProfile() {
      router.push("/profile-edit");
    },
    goToHome() {
      router.push("/");
    },

    goScoreboard() {
      router.push("/scoreboard");
    },
    goToLoginRegister() {
      router.push("/login-register");
    },
    goToRoomList() {
      router.push("/room-list");
    },
    goToShop() {
      router.push("/shop");
    },

  },
};
</script>

