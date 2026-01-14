<script setup>
import { ref, computed } from 'vue';
import faqQuestionsRaw from '../data/faq.json';
import BaseFAQCard from '../components/Base/BaseFAQCard.vue';
import BaseButton from '../components/Base/BaseButton.vue';

const selectedCategory = ref(null);

const categories = computed(() => {
  return [
    ...new Set(
      faqQuestionsRaw
        .map(q => q.category)
        .filter(Boolean)
    )
  ]
});

const filteredFaqQuestions = computed(() => {
  if (!selectedCategory.value) {
    return faqQuestionsRaw
  }

  return faqQuestionsRaw.filter(
    q => q.category === selectedCategory.value
  )
});
</script>

<template>
  <section class="w-full max-w-[1362px] mx-auto px-5 py-12">
    
   <div class="flex flex-col md:flex-row items-start gap-10">
        
        <div class="w-full md:w-[50%] flex flex-col gap-6">
            
            <h2 class="font-[Poppins] font-bold text-[32px] text-[var(--color-dark-blue)] leading-tight">
                Questions posées fréquemment
            </h2>

            <div class="flex flex-wrap items-center gap-3">
              <BaseButton
                text="Toutes les catégories"
                :inverted="selectedCategory === null ? false : true"
                @click="selectedCategory = null"
              />
              <BaseButton
                v-for="category in categories"
                :text="category"
                :inverted="category === selectedCategory ? false : true"
                @click="selectedCategory = category"
              />
            </div>
            
        </div>

        <div class="w-full md:w-[50%] flex flex-col gap-6">
            <BaseFAQCard
                v-for="(faqQuestion, index) in filteredFaqQuestions"
                :key="index"
                :question="faqQuestion.question"
                :answer="faqQuestion.answer"
                :link="faqQuestion.link"
            />
            
            <div v-if="filteredFaqQuestions.length === 0" class="text-center py-10 opacity-60 font-[Poppins]">
                Aucune question trouvée.
            </div>
        </div>

    </div>
  </section>
</template>