<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="bg-black min-h-screen">
 <div class="flex justify-center ">
   <RouterLink class="flex items-center justify-center space-x-3 w-full h-full min-h-screen text-center text-white  text-7xl md:text-6xl font-extrabold tracking-wide hover:scale-110 transition-transform animate-pulse [text-shadow:0_0_30px_#fff,0_0_60px_#fff]  ">ИГРАТЬ</RouterLink> 
  </div>
  <RouterView />
  </div>
</template>

<style scoped>

</style>
