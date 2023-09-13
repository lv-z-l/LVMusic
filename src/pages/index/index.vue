<template>
  <view class="content">
    <view :class="['music-scroll', store.playerShow ? 'hide' : 'show']" @scroll.passive="onContentScroll">
      <transition name="fade" mode="out-in">
        <keep-alive>
          <component :is="store.currentComp"></component>
        </keep-alive>
      </transition>
    </view>
    <view class="bottom-fixed-bar">
      <view v-show="!store.playerShow" class="player-bar" @click="onPlayerBarClick">
        <image class="song-image slide-in-blurred-br"
          :src="store.currentSong.url + `?param=${store.songImageW}y${store.songImageW}`"></image>
        <text class="song-name">{{ store.currentSong.name }}</text>
        <view class="song-btns">
          <text @click.stop="playOrPause" :class="playOrPauseCls"></text>
          <text @click.stop="next" :class="nextCls"></text>
        </view>
      </view>
      <view class="bottom-bar" v-show="!store.playerShow">
        <view :class="icon.comp === store.currentBar ? 'bar-item active' : 'bar-item'" @click="barItemClick(icon)"
          v-for="icon in iconList" :key="icon.icon">
          <text :class="icon.icon"></text>
          <text class="icontext">{{ store.langObj[icon.text] }}</text>
        </view>
      </view>
    </view>
    <Player ref="player" />
    <Message ref="msg" />
  </view>
</template>

<script setup>
import MainConfig from '@/config/index'
import Player from '@/pages/player/Player'
import { throttle } from '@/utils/index'
import { ref, reactive, onMounted, onBeforeMount, onBeforeUnmount } from 'vue'
import { useStore } from '@/store/main/index'
import Message from '../../components/message/Message.vue'

import { usePlayerBtns } from '@/use/usePlayerBtns.js'

const { playOrPause, playOrPauseCls, next, nextCls } = usePlayerBtns()

const msg = ref()

onBeforeMount(() => {
  store.loginStatus()
  uni.offWindowResize(watchWindowResize)
})

onBeforeUnmount(() => Audio && Audio.instance && Audio.instance.destroy())

onMounted(() => {
  watchWindowResize()
  store.regMessage(msg)
  uni.onWindowResize(watchWindowResize)
})

function watchWindowResize() {
  store.setImageWidth()
}

const iconList = reactive(MainConfig.icons)

const store = useStore()

const onContentScroll = throttle(event => {
  store.updateScrollHeight(event)
}, 80)

function barItemClick(icon) {
  store.setCurrentBar(icon.comp)
}

function onPlayerBarClick() {
  store.setPlayerShow(true)
}

</script>

<style lang="scss">
.content {
  padding-top: var(--status-bar-height);
  padding-bottom: 0;
  height: 100vh;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box;
}

.music-scroll {
  overflow: auto;
  height: 100%;
  transition: $transition;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }


  &.hide {
    transform: scale(.94);
  }

  &.show {
    transform: scale(1);
  }
}

.bottom-fixed-bar {
  position: fixed;
  width: 100%;
  bottom: 0;
}

.bottom-bar {
  width: 100%;
  height: $bottom-bar-height;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  border-top: 1rpx solid $bottom-bar-split-color;
  background-color: var(--bg);
  backdrop-filter: $backdrop-filter;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  align-items: center;

  .bar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 $global-padding;

    [class^=icon-] {
      font-size: $bottom-bar-icon-size;
      margin: $bottom-bar-icon-margin;
      color: var(--bottom-bar-color);
    }

    .icontext {
      font-size: $bottom-bar-text-size;
    }

    &.active {

      [class^=icon-],
      .icontext {
        color: $bottom-bar-active-color;
      }
    }
  }
}

.player-bar {
  width: 100%;
  height: $bottom-bar-height;
  background-color: var(--bg);
  backdrop-filter: $backdrop-filter;
  padding: 0 $global-padding;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-around;

  .song-image {
    width: $play-song-image-width;
    height: $play-song-image-width;
    background-color: beige;
    border-radius: calc($border-radius / 2);
    margin-right: $play-song-name-margin;
  }

  .song-name {
    font-size: $play-song-name-size;
    flex: 1 0 auto;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: calc(100% - $play-song-name-margin - $play-song-image-width - $play-song-name-margin - 2 * $play-song-btns-height);
  }

  .song-btns {
    display: flex;
    justify-content: space-between;
    margin-left: $play-song-name-margin;

    [class^=icon] {
      height: $play-song-btns-height;
      width: $play-song-btns-height;
      line-height: $play-song-btns-height;
      text-align: center;
      font-size: $play-song-btn-size;
      border-radius: 50%;

      &.active {
        animation: playerBtn 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
      }

    }
  }
}

.slide-in-blurred-br {
  animation: slide-in-blurred-br 0.6s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

@keyframes slide-in-blurred-br {
  from {
    transform: translate($bottom-bar-height, -$bottom-bar-height);
    opacity: 0;
  }

  to {
    transform: translate(0, 0);
    opacity: 1;
  }
}

@keyframes playerBtn {
  0% {
    transform: scale(0);
    background-color: $play-song-btn-active-bg;
  }

  100% {
    transform: scale(1);
    background-color: unset;
  }

}
</style>
