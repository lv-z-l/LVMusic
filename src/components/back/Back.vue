<template>
  <view :class="['back', store.backFixed ? 'fixed' : '']" @tap="store.back">
    <view class="iconfont icon-fenxiang"></view>
    <text class="title" v-show="store.backFixed">{{ props.title }}</text>
  </view>
</template>
<script setup>
import { useStore } from '../../store/main';

const props = defineProps({
  title: String
})

const store = useStore()

</script>
<style lang="scss">
.back {
  width: 100%;
  padding: 0 $global-padding;
  height: $page-frame-scroll-margin-top;
  position: absolute;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  transition: $transition;
  font-size: $page-frame-fixed-text-size;
  top: calc(2 * var(--status-bar-height));
  left: 0;

  $temp: calc($page-frame-scroll-margin-top / 2);

  .iconfont {
    width: $temp;
    height: $temp;
    border-radius: 50%;
    background-color: var(--bg);
    text-align: center;
    line-height: $temp;
  }

  .title {
    flex: 2 0 auto;
    text-align: center;
  }

  &.fixed {
    position: sticky;
    z-index: 2;
    background-color: var(--bg);
    border-bottom: 1rpx solid $bottom-bar-split-color;
    align-items: center;
    justify-content: center;
    backdrop-filter: $backdrop-filter;
    box-shadow: $box-shadow;

    .iconfont {
      border-radius: 0;
      background-color: unset;
      padding: 0;
    }
  }
}
</style>