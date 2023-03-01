<template>
  <slot v-if="load"></slot>
  <view v-else ref="box" :style="{ height: h, width: w }">
  </view>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { initLazyIntersectionObserver } from '@/utils'

const props = defineProps({
  w: {
    type: String,
    default: '100%'
  },
  h: {
    type: String,
    default: '100%'
  }
})

const load = ref(false)

const box = ref()

let observer

onMounted(() => {
  observer = initLazyIntersectionObserver(entry => {
    if (entry.isIntersecting) {
      load.value = true
      observer.unobserve(box.value.$el)
      observer = null
    }
  })
  observer.observe(box.value.$el)
})

onBeforeUnmount(() => observer && observer.unobserve(box.value.$el))

</script>
