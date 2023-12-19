<script setup>
import {RouterLink, RouterView} from 'vue-router'
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
        <v-list-item prepend-icon="mdi-folder" title="Word Guesser" value="myfiles"></v-list-item>
        <v-divider></v-divider>

        <v-list-item prepend-icon="mdi-account-multiple" title="Shared with me" value="shared"></v-list-item>
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
