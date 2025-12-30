<script setup>
import TheTopBar from '../components/The/TheTopBar.vue';
import TheNavBar from '../components/The/TheNavBar.vue';
import headerData from '../data/header-content.json';
</script>

<template>
  <div class="flex flex-col w-full relative z-50">
    
    <TheTopBar
      :text="headerData.topBarText"
      :links="headerData.topBarLinks"
    />
    
    <TheNavBar 
      :logo="headerData.logoConfig"
      :navigation="headerData.navItems"
    />
    
  </div>
</template>