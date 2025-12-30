<script setup>
import BaseLinkCard from '../Base/BaseLinkCard.vue';

const props = defineProps({
  title: {
    type: String,
    default: "Enjoy the games"
  }
})

const items = [
  { text: "Get tickets", url: "#", icon: { title: "lucide:ticket", size: 35 }, external: false },
  { text: "Book your stay", url: "#", icon: { title: "simple-icons:airbnb", size: 35 }, external: false },
  { text: "Hospitality", url: "#", icon: { title: "lucide:concierge-bell", size: 35 }, external: false },
  { text: "Olympic shop", url: "#", icon: { title: "lucide:shopping-bag", size: 35 }, external: false },
  { text: "Fan26", url: "#", icon: { title: "lucide:gamepad-2", size: 35 }, external: false },
  { text: "Membership", url: "#", icon: { title: "lucide:user", size: 35 }, external: false },
  { text: "Schedule", url: "#", icon: { title: "lucide:calendar", size: 35 }, external: false },
  { text: "Spectator info", url: "#", icon: { title: "lucide:info", size: 35 }, external: false }
]
</script>

<template>
  <section class="category-section">
    <h2>{{ title }}</h2>
    <div class="cards-grid">
      <BaseLinkCard
        v-for="(item, index) in items"
        :key="index"
        :text="item.text"
        :url="item.url"
        :icon="item.icon"
        :external="item.external"
      />
    </div>
  </section>
</template>

<style scoped>
.category-section {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
}

.cards-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 23px;
  width: 100%;
}
</style>
