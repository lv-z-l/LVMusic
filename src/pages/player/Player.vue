<template>
  <view :class="['player-box', store.playerShow ? 'show' : 'hide']" :style="{ backgroundImage: bkImage }">
    <view class="player">
      <view class="top-line" @tap="topLineClick"></view>
      <view class="player-image-box" :style="{ width: store.songImageWBigP + 'px', height: store.songImageWBigP + 'px' }">
        <image ref="bg" @load="onImageLoaded"
          :style="{ width: store.songImageWBig + 'px', height: store.songImageWBig + 'px' }"
          :class="['player-image', store.currentSong.playing ? 'playing' : 'stop']"
          :src="store.currentSong.url + `?param=${store.songImageWBig}y${store.songImageWBig}`">
        </image>
      </view>
      <view class="player-song-info">
        <view class="left">
          <text class="name">{{ store.currentSong.name }}</text>
          <text class="singer">{{ store.currentSong.author }}</text>
        </view>
        <text :class="['iconfont icon-shoucang', store.likeList.includes(store.currentSong.id) ? 'like' : '']"
          @tap="like"></text>
      </view>
      <view :class="['player-songtime', store.timeMoving ? 'moving' : '']">
        <view class="songtime-bar">
          <Process :init="store.currentSong.start" :auto-move-step="1000" :max="store.currentSong.time" auto-move
            :formatShowText="formatShowText" :min="0" :step="10" show-text @moves="store.setTimeMoving(true)"
            @movee="onTimeMoveEnd">
          </Process>
        </view>
      </view>
      <view class="player-btns">
        <text class="iconfont icon-next-fill roate" @tap="nextOrlast(true)"></text>
        <text @tap.stop="store.playOrPause"
          :class="store.currentSong.playing ? 'iconfont icon-pause-fill song-btn' : 'iconfont icon-play-fill song-btn'"></text>
        <text class="iconfont icon-next-fill" @tap="nextOrlast()"></text>
      </view>
      <view :class="['player-voice', store.vioceMoving ? 'moving' : '']">
        <text class="iconfont icon-shengyin03-mianxing"></text>
        <view class="voice-bar">
          <Process :init="0.5" :step="0.04" :max="1" :min="0" @moves="store.setVoiceMoving(true)" @movee="onVoiceMoveEnd">
          </Process>
        </view>
        <text class="iconfont icon-shengyin01-mianxing"></text>
      </view>
    </view>
  </view>
</template>
  
<script setup>

import Process from '@/components/process/Process'
import { useStore } from '@/store/main/index'
import { computed, onMounted, nextTick } from 'vue'
import Audio from '@/controlaudio'
import { playSong } from '@/use/useSongSheetClick.js'
import { likeSong } from '@/apis/mine'

const store = useStore()

const nextOrlast = (last) => {
  if (!store.songs.lists) return
  const song = store.songs.lists.find(song => song.id === store.currentSong.id)
  const index = store.songs.lists.indexOf(song)
  const l = store.songs.lists.length
  if (last) {
    playSong(store, store.songs.lists[index > 0 ? index - 1 : l - 1])
  } else {
    playSong(store, store.songs.lists[index < l - 1 ? index + 1 : 0])
  }
}

onMounted(() => {
  Audio.regEvent(nextOrlast, nextOrlast.bind(null, true), nextOrlast)
})

const bkImage = computed(() => {
  return store.currentSong.url ? 'url(' + store.currentSong.url + `?param=${store.clientW}y${store.clientH}` + ')' : 'linear-gradient(RGB(88, 88, 96), RGB(52, 50, 55))'
})

const { minute, second } = store.langObj

function onImageLoaded() {
  nextTick(() => store.currentSong.playing && store.setPlayerShow(true))
}

function like() {
  likeSong(store.currentSong.id).then(res => {
    store.msg.open({ msg: store.langObj.likesuccess, type: 'success' })
  })
}

function topLineClick() {
  store.setPlayerShow(false)
}

function formatShowText(type, val) {
  if (type === 'min') {
    return val
  } else if (type === 'cur') {
    const m = Number.parseInt(val / 60)
    const s = (val % 60)
    return m + minute + Number.parseInt(s) + second
  } else {
    if (val === 0) {
      return '0' + second
    }
    const float = (val / 1000 / 60).toFixed(2).split('.')

    return float[0] + minute + Math.ceil((Number('0.' + float[1]) * 60)) + second
  }
}

function onTimeMoveEnd(val) {
  Audio.seek(val)
  store.setTimeMoving(false)
}

function onVoiceMoveEnd(val) {
  Audio.setVolume(val)
  store.setVoiceMoving(false)
}
</script>
  
<style lang="scss">
.player-box {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  z-index: 2;
  background-repeat: no-repeat;
  background-size: cover;
  transition: all .6s cubic-bezier(0.230, 1.000, 0.320, 1.000);

  &.show {
    transform: translateY(0);
    opacity: 1;
  }

  &.hide {
    transform: translateY(100vh);
    opacity: 0;
  }
}

.player {
  width: 100%;
  height: 100%;
  display: flex;
  padding: $player-padding;
  backdrop-filter: blur(48px);
  padding-top: var(--status-bar-height);
  padding-bottom: 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: $global-padding;
  padding-right: $global-padding;
  box-sizing: border-box;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;

  .top-line {
    width: 100%;
    display: flex;
    justify-content: center;
    position: relative;
    align-items: center;
    padding: calc($player-top-line-margin-top) 0;

    &::after {
      content: " ";
      width: $player-top-line-width;
      height: $player-top-line-height;
      border-radius: $border-radius;
      background-color: $bottom-bar-split-color;
    }
  }

  .player-image-box {
    margin: $player-image-margin-top 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .player-image {
      border-radius: $border-radius;
      transition: all .4s cubic-bezier(0.230, 1.000, 0.320, 1.000);

      &.playing {
        width: 100% !important;
        height: 100% !important;
      }
    }
  }

  .player-songtime {
    width: calc(100% - 2 * $process-padding);
    transition: $transition;
    margin-top: $player-margin-top;

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
    margin-top: $player-margin-top;
    height: calc(1.2 * $player-voice-bar-icon-size);
    transition: $transition;

    .iconfont {
      font-size: $player-voice-bar-icon-size;
      color: $white-color;
      opacity: .8;
    }

    .voice-bar {
      margin: $player-voice-bar-margin;
      width: calc($player-voice-bar-width - 2 * $process-padding);
    }

    &:active,
    &.moving {
      .iconfont {
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
    margin-top: $player-margin-top;
    transition: $transition;

    .roate {
      transform: rotate(180deg);
    }

    .iconfont {
      border-radius: 50%;
      $w-h: calc(1.4 * $play-song-btns-height);
      height: $w-h;
      width: $w-h;
      line-height: $w-h;
      text-align: center;
      font-size: calc(1.4 * $play-song-btn-size);
      color: $white-color;
      transition: $transition;

      &:active {
        font-size: calc($play-song-btn-size / 2);
        background-color: $play-song-btn-active-bg;
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
        color: $white-color;
        opacity: .8;
      }
    }

    .iconfont {
      font-size: $player-song-info-icon-size;
      color: $white-color;
    }

    .like {
      color: $bottom-bar-active-color;
    }
  }
}
</style>