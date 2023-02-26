<template>
  <slot v-if="load"></slot>
  <view v-else ref="imgbox" :style="{ height: h, width: w }">
  </view>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { initLazyIntersectionObserver } from '@/utils'

const props = defineProps({
  w: String,
  h: String
})

const load = ref(false)

const imgbox = ref()

let observer

onMounted(() => {
  observer = initLazyIntersectionObserver(entry => {
    if (entry.isIntersecting) {
      load.value = true
      observer.unobserve(imgbox.value.$el)
      observer = null
    }
  })
  observer.observe(imgbox.value.$el)
})

</script>
