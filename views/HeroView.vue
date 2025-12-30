<script setup>
import TheCountdown from '../components/The/TheCountdown.vue';
import TheHeroSection from '../components/The/TheHeroSection.vue';
import heroElements from '../data/hero-content.json'
</script>

<template>
  <div class="flex flex-col gap-5">
    <TheHeroSection
        :elements="heroElements"
    />
    <TheCountdown/>
  </div>
</template>

<style scoped>

</style>