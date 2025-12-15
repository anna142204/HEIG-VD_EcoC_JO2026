<script setup>
import BaseIcon from './BaseIcon.vue';
import { useNavigation } from '../../composables/useNavigation';

const props = defineProps({
  text: {
    type: String,
    default: "Text"
  },
  url: {
    type: String,
    default: ""
  },
  icon: {
    type: Object,
    default: null
  },
  external: {
    type: Boolean,
    default: false
  }
})

const { navigateTo } = useNavigation()

const handleClick = () => {
  if (props.external && props.url) {
    window.open(props.url, '_blank', 'noopener,noreferrer')
  } else {
    navigateTo(props.url)
  }
}
</script>

<template>
  <button 
    @click="handleClick()" 
    class="link-card"
  >
    <BaseIcon v-if="icon" :title="icon.title" :size="icon.size" color="var(--color-white)" />
    <span class="text">{{ text }}</span>
  </button>
</template>

<style scoped>
.link-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 32px;
  width: 300px;
  height: 96px;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  
  /* Dégradé de fond */
  background: 
    conic-gradient(from 90deg, rgba(1, 148, 130, 0.4) 0%, rgba(1, 100, 124, 0.4) 51%, rgba(1, 148, 130, 0.4) 100%),
    var(--color-blue);
  
  transition: all 0.2s ease;
}

.link-card:hover {
  background: 
    conic-gradient(from 90deg, rgba(1, 148, 130, 0.6) 0%, rgba(1, 100, 124, 0.6) 51%, rgba(1, 148, 130, 0.6) 100%),
    var(--color-blue);
}

.icon {
  flex-shrink: 0;
  width: 35px;
  height: 35px;
  color: var(--color-white);
}

.text {
  font-family: var(--font-primary);
  font-size: 20px;
  font-weight: 600;
  color: var(--color-white);
}
</style>
