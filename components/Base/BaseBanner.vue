<script setup>
import BaseImg from './BaseImg.vue';
import BaseButton from './BaseButton.vue';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    img: {
        type: Object,
        default: () => ({ src: '', alt: '' }),
        validator: (img) => {
            return typeof img.src === 'string' && typeof img.alt === 'string'
        }
    },
    button: {
        type: Object,
        default: () => ({ text: '', url: '', inverted: true, icon: { title: '', size: 24, color: 'inherit'} }),
        validator: (button) => {
            return (
                typeof button.text === 'string' &&
                typeof button.url === 'string' &&
                typeof button.inverted === 'boolean' &&
                typeof button.icon.title === 'string' &&
                typeof button.icon.size === 'number' &&
                typeof button.icon.color === 'string' &&
                typeof button.icon.border === 'boolean'
            )
        }
    }
})

</script>

<template>
    <section>
        <BaseImg
            :src="img.src"
            :alt="img.alt"
            wrapperClass="truncated-border"
            imgClass=""
        />
        <div>
            <div>
                <span>Presented by</span>
                <BaseImg
                    src="/images/presented_by.png"
                    alt="sponsors"
                    wrapperClass=""
                    imgClass=""
                />
            </div>
            <h3>{{ title }}</h3>
            <BaseButton
                :text="button.text"
                :url="button.url"
                :inverted="true"
                :icon="button.icon"
            />
        </div>
    </section>
</template>

<style scoped>
section {
    display: flex;
    flex-direction: row;
}

section {
  background: 
    conic-gradient(from 90deg, rgba(1, 148, 130, 0.4) 0%, rgba(1, 100, 124, 0.4) 51%, rgba(1, 148, 130, 0.4) 100%),
    var(--color-blue);
}
</style>