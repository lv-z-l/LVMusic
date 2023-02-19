<template>
  <view :class="['player', store.playerShow ? 'show' : 'hide']" :style="{ backgroundImage }">
    <view class="top-line" @click="topLineClick"></view>
    <view class="player-image-box">
      <image :class="['player-image', store.currentSong.playing ? 'playing' : 'stop']" :src="store.currentSong.image"></image>
    </view>
    <view class="player-song-info">
      <view class="left">
        <text class="name">{{ store.currentSong.name }}</text>
        <text class="singer">{{ store.currentSong.singer }}</text>
      </view>
      <text class="icon-gengduo"></text>
    </view>
    <view :class="['player-songtime', store.timeMoving ? 'moving' : '']">
      <view class="songtime-bar">
        <Process :init="30" show-text @moves="store.setTimeMoving(true)" @movee="store.setTimeMoving(false)"></Process>
      </view>
    </view>
    <view class="player-btns">
      <text class="icon-next-fill roate"></text>
      <text @click.stop="playOrPause" :class="store.currentSong.playing ? 'icon-pause-fill song-btn' : 'icon-play-fill song-btn'"></text>
      <text class="icon-next-fill"></text>
    </view>
    <view :class="['player-voice', store.vioceMoving ? 'moving' : '']">
      <text class="icon-shengyin03-mianxing"></text>
      <view class="voice-bar">
        <Process :init="30" @moves="store.setVoiceMoving(true)" @movee="store.setVoiceMoving(false)"></Process>
      </view>
      <text class="icon-shengyin01-mianxing"></text>
    </view>
  </view>
  
</template>
  
<script setup name="player">
  import analyze from 'rgbaster'
  import Process from '@/components/process/index'
  import { useStore } from '@/store/main/index'
  import { watch, ref } from 'vue';


  const backgroundImage = ref('linear-gradient(RGB(88, 88, 96), RGB(52, 50, 55))')
  const store = useStore()

  watch(() => store.currentSong.image, async (old, newV) => {
    const newVal = old || newV
    if (Reflect.has(store.cacheSongImageBG, newVal)) {
      return store.cacheSongImageBG[newVal]
    }
    const result = await analyze(newVal, { scale: 0.1 })
    const colors = result.filter(r => r.count > 20).map(r => r.color)
    let bg
    if (colors.length > 0) {
      bg = `linear-gradient(${colors[0]}, ${colors[colors.length - 1]})`
    }
    store.putCacheSongImageBG(newVal, bg)
    backgroundImage.value = bg
  }, { immediate: true })

  function playOrPause() {
    store.currentSong.playing = !store.currentSong.playing
    if (store.currentSong.playing) { // 暂停
      
    } else {

    }
  }
  
  function topLineClick() {
    store.setPlayerShow(false)
  }
</script>
  
<style lang="scss">
.player {
  width: 100%;
  height: 100vh;
  padding: $player-padding;
  box-sizing: border-box;
  z-index: 2;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 0;
  transition: all .6s cubic-bezier(0.230, 1.000, 0.320, 1.000);
  &.show {
    transform: translateY(0);
    opacity: 1;
  }
  &.hide {
    transform: translateY(100vh);
    opacity: 0;
  }
  .top-line{
    width: $player-top-line-width;
    height: $player-top-line-height;
    border-radius: $player-top-line-radius;
    background-color: $bottom-bar-split-color;
    margin-top: $player-top-line-margin-top;
  }
  .player-image-box{
    width: $player-image-width-l;
    height: $player-image-width-l;
    margin-top: $player-image-margin-top;
    margin-bottom: $player-song-info-margin-top;
    display: flex;
    justify-content: center;
    align-items: center;
    .player-image {
      border-radius: $player-top-line-radius;
      transition: all .4s cubic-bezier(0.230, 1.000, 0.320, 1.000);
      &.playing {
        width: 100%;
        height: 100%;
      }
      &.stop {
        width: $player-image-width;
        height: $player-image-width;
      }
    }
  }
  .player-songtime {
    width: calc(100% - 2 * $process-padding);
    transition: $transition;
    margin-top: $player-song-time-margin-top;
    &:active,
    &.moving {
      transform: scaleX(1.04) scaleY(1.2);
      :deep(.process-text) {
        color: $uni-bg-color; 
      }
      :deep(.process) {
        background-color: $uni-bg-color;
        opacity: 1;
      }
    }
  }
  .player-voice {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: $player-voice-margin-top;
    height: calc(1.2 * $player-voice-bar-icon-size);
    transition: $transition;
    [class^=icon]{
      font-size: $player-voice-bar-icon-size;
      color: $player-voice-icon-color;
      opacity: .8;
    }
    .voice-bar {
      margin: $player-voice-bar-margin;
      width: calc($player-voice-bar-width - 2 * $process-padding);
    }
    &:active,
    &.moving {
      transform: scaleX(1.04) scaleY(1.2);
      [class^=icon] {
        color: $uni-bg-color;
      }
      :deep(.process) {
        background-color: $uni-bg-color;
        opacity: 1;
      }
    }
  }
  .player-btns {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: $player-btns-width;
    margin-top: $player-btns-margin-top;
    transition: $transition;
    .roate {
      transform: rotate(180deg);
    }
    [class^=icon] {
      font-size: $play-song-btn-size;
      color: $uni-bg-color;
    }
  }
  .player-song-info {
    width: calc(100% - 2 * $process-padding);
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      display: flex;
      flex-direction: column;
      .name {
        font-size: $player-song-info-name-size;
        font-weight: bold;
        color: $uni-bg-color;
      }
      .singer {
        font-size: $player-song-info-name-size;
        color: $player-voice-icon-color;
        opacity: .8;
      }
    }
    [class^=icon] {
      font-size: $player-song-info-icon-size;
      color: $uni-bg-color;
    }
  }
}

</style>