<template>
  <view class="content">
    <view class="status_bar">
      <!-- 这里是状态栏 -->
    </view>
    <text class="icon-yonghu"></text>
  </view>
</template>

<script setup>
import { useCounterStore } from '@/store/main/index.js'

const store = useCounterStore()

function onLoad() {

}
</script>

<style lang="scss">
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
}
</style>
