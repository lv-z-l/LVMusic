<template>
  <view class="page-frame">
    <transition name="scrool-bar">
      <view v-show="!noScroll" class="scroll-bar">
        <text class="scroll-text">{{ props.frameName || 'Default' }}</text>
      </view>
    </transition>
    <text class="no-scroll-text">{{ props.frameName || 'Default' }}</text>
    <view class="page-frame-content">
      <view @click="noScroll = !noScroll">sss</view>
      <slot></slot>
    </view>
  </view>
</template>
  
<script setup name="pageframe">
import { ref } from 'vue'

const props = defineProps(
  { frameName: String }
)

const noScroll = ref(false)
</script>
<style lang="scss">
// 118 26 32 56
.page-frame {
  .page-frame-content {
    padding: $global-padding;
  }
  .no-scroll-text {
    margin-top: $page-frame-no-scroll-margin-top;
    display: inline-block;
    font-size: $page-frame-no-scroll-text-size;
    padding: $global-padding;
  }
  .scroll-bar {
    width: 100%;
    position: sticky;
    background-color: $bg;
    top: 0;
    border-bottom: 1rpx solid $bottom-bar-split-color;
  }
  .scroll-text {
    width: 100%;
    margin: $page-frame-scroll-margin;
    display: inline-block;
    text-align: center;
    line-height: $page-frame-scroll-text-size;
    font-size: $page-frame-scroll-text-size;
  }

  .scrool-bar-enter-active,
  .scrool-bar-leave-active {
    transition: all .4s ease;
  }
  .scrool-bar-enter-from,
  .scrool-bar-leave-to {
    // transform: translateY(-$page-frame-no-scroll-text-size);
    opacity: $opacity-zero;
  }
}
</style>