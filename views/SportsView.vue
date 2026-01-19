<script setup>
import sportsCards from '../data/sportsCards.json'
import BaseCard from '../components/Base/BaseCard.vue';
import BasePagination from '../components/Base/BasePagination.vue';
import { ref, computed, onMounted, onUnmounted } from 'vue';

const windowWidth = ref(1024)
const currentIndex = ref(0)

const updateWidth = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  windowWidth.value = window.innerWidth
  window.addEventListener('resize', updateWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})

const ITEMS_PER_PAGE = computed(() => {
  if (windowWidth.value < 640) return 1 // mobile
  if (windowWidth.value < 1024) return 1 // tablet
  return 4 // desktop
})

const currentElements = computed(() => {
  const start = currentIndex.value * ITEMS_PER_PAGE.value
  return sportsCards.slice(start, start + ITEMS_PER_PAGE.value)
})

const maxIndex = computed(() =>
  Math.ceil(sportsCards.length / ITEMS_PER_PAGE.value) - 1
)

const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1
  }
}

const next = () => {
  if (currentIndex.value < maxIndex.value) {
    currentIndex.value += 1
  }
}

const isPrevDisabled = computed(() => currentIndex.value === 0)
const isNextDisabled = computed(() => currentIndex.value === maxIndex.value)
</script>

<template>
  <section class="w-full max-w-[1362px] mx-auto px-4 md:px-0 flex flex-col gap-4">
     <h2 class="font-[Poppins] font-bold text-[28px] md:text-[32px] text-[var(--color-dark-blue)]">
      Sports  
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full auto-rows-fr">
        <BaseCard
            v-for="(card, index) in currentElements"
            :key="index"
            :title="card.title"
            :button="card.button"
            :img="card.img"
        />
    </div>
    <BasePagination 
      :currentIndex="currentIndex"
      :maxIndex="maxIndex"
      :isPrevDisabled="isPrevDisabled"
      :isNextDisabled="isNextDisabled"
      @prev="prev"
      @next="next"
    />
  </section>
</template>

<style scoped>

</style>