<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template class="">


    <RouterView class="d-inline" />


</template>


<script>

export default {
  name: "App",
  components: {
    //components
  },

  data: () => ({


  }),
  async mounted() {

  },

  methods: {
    promjeniTekst()
    {
      this.sadrzajTeksta = "kurac"

    }


  },
};
</script>

<style scoped>

</style>
