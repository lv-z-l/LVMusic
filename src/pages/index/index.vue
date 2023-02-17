<template>
  <view class="content">
    <view class="status_bar">
      <!-- 这里是状态栏 -->
    </view>
    <view :class="['music-scroll', store.playerShow ? 'hide' : 'show']">
      <view class="music-content">

      </view>
    </view>
    <transition name="playbar">
      <view v-show="!store.playerShow" class="player-bar" @click="onPlayerBarClick">
        <image class="song-image slide-in-blurred-br" src="https://y.gtimg.cn/music/photo_new/T002R300x300M000002HcXA60aeTLD.jpg"></image>
        <text class="song-name">Song Name</text>
        <view class="song-btns">
          <text :class="store.currentSong.playing ? 'icon-pause-fill song-btn' : 'icon-play-fill song-btn'"></text>
          <text class="icon-next-fill song-btn"></text>
        </view>
      </view>
    </transition>
    <transition name="bottombar">
      <view class="bottom-bar" v-show="!store.playerShow">
        <view :class="icon.text === store.currentBar ? 'bar-item active' : 'bar-item'" @click="barItemClick(icon)" v-for="icon in iconList" :key="icon.icon">
          <text :class="icon.icon"></text>
          <text class="icontext">{{ icon.text }}</text>
        </view>
      </view>
    </transition>
    <player/>
  </view>
</template>

<script setup name="main">
import MainConfig from '@/config/index'
import player from '@/pages/player/index'
import { reactive, nextTick } from 'vue';
import { useStore } from '@/store/main/index'

const iconList = reactive(MainConfig.mainBottomBar.icons)

const store = useStore()

function barItemClick(icon) {
  store.setCurrentBar(icon.text)
}

function onPlayerBarClick() {
  store.setPlayerShow(true)
}

function onLoad() {

}
</script>

<style lang="scss">
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
}
.music-scroll {
  height: calc(100vh - 2 * $bottom-bar-height);
  background-color: aqua;
  overflow: auto;
  transition: $transition;
  &.hide {
    transform: scale(.94);
  }
  &.show {
    transform: scale(1);
  }
}
.bottom-bar{
  width: 100%;
  height: $bottom-bar-height;
  position: fixed;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  box-sizing: border-box;
  border-top: 1px solid $bottom-bar-split-color;
  background-color: $bottom-bar-bg-color;
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
    .icontext{
      font-size: $bottom-bar-text-size;
      color: $bottom-bar-text-color;
    }
    &.active {
      [class^=icon-],.icontext {
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
  background-color: $bottom-bar-bg-color;
  padding: $global-padding;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-around;
	.song-image {
		width: $play-song-image-width;
		height: $play-song-image-width;
	}
  .song-name {
    width: $play-song-name-width;
    margin: $play-song-name-margin;
    font-size: $play-song-name-size;
    flex: 8 0 auto;
  }
  .song-btns {
    width: $play-song-btns-width;
    display: flex;
    justify-content: space-between;
    flex: 1 0 auto;
    .song-btn{
      font-size: $play-song-btn-size;
    }
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
  }

  .slide-in-blurred-br {
    animation: slide-in-blurred-br 0.4s cubic-bezier(0.230, 1.000, 0.320, 1.000) both;
  }
  @keyframes slide-in-blurred-br {
    from {
      transform: translate(2 * $bottom-bar-height, 2 * $bottom-bar-height);
      opacity: $opacity-zero;
    }
    to {
      transform: translate(0, 0);
      opacity: $opacity-one;
    }
  }
</style>
