<template>
  <view class="page-frame">
    <view class="take" v-show="!store.fixed"></view>
    <view :class="['scroll-bar', store.fixed ? 'fixed' : '']">
      <text class="text">{{ props.frameName || 'Default' }}</text>
    </view>
    <view ref="pfc" class="page-frame-content">
      <slot></slot>
    </view>
  </view>
</template>
  
<script setup name="pageframe">
import { ref, onMounted } from 'vue'
import { useStore } from '../../store/main'

const store = useStore()
const props = defineProps(
  { frameName: String }
)

const pfc = ref()

const noScroll = ref(false)

onMounted(() => {
  const w = pfc.value.$el.clientWidth
  // 0.53 是 padding
  const contentW = Number.parseInt((w - (0.053 * w * 3)) / 3)
  store.setImageWidth(contentW)
})
</script>
<style lang="scss">
// 118 26 32 56
.page-frame {
  .take {
    width: 100%;
    height: $page-frame-scroll-margin-top;
  }

  .page-frame-content {
    padding: $global-padding;
  }

  .scroll-bar {
    width: 100%;
    box-sizing: border-box;
    padding: $global-padding;
    transition: $transition;
    display: flex;

    .text {
      font-size: $page-frame-scroll-text-size;
    }

    &.fixed {
      height: $page-frame-scroll-margin-top;
      z-index: 2;
      position: sticky;
      background-color: $bg;
      top: 0;
      border-bottom: 1rpx solid $bottom-bar-split-color;
      text-align: center;
      padding: $page-frame-fixed-margin;
      align-items: center;
      justify-content: center;

      .text {
        font-size: $page-frame-fixed-text-size;
      }
    }
  }
}
</style>