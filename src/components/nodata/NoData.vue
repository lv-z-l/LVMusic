<template>
  <view class="no-data">
    <video class="video" src="../../static/nodata.mp4" :autoplay="true" :loop="true" :controls="false"
      :show-center-play-btn="false" :show-progress="false" :show-fullscreen-btn="false"></video>
    <text>{{ store.langObj.nodata }}</text>
  </view>
</template>
<script setup>
import { useStore } from '../../store/main';
const store = useStore()
</script>
<style lang="scss">
.no-data {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 8rem;

  transform: translate3d(-50%, -50%, 0);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .video {
    width: 7rem;
    height: 7rem;
  }
}
</style>