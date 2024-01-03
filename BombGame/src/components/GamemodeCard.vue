<script setup>

</script>

<template>
  <v-container class="d-inline">

    <v-card style="min-width: 200px" class="d-flex flex-wrap ma-1" image="./src/assets/bomb_icon.png" elevation="4"
            color="grey-darken-4" height="250"
            width="300">
      <v-card-title> GameModeName</v-card-title>
      <v-card-subtitle>gameModeAuthor</v-card-subtitle>
      <v-card-text> gamemodeDescription</v-card-text>

      <v-spacer></v-spacer>
      <v-card-actions>
        <v-btn    color="primary" elevation="3"  >Play</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>

</template>

<style scoped>

</style>