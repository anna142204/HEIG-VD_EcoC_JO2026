<script setup>
const props = defineProps({
    elements: {
        type: Array,
        required: true,
        validator: (value) =>
            Array.isArray(value) && value.every(el => 
                el.txt && el.img && el.button && typeof el.img && typeof el.icon === 'object'
            )
    }
})
</script>

<template>
  <div>
    
  </div>
</template>