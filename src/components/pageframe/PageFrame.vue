<template>
  <view class="page-frame">
      <view v-if="props.frameName" :class="['scroll-bar', store.fixed ? 'fixed' : '']">
        <view>{{ props.frameName }}</view>
        <slot name="scrollbar"></slot>
      </view>
    
    <view class="page-frame-content">
      <slot></slot>
      <view ref="blankBlock" class="blank-block"></view>
    </view>
  </view>
</template>
  
<script setup>
import { useStore } from '../../store/main'
import { initLazyIntersectionObserver } from '@/utils'
import { onMounted, onBeforeUnmount, ref } from 'vue'

const store = useStore()
const props = defineProps(
  { frameName: String }
)

const blankBlock = ref()

let observer

onMounted(() => {
  observer = initLazyIntersectionObserver(entry => {
    if (entry.isIntersecting) {
      store.loadMore()
    }
  })
  observer.observe(blankBlock.value.$el)
})

onBeforeUnmount(() => observer && observer.unobserve(blankBlock.value.$el))

</script>
<style lang="scss">
.page-frame {
  width: 100%;

  .blank-block {
    width: 100%;
    height: calc(2 * $bottom-bar-height);
  }

  .scroll-bar {
    width: 100%;
    box-sizing: border-box;
    padding: 0 $global-padding;
    transition: $transition;
    margin-top: $page-frame-scroll-margin-top;
    display: flex;
    align-items: center;
    font-size: $page-frame-scroll-text-size;

    &.fixed {
      height: $page-frame-scroll-margin-top;
      z-index: 2;
      position: sticky;
      background-color: var(--bg);
      top: 0;
      border-bottom: 1rpx solid $bottom-bar-split-color;
      align-items: center;
      justify-content: center;
      backdrop-filter: $backdrop-filter;
      box-shadow: $box-shadow;
      font-size: $page-frame-fixed-text-size;
    }
  }
}
</style>