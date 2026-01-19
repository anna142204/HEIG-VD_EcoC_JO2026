<script setup>
import BaseIcon from './BaseIcon.vue';

const props = defineProps({
    currentIndex: {
        type: Number,
        required: true
    },
    maxIndex: {
        type: Number,
        required: true
    },
    isPrevDisabled: {
        type: Boolean,
        default: false
    },
    isNextDisabled: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['prev', 'next'])
</script>

<template>
    <div class="bg-white flex items-center justify-center gap-[22px] px-[10px] py-[9px] rounded-[52px] w-fit mx-auto">
        <button
            @click="emit('prev')"
            :disabled="isPrevDisabled"
            aria-label="Précédent"
            :class="[
                'flex items-center justify-center w-[34px] h-[34px] rounded-full transition-all',
                isPrevDisabled 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-[var(--color-blue)] hover:bg-[var(--color-dark-blue)]'
            ]"
        >
            <BaseIcon 
                title="ph:arrow-left" 
                :size="20" 
                :color="isPrevDisabled ? '#9CA3AF' : 'white'" 
            />
        </button>
        <span class="font-[Poppins] text-[24px] text-[var(--color-blue)]">
            {{ currentIndex + 1 }}/{{ maxIndex + 1 }}
        </span>
        <button
            @click="emit('next')"
            :disabled="isNextDisabled"
            aria-label="Suivant"
            :class="[
                'flex items-center justify-center w-[34px] h-[34px] rounded-full transition-all',
                isNextDisabled 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-[var(--color-blue)] hover:bg-[var(--color-dark-blue)]'
            ]"
        >
            <BaseIcon 
                title="ph:arrow-right" 
                :size="20" 
                :color="isNextDisabled ? '#9CA3AF' : 'white'" 
            />
        </button>
    </div>
</template>

<style scoped>

</style>
