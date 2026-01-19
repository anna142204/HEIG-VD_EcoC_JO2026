<script setup>
import BaseIcon from '../Base/BaseIcon.vue';
import { useNavigation } from '../../composables/useNavigation';

const props = defineProps({
    text: { type: String, default: "" },
    url: { type: String, default: "" },
    inverted: { type: Boolean, default: false },
    icon: { type: Object, default: null }
})

const { navigateTo } = useNavigation()

const isIconOnly = !props.text || props.text.trim() === ''

const handleClick = () => {
    navigateTo(props.url)
}
</script>

<template>
  <div>
    <button 
        @click="handleClick()" 
        :class="[
            'inline-flex justify-center items-center border-none cursor-pointer',
            'rounded-full transition-all duration-200 ease-out',
            isIconOnly 
                ? 'p-2.5' 
                : [
                    'gap-3 py-[6px] md:py-[10px] pl-5',
                    icon ? 'pr-2.5' : 'pr-5',
                    'font-[Poppins] font-normal text-[1rem] md:text-[1.125rem]'
                ],
            inverted 
                ? 'bg-white text-[var(--color-blue)] hover:bg-[var(--color-light-green)]' 
                : 'text-white bg-custom-gradient'
        ]"
    >
        <span v-if="!isIconOnly">{{ text }}</span>
        <BaseIcon v-if="icon" v-bind="icon"/>
    </button>
  </div>
</template>

<style scoped>
.bg-custom-gradient {
  background: linear-gradient(270deg, var(--color-green-50) 0%, var(--color-blue-50) 25%), var(--color-blue);
}

.bg-custom-gradient:hover {
  background: linear-gradient(270deg, var(--color-green-70) 0%, var(--color-blue-70) 25%), var(--color-blue);
}
</style>