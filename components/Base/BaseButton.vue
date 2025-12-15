<script setup>
import BaseIcon from '../Base/BaseIcon.vue';
import { useNavigation } from '../../composables/useNavigation';

const props = defineProps({
    text: {
        type: String,
        default: ""
    },
    url: {
        type: String,
        default: ""
    },
    inverted: {
        type: Boolean,
        default: false
    },
    icon: {
        type: Object,
        default: null
    }
})

const { navigateTo } = useNavigation()

const handleClick = () => {
    navigateTo(props.url)
}
</script>

<template>
  <div>
    <button @click="handleClick()" :class="['btn', { inverted }]">
        <span>{{ text }}</span>
        <BaseIcon v-if="icon" v-bind="icon"/>
    </button>
  </div>
</template>