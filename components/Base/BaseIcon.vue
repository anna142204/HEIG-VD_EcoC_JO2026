<script setup>
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        default: 24
    },
    color: {
        type: String,
        default: "currentColor"
    },
    ariaLabel: {
        type: String,
        default: ""
    }
});
</script>

<template>
    <Icon
        :name="title"
        :size="size"
        :style="{ color }"
        :aria-label="ariaLabel || title"
        role="img"
    />
</template>