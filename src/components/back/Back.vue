<template>
  <view :class="['back', store.backFixed ? 'fixed' : '']" @click="store.back">
    <text class="icon-fenxiang"></text>
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
  padding: 5.33%;
  position: absolute;
  box-sizing: border-box;
  display: flex;
  transition: $transition;
  font-size: $page-frame-fixed-text-size;
  top: 0;

  [class^=icon] {
    border-radius: 50%;
    background-color: $bg;
    padding: calc($page-frame-fixed-text-size / 2);
  }

  .title {
    flex: 2 0 auto;
    text-align: center;
  }

  &.fixed {
    position: sticky;
    height: $page-frame-scroll-margin-top;
    z-index: 2;
    background-color: $white-color;
    border-bottom: 1rpx solid $bottom-bar-split-color;
    padding: $back-fixed-margin;
    align-items: center;
    justify-content: center;

    // backdrop-filter: $backdrop-filter;
    // box-shadow: $box-shadow;
    [class^=icon] {
      border-radius: 0;
      background-color: unset;
      padding: 0;
    }
  }
}
</style>