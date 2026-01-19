<script setup>
import TheBottomBar from '../components/The/TheBottomBar.vue';
import TheBottomNavBar from '../components/The/TheBottomNavBar.vue';
import footerData from '../data/footer-content.json';
import TheFooter from '../components/The/TheFooter.vue';
</script>

<template>
  <div class="flex flex-col w-full bg-[var(--color-blue)] relative z-50">
    <TheFooter/>
    <div class="flex flex-col md:gap-5">
      <TheBottomNavBar 
      :navigation="footerData.navItems"
      :socials="footerData.socials"
    />
    <TheBottomBar
      :text="footerData.bottomBar"
      :links="footerData.bottomBarLinks"
    />
    </div>
  </div>
</template>