<template>
  <view class="content">
    <view class="status_bar">
      <!-- 这里是状态栏 -->
    </view>
    <view :class="['music-scroll', store.playerShow ? 'hide' : 'show']">
      <keep-alive>
        <component :is="comp"></component>
      </keep-alive>
    </view>
    <transition name="playbar">
      <view v-show="!store.playerShow" class="player-bar" @click="onPlayerBarClick">
        <image class="song-image slide-in-blurred-br" :src="store.currentSong.image"></image>
        <text class="song-name">Song Name</text>
        <view class="song-btns">
          <text @click.stop="playOrPause" :class="store.currentSong.playing ? 'icon-pause-fill song-btn' : 'icon-play-fill song-btn'"></text>
          <text @click.stop="next" class="icon-next-fill song-btn"></text>
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
  import { reactive, shallowRef, defineAsyncComponent } from 'vue';
  import { useStore } from '@/store/main/index'

  const compMap = {
    category: defineAsyncComponent(() => import(/* webpackChunkName: "category" */'../category/index.vue')),
    recommend: defineAsyncComponent(() => import(/* webpackChunkName: "recommend" */'../recommend/index.vue')),
    search: defineAsyncComponent(() => import(/* webpackChunkName: "search" */'../search/index.vue'))
  }

  const comp = shallowRef({})

  const iconList = reactive(MainConfig.mainBottomBar.icons)

  const store = useStore()

  function barItemClick(icon) {
    store.setCurrentBar(icon.text)
    comp.value = compMap[icon.comp]
  }

  function onPlayerBarClick() {
    store.setPlayerShow(true)
  }

  function onLoad() {

  }

  function next() {

  }

  function playOrPause() {
    store.currentSong.playing = !store.currentSong.playing
    if (store.currentSong.playing) { // 暂停
      
    } else {

    }
  }
</script>

<style lang="scss">
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
}
.music-scroll {
  height: calc(100vh - 2 * $bottom-bar-height);
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
  border-top: 1rpx solid $bottom-bar-split-color;
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
    border-radius: $player-top-line-radius;
	}
  .song-name {
    width: $play-song-name-width;
    margin: $play-song-name-margin;
    font-size: $play-song-name-size;
    flex: 8 0 auto;
  }
  .song-btns {
    display: flex;
    justify-content: space-between;
    flex: 1 0 auto;
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
