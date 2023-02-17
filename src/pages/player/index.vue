<template>
  <view :class="['player', store.playerShow ? 'show' : 'hide']">
    <view class="top-line"></view>
    <view class="play-voice">
      <text class=""></text>
      <view class="voice-bar" ref="voiceBar">
        <view class="voice" :style="{ width: voiceWidth }"></view>
      </view>
      <text class=""></text>
    </view>
  </view>
</template>
  
<script setup name="player">
  import { computed, ref } from '@vue/reactivity';
  import { useStore } from '@/store/main/index'

  const store = useStore()

  const voiceBar = ref()
  const voiceWidth = computed(() => {
    return store.voiceBarWidth / 100 * voiceBar.clientWidth
  })
</script>
  
<style lang="scss">
.player {
  width: 100%;
  height: 100vh;
  z-index: 2;
  position: absolute;
  top: 0;
  background-color: aliceblue;
  transition: all .4s cubic-bezier(0.230, 1.000, 0.320, 1.000);
  &.show {
    transform: translateY(0);
    opacity: 1;
  }
  &.hide {
    transform: translateY(100vh);
    opacity: 0;
  }
}

</style>