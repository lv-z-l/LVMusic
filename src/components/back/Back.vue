<template>
  <view class="back" @tap="store.back">
    <view class="iconfont icon-fenxiang"></view>
    <text class="title">{{ props.title }}</text>
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
  width: calc(100% - $global-padding);
  padding: calc(2 * var(--status-bar-height)) 0 0 $global-padding;
  height: $page-frame-scroll-margin-top;
  display: flex;
  align-items: center;
  transition: $transition;
  font-size: $page-frame-fixed-text-size;
  top: 0;
  position: sticky;
  z-index: 2;
  backdrop-filter: $backdrop-filter;

  $temp: calc($page-frame-scroll-margin-top / 2);

  .iconfont {
    width: $temp;
    height: $temp;
    text-align: center;
    line-height: $temp;
  }

  .title {
    flex: 2 0 auto;
    text-align: center;
  }
}
</style>