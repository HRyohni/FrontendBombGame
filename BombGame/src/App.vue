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
            title="Yohni"
            subtitle="matosevic.leo@gmailcom"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <font-awesome-icon :icon="faArrows"></font-awesome-icon>
        <v-icon :icon="faArrows"></v-icon>

        <font-awesome-icon :icon="['fal', 'envelope']" />
        <v-list-item :prepend-icon="faArrows" title="" link="" >
          <font-awesome-icon class="d-flex"  :icon="faHouse"></font-awesome-icon>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-item prepend-icon="mdi-account-multiple" title="Shared with me" value="shared">asdasdasd</v-list-item>
        <v-divider></v-divider>
        <v-list-item prepend-icon="mdi-star" title="Starred" value="starred"></v-list-item>
        <v-divider></v-divider>

        <v-list-item prepend-icon="mdi-star" title="Log out" value="starred"></v-list-item>
        <v-list-item prepend-icon="mdi-star" title="Log out" value="starred"></v-list-item>
        <v-divider></v-divider>
        <v-list-item prepend-icon="mdi-star" title="Log out" value="starred"></v-list-item>
        <v-list-item prepend-icon="mdi-star" title="Log out" value="starred"></v-list-item>

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

export default {
  name: "App",
  components: {
    //components
  },
  props:
      {

      },


  data: () => ({}),
  async mounted() {

  },

  methods: {
    promjeniTekst() {


    }


  },
};
</script>

<style scoped>

</style>
