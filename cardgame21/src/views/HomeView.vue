<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="bg-black min-h-screen flex items-center justify-center">
    <RouterLink 
      to="/MainMenu"
      class="text-white text-7xl md:text-6xl font-extrabold tracking-wide hover:scale-110 transition-transform animate-pulse [text-shadow:0_0_30px_#fff,0_0_60px_#fff]"
    >
      ИГРАТЬ
    </RouterLink>
  </div>
</template>