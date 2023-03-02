<template>
  <view ref="content" class="content">
    <view class="status_bar">
      <!-- 这里是状态栏 -->
    </view>
    <view :class="['music-scroll', store.playerShow ? 'hide' : 'show']" @scroll.passive="onContentScroll">
      <transition name="fade" mode="out-in">
        <keep-alive>
          <component :is="store.currentComp" @show-songlist="showShowList"></component>
        </keep-alive>
      </transition>
      <view class="blank-block"></view>
      <view class="blank-block"></view>
    </view>
    <transition name="playbar">
      <view v-show="!store.playerShow" class="player-bar" @click="onPlayerBarClick">
        <image class="song-image slide-in-blurred-br"
          :src="store.currentSong.url + `?param=${store.songImageW}y${store.songImageW}`"></image>
        <text class="song-name">{{ store.currentSong.name }}</text>
        <view class="song-btns">
          <text @click.stop="store.playOrPause"
            :class="store.currentSong.playing ? 'icon-pause-fill song-btn' : 'icon-play-fill song-btn'"></text>
          <text @click.stop="next" class="icon-next-fill song-btn"></text>
        </view>
      </view>
    </transition>
    <transition name="bottombar">
      <view class="bottom-bar" v-show="!store.playerShow">
        <view :class="icon.comp === store.currentBar ? 'bar-item active' : 'bar-item'" @click="barItemClick(icon)"
          v-for="icon in iconList" :key="icon.icon">
          <text :class="icon.icon"></text>
          <text class="icontext">{{ store.langObj[icon.text] }}</text>
        </view>
      </view>
    </transition>
    <Player />
    <Message ref="msg" />
  </view>
</template>

<script setup>
import MainConfig from '@/config/index'
import Player from '@/pages/player/Player'
import { throttle } from '@/utils/index'
import { ref, reactive, onMounted } from 'vue'
import { useStore } from '@/store/main/index'
import Message from '../../components/message/Message.vue'

const content = ref()

const msg = ref()

onMounted(() => {
  const w = content.value.$el.clientWidth
  const h = content.value.$el.parentNode.parentNode.clientHeight
  // 0.53 是 padding
  const contentW = Number.parseInt((w - (0.053 * w * 3)) / 2)
  const cw = Number.parseInt((w - (0.053 * w * 2)))
  const _w = Number.parseInt(cw * 0.143)
  store.setImageWidth(contentW, w, h * 0.6, _w)
  store.regMessage(msg)
})

const iconList = reactive(MainConfig.mainBottomBar.icons)

const store = useStore()

const onContentScroll = throttle(event => {
  store.updateScrollHeight(event)
}, 60)

function barItemClick(icon) {
  store.setCurrentBar(icon.comp)
}

function onPlayerBarClick() {
  store.setPlayerShow(true)
}

function showShowList() {
  store.setCurrentBar('songlist')
}

function onLoad() {

}

function next() {

}
</script>

<style lang="scss">
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
}

.music-scroll {
  height: 100vh;
  overflow: auto;
  transition: $transition;

  &.hide {
    transform: scale(.94);
  }

  &.show {
    transform: scale(1);
  }

  .blank-block {
    width: 100%;
    height: $bottom-bar-height;
  }
}

.bottom-bar {
  width: 100%;
  height: $bottom-bar-height;
  position: fixed;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  box-sizing: border-box;
  border-top: 1rpx solid $bottom-bar-split-color;
  background-color: $bg;
  backdrop-filter: $backdrop-filter;
  align-items: center;
  bottom: 0;

  .bar-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    [class^=icon-] {
      font-size: $bottom-bar-icon-size;
      margin: $bottom-bar-icon-margin;
      color: $bottom-bar-icon-color;
    }

    .icontext {
      font-size: $bottom-bar-text-size;
      color: $bottom-bar-text-color;
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
  bottom: $bottom-bar-height;
  position: fixed;
  width: 100%;
  height: $bottom-bar-height;
  background-color: $bg;
  backdrop-filter: $backdrop-filter;
  padding: $global-padding;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-around;

  .song-image {
    width: $play-song-image-width;
    height: $play-song-image-height;
    border-radius: calc($border-radius / 2);
    margin-right: $play-song-name-margin;
    flex: 0 0 auto;
  }

  .song-name {
    font-size: $play-song-name-size;
    flex: 8 0 auto;
  }

  .song-btns {
    display: flex;
    justify-content: space-between;
    flex: 1 0 auto;
    margin-left: $play-song-name-margin;

    .song-btn {
      height: $play-song-btns-height;
      width: $play-song-btns-height;
      line-height: $play-song-btns-height;
      text-align: center;
      font-size: $play-song-btn-size;
      border-radius: 50%;

      &:active:hover {
        animation: $player-btn-active-animation
      }

    }
  }
}

@keyframes larger {
  0% {
    font-size: calc($play-song-btn-size / 2);
    background-color: $play-song-btn-active-bg;
  }

  100% {
    font-size: $play-song-btn-size;
    background-color: none;
  }
}

/*
    进入和离开动画可以使用不同
    持续时间和速度曲线。
  */
.playbar-enter-active,
.playbar-leave-active,
.bottombar-enter-active,
.bottombar-leave-active {
  transition: $transition;
}

.playbar-enter-from,
.playbar-leave-to {
  transform: translateY(-$bottom-bar-height);
  opacity: $opacity-zero;
}

.bottombar-enter-from,
.bottombar-leave-to {
  transform: translateY($bottom-bar-height);
  opacity: $opacity-zero;
}

.slide-in-blurred-br {
  animation: slide-in-blurred-br 0.6s cubic-bezier(0.230, 1.000, 0.320, 1.000) .2s both;
}

@keyframes slide-in-blurred-br {
  from {
    transform: translate($bottom-bar-height, $bottom-bar-height);
    opacity: $opacity-zero;
  }

  to {
    transform: translate(0, 0);
    opacity: $opacity-one;
  }
}
</style>
