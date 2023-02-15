<template>
  <view class="content">
    <view class="status_bar">
      <!-- 这里是状态栏 -->
    </view>
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title" @click="store.count++">{{ store.count }}</text>
    </view>
  </view>
</template>

<script>
import { useCounterStore } from '@/store/main/index.js'
export default {
  data() {
    return {
      title: 'Hello',
      store: useCounterStore()
    }
  },
  onLoad() { },
  methods: {},
}
</script>

<style lang="scss">
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: $uni-color-primary;
}
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
}
</style>
