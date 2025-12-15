<script setup>
import BaseIcon from '../Base/BaseIcon.vue';

const props = defineProps({
    text: {
        type: Array,
        required: true,
        validator: (value) =>
            Array.isArray(value) && value.every(v => typeof v === 'string')
    },
    links: {
        type: Array,
        required: false,
        validator: (value) =>
            Array.isArray(value) && value.every(link => 
                link.txt && link.src && link.icon && link.external && typeof link.icon === 'object'
            )
    },
    wrapperClass: {
        type: String,
        default: ""
    },
    contentClass: {
        type: String,
        default: ""
    }
})
</script>

<template>
  <div :class="wrapperClass">
    <div>
        <span
            v-for="(txt, index) in text"
            :key="index"
            :class="['top-bar-txt', contentClass]"
        >
            {{ txt }}
        </span>
    </div>
    <div>
        <a
            v-for="(link, index) in links"
            :key="index"
            :href="link.src"
            :target="link.external ? '_blank' : '_self'"
            :rel="link.external ? 'noopener noreferrer' : null"
        >
            <BaseIcon v-bind="link.icon"/>
            <span>{{ link.txt }}</span>
        </a>
    </div>
  </div>
</template>

<style scoped>
.top-bar-txt {
    padding: 0 10px;
    border-right: 2px solid currentColor;
}

.top-bar-txt:last-child {
    border-right: none;
}
</style>