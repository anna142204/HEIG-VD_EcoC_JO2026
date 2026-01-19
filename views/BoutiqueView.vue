<script setup>
import boutiqueLinks from '../data/boutiqueCards.json'
import BaseCard from '../components/Base/BaseCard.vue';
</script>

<template>
  <section class="w-full max-w-[1362px] mx-auto px-4 md:px-0 flex flex-col gap-[10px]">
     <h2 class="font-[Poppins] font-bold text-[28px] md:text-[32px] text-[var(--color-dark-blue)] py-[10px] pr-[10px]">
      La Boutique Olympique 
    </h2>
    <div class="flex items-center justify-between w-full gap-5">
        <BaseCard
            v-for="(link, index) in boutiqueLinks"
            :key="index"
            :title="link.title"
            :button="link.button"
            :img="link.img"
        />
    </div>
  </section>
</template>

<style scoped>

</style>