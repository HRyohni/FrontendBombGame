<script setup>
import router from "@/router";

const props = defineProps({
  gameModeName: String,
  gameModeDescription: String,
  gameModeAuthor: String
});
</script>

<template>
  <v-container class="d-inline">

    <v-card style="min-width: 200px" image="/bomb_icon.png" elevation="4"
            color="grey-darken-4" height="250"
            width="300">
      <h1 class="ma-2">{{ props.gameModeName }}</h1>
      <v-card-text>{{ props.gameModeDescription }}</v-card-text>
      <v-card-subtitle class="d-flex justify-end">{{ props.gameModeAuthor }}</v-card-subtitle>

      <v-spacer></v-spacer>
      <v-card-actions>
        <v-btn @click="router.push('/new-room/'+props.gameModeName)" variant="outlined" color="primary" elevation="3">Play</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>

</template>

<style scoped>

</style>