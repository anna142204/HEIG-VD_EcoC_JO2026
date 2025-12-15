<script setup>
const props = defineProps({
    src: {
        type: String,
        required: true
    },
    alt: {
        type: String,
        required: true
    },
    wrapperClass: {
        type: String,
        default: ""
    },
    imgClass: {
        type: String,
        default: ""
    },
    copyright: {
        type: String,
        default: ""
    }
});
</script>

<template>
  <div class="" :class="wrapperClass">
    <NuxtImg :src="src" :alt="alt" :class="imgClass"/>
    <div v-if="copyright" class="">{{ copyright }}</div>
  </div>
</template>