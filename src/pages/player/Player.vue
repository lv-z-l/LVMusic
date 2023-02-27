<template>
  <view :class="['player', store.playerShow ? 'show' : 'hide']" :style="{ backgroundImage }">
    <view class="top-line" @click="topLineClick"></view>
    <view class="player-image-box">
      <image :class="['player-image', store.currentSong.playing ? 'playing' : 'stop']" :src="store.currentSong.url">
      </image>
    </view>
    <view class="player-song-info">
      <view class="left">
        <text class="name">{{ store.currentSong.name }}</text>
        <text class="singer">{{ store.currentSong.author }}</text>
      </view>
      <text class="icon-gengduo"></text>
    </view>
    <view :class="['player-songtime', store.timeMoving ? 'moving' : '']">
      <view class="songtime-bar">
        <Process :init="store.currentSong.start" :auto-move-step="1000" :max="store.currentSong.time" auto-move
          :formatShowText="formatShowText" :min="0" :step="10000" show-text @moves="store.setTimeMoving(true)"
          @movee="onTimeMoveEnd">
        </Process>
      </view>
    </view>
    <view class="player-btns">
      <text class="icon-next-fill roate"></text>
      <text @click.stop="store.playOrPause"
        :class="store.currentSong.playing ? 'icon-pause-fill song-btn' : 'icon-play-fill song-btn'"></text>
      <text class="icon-next-fill"></text>
    </view>
    <view :class="['player-voice', store.vioceMoving ? 'moving' : '']">
      <text class="icon-shengyin03-mianxing"></text>
      <view class="voice-bar">
        <Process :init="0.5" :step="0.04" :max="1" :min="0" @moves="store.setVoiceMoving(true)" @movee="onVoiceMoveEnd">
        </Process>
      </view>
      <text class="icon-shengyin01-mianxing"></text>
    </view>
  </view>
</template>
  
<script setup>
import analyze from 'rgbaster'
import Process from '@/components/process/Process'
import { useStore } from '@/store/main/index'
import { watch, ref } from 'vue'
import Audio from '@/controlaudio'

const backgroundImage = ref('linear-gradient(RGB(88, 88, 96), RGB(52, 50, 55))')
const store = useStore()

watch(() => store.currentSong.url, async (newV, old) => {
  const newVal = newV || old
  if (!newVal) {
    return
  }
  if (Reflect.has(store.cacheSongImageBG, newVal)) {
    return store.cacheSongImageBG[newVal]
  }
  const result = await analyze(newVal, { scale: 0.1 })
  const colors = result.filter(r => r.count > 20).map(r => r.color)
  let bg
  if (colors.length > 0) {
    bg = `linear-gradient(${colors[0]}, ${colors[colors.length - 1]})`
  }
  if (bg) {
    store.putCacheSongImageBG(newVal, bg)
    backgroundImage.value = bg
  }
}, { immediate: true })

function topLineClick() {
  store.setPlayerShow(false)
}

function formatShowText(type, val) {
  if (type === 'min') {
    return val
  } else {
    if (val === 0) {
      return '0 分 0 秒'
    }
    const float = (val / 1000 / 60).toFixed(2).split('.')

    return float[0] + '分' + Math.ceil((Number('0.' + float[1]) * 60)) + '秒'
  }
}

function onTimeMoveEnd(val) {
  Audio.seek(val / 1000)
  store.setTimeMoving(false)
}

function onVoiceMoveEnd(val) {
  Audio.setVolume(val)
  store.setVoiceMoving(false)
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

  .top-line {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: calc($player-top-line-margin-top + $player-top-line-height) 0 0 0;
    position: relative;

    &::after {
      content: " ";
      width: $player-top-line-width;
      height: $player-top-line-height;
      border-radius: $border-radius;
      background-color: $bottom-bar-split-color;
      position: absolute;
      bottom: 0;
    }
  }

  .player-image-box {
    width: $player-image-width-l;
    height: $player-image-width-l;
    margin-top: $player-image-margin-top;
    margin-bottom: $player-song-info-margin-top;
    display: flex;
    justify-content: center;
    align-items: center;

    .player-image {
      border-radius: $border-radius;
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
      :deep(.process-text) {
        color: $white-color;
      }

      :deep(.process) {
        background-color: $white-color;
        opacity: 1;
      }

      :deep(.process-bar) {
        transform: scaleX(1.04) scaleY(1.6);
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

    [class^=icon] {
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
      [class^=icon] {
        color: $white-color;
      }

      :deep(.process) {
        background-color: $white-color;
        opacity: 1;
      }

      :deep(.process-bar) {
        transform: scaleX(1.04) scaleY(1.6);
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
      border-radius: 50%;
      $w-h: calc(1.4 * $play-song-btns-height);
      height: $w-h;
      width: $w-h;
      line-height: $w-h;
      text-align: center;
      font-size: calc(1.4 * $play-song-btn-size);
      color: $white-color;

      &:active:hover {
        animation: $player-btn-active-animation
      }
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
        color: $white-color;
      }

      .singer {
        font-size: $player-song-info-name-size;
        color: $player-voice-icon-color;
        opacity: .8;
      }
    }

    [class^=icon] {
      font-size: $player-song-info-icon-size;
      color: $white-color;
    }
  }
}

@keyframes larger {
  0% {
    font-size: calc(1.4 * $play-song-btn-size / 2);
    background-color: $play-song-btn-active-bg;
  }

  100% {
    font-size: calc(1.4 * $play-song-btn-size);
    background-color: none;
  }
}
</style>