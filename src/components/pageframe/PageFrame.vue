<template>
  <view class="page-frame">
    <view v-if="frameName" class="scroll-bar">
      {{ frameName }}
    </view>
    <view class="page-frame-content">
      <slot></slot>
      <view class="blank-block"></view>
    </view>
  </view>
</template>
  
<script>
import { mapActions } from 'pinia'
import { useStore } from '@/store/main/index.js'
export default {
  props: {
    frameName: String
  },
  methods: {
    ...mapActions(useStore, ['loadMore'])
  },
  mounted() {
    this.$nextTick(() => {
      this.observer = uni.createIntersectionObserver(this)
      this.observer.relativeToViewport({
        bottom: 0,
        right: 0
      }).observe('.blank-block', (res) => {
        if (res.intersectionRatio > 0) {
          this.loadMore()
        }
      })
    })
  },
  beforeUnmount() {
    this.observer && this.observer.disconnect()
  }
}
</script>
<style lang="scss">
.page-frame {
  width: 100%;
  padding-top: var(--status-bar-height);
  padding-bottom: 0;
  box-sizing: border-box;

  .blank-block {
    width: 100%;
    height: calc(2 * $bottom-bar-height);
  }

  .scroll-bar {
    width: calc(100% - $global-padding);
    padding: var(--status-bar-height) 0 0 $global-padding;
    transition: $transition;
    display: flex;
    font-size: $page-frame-scroll-text-size;
    height: $page-frame-scroll-margin-top;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 2;
    backdrop-filter: $backdrop-filter;
  }
}
</style>