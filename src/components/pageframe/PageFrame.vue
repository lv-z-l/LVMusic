<template>
  <view class="page-frame">
    <view v-if="props.frameName" :class="['scroll-bar', store.fixed ? 'fixed' : '']">
      {{ props.frameName }}
    </view>
    <view class="page-frame-content">
      <slot></slot>
      <view class="blank-block"></view>
      <view class="blank-block"></view>
    </view>
  </view>
</template>
  
<script setup>
import { ref } from 'vue'
import { useStore } from '../../store/main'

const store = useStore()
const props = defineProps(
  { frameName: String }
)

const noScroll = ref(false)
</script>
<style lang="scss">
@keyframes small-h {}

.page-frame {
  width: 100%;

  .blank-block {
    width: 100%;
    height: $bottom-bar-height;
  }

  .scroll-bar {
    width: 100%;
    box-sizing: border-box;
    padding: $global-padding;
    transition: $transition;
    margin-top: $page-frame-scroll-margin-top;
    display: flex;
    font-size: $page-frame-scroll-text-size;

    &.fixed {
      height: $page-frame-scroll-margin-top;
      z-index: 2;
      position: sticky;
      background-color: $white-color;
      margin-top: 0;
      top: $scroll-bar-fixed-top;
      border-bottom: 1rpx solid $bottom-bar-split-color;
      align-items: center;
      justify-content: center;
      // backdrop-filter: $backdrop-filter;
      // box-shadow: $box-shadow;
      font-size: $page-frame-fixed-text-size;
    }
  }
}
</style>