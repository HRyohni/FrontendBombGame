<template>
  <v-layout>
    <!-- For higher resolution and smaller -->
    <v-navigation-drawer elevation="6" expand-on-hover color="#2F313D" :rail="true" class="d-inline">
      <v-list>
        <v-list-item :prepend-avatar="userData.profilePicture" v-if="userData" :title="userData.username"
                     :subtitle="userData.mail"></v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list density="compact" nav>
        <!-- Navigation Items with Icons -->
        <v-list-item @click="goToHome" class="menu-item">
          <v-list-item-icon class="d-flex align-center">
            <FontAwesomeIcon :icon="homeIcon"/>
            <h4 class="ml-2">Home</h4>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item @click="goToShop" class="menu-item">
          <v-list-item-icon class="d-flex align-center">
            <FontAwesomeIcon :icon="shopIcon"/>
            <h4 class="ml-2">Shop</h4>
          </v-list-item-icon>
        </v-list-item>

        <v-list-item @click="goToCreateNewRoom" class="menu-item">
          <v-list-item-icon class="d-flex align-center">
            <FontAwesomeIcon :icon="createRoomIcon"/>
            <h4 class="ml-2">New Room</h4>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item @click="goToCreateNewGamemode" class="menu-item">
          <v-list-item-icon class="d-flex align-center">
            <FontAwesomeIcon :icon="createGamemodeIcon"/>
            <h4 class="ml-2">New Gamemode</h4>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item @click="goToRoomList" class="menu-item">
          <v-list-item-icon class="d-flex align-center">
            <FontAwesomeIcon :icon="roomListIcon"/>
            <h4 class="ml-2">RoomList</h4>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item @click="goToLoginRegister" class="menu-item">
          <v-list-item-icon class="d-flex align-center">
            <FontAwesomeIcon :icon="loginRegisterIcon"/>
            <h4 class="ml-3">Login/Register</h4>
          </v-list-item-icon>
        </v-list-item>

        <v-list-item @click="LogOut" class="menu-item">
          <v-list-item-icon class="d-flex align-center">
            <FontAwesomeIcon :icon="logOut"/>
            <h4 class="ml-3">Sign Out</h4>
          </v-list-item-icon>
        </v-list-item>


      </v-list>
      <!-- Edit Profile -->

    </v-navigation-drawer>
    <v-main>
      <RouterView class="d-inline"/>
    </v-main>
    <!-- For mobile and smaller -->
    <v-bottom-navigation color="red" bg-color="grey"  class="d-lg-none" :elevation="10" mode="shift">
      <v-btn @click="goToHome">
      <v-icon>{{ createRoomIcon }}</v-icon>
        <h4 class="ml-2">Home</h4>
      </v-btn>
      <v-btn @click="goToShop">
        <FontAwesomeIcon icon="shopping-cart"/>
        <h4 class="ml-2">Shop</h4>
      </v-btn>
      <v-btn @click="goToLoginRegister">
        <FontAwesomeIcon icon="user"/>
        <h4 class="ml-2">Login/Register</h4>
      </v-btn>
      <v-btn @click="goToCreateNewRoom">
        <FontAwesomeIcon icon="plus-square"/>
        <h4 class="ml-2">Create New Room</h4>
      </v-btn>
      <v-btn @click="goToCreateNewGamemode">
        <FontAwesomeIcon icon="gamepad"/>
        <h4 class="ml-2">New Gamemode</h4>
      </v-btn>
      <v-btn @click="goToRoomList">
        <FontAwesomeIcon icon="list"/>
        <h4 class="ml-2">RoomList</h4>
      </v-btn>
      <v-btn @click="LogOut" color="red">
        <FontAwesomeIcon icon="sign-out-alt"/>
        <h4 class="ml-2">Log Out</h4>
      </v-btn>
    </v-bottom-navigation>
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
  faSignOut,
  faPlusSquare, faGamepad, faList
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {user} from "../handelers/UserHandeler"
import io from "socket.io-client";

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
    userData: null,
    socket: null,
  }),
  async mounted() {
    this.socket = io("http://localhost:3000");
    this.userData = await this.fetchUserData();

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
    goToCreateNewRoom() {
      router.push("/new-room");
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
    goToLoginRegister() {
      router.push("/login-register");
    },
    goToRoomList() {
      router.push("/room-list");
    },
    goToShop() {
      router.push("/shop");
    },
    async fetchUserData() {
      return await user.getUserData();
    },
  },
};
</script>

