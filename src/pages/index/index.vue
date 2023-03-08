<template>
  <view class="content">
    <!-- <view class="status_bar">
    </view> -->
    <view :class="['music-scroll', store.playerShow ? 'hide' : 'show']" @scroll.passive="onContentScroll">
      <transition name="fade" mode="out-in">
        <Recommend v-if="store.currentCompKey === 'recommend'"></Recommend>
      </transition>
      <transition name="fade" mode="out-in">
        <Mine v-if="store.currentCompKey === 'mine'"></Mine>
      </transition>
      <transition name="fade" mode="out-in">
        <SongList v-if="store.currentCompKey === 'songlist'"></SongList>
      </transition>
      <transition name="fade" mode="out-in">
        <CateGory v-if="store.currentCompKey === 'category'"></CateGory>
      </transition>
      <transition name="fade" mode="out-in">
        <Search v-if="store.currentCompKey === 'search'"></Search>
      </transition>
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
    <Loading />
  </view>
</template>

<script setup>
import MainConfig from '@/config/index'
import Player from '@/pages/player/Player'
import { throttle } from '@/utils/index'
import { ref, reactive, onMounted, onBeforeMount } from 'vue'
import { useStore } from '@/store/main/index'
import Message from '../../components/message/Message.vue'
import Loading from '../../common/loading/Loading.vue'

import Recommend from '@/pages/recommend/Recommend.vue'
import Mine from '@/pages/mine/Mine.vue'
import SongList from '@/pages/songlist/SongList.vue'
import CateGory from '@/pages/category/CateGory.vue'
import Search from '@/pages/search/Search.vue'

const msg = ref()

onBeforeMount(() => {
  store.loginStatus()
})

onMounted(() => {
  const windowInfo = uni.getWindowInfo()
  const { windowWidth: w, windowHeight: h } = windowInfo
  // 5.33% 是 padding
  const PLAY_LIST_ITEM_W = Number.parseInt((w - (0.0533 * w * 3)) / 2)
  const C_W_NO_PADDING = Number.parseInt((w - (0.0533 * w * 2)))
  const SONG_IMAGE_W_LITTLE = Number.parseInt(C_W_NO_PADDING * 0.143)
  const SONG_IMAGE_W_BIG = w * 0.64
  const PLAY_LIST_IMAGE_H = h * 0.6
  const SONG_IMAGE_W_BIG_P = w * 0.872
  store.setImageWidth(PLAY_LIST_ITEM_W, w, PLAY_LIST_IMAGE_H, SONG_IMAGE_W_LITTLE, C_W_NO_PADDING, SONG_IMAGE_W_BIG, SONG_IMAGE_W_BIG_P, h)
  store.regMessage(msg)
})

const iconList = reactive(MainConfig.mainBottomBar.icons)

const store = useStore()

const onContentScroll = throttle(event => {
  store.updateScrollHeight(event)
}, 100)

function barItemClick(icon) {
  store.setCurrentBar(icon.comp)
}

function onPlayerBarClick() {
  store.setPlayerShow(true)
}

function next() {

}
</script>

<style lang="scss">
.content {
  padding-top: var(--status-bar-height);
  padding-bottom: 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box;
}

// .status_bar {
//   height: var(--status-bar-height);
//   width: 100%;
// }

.music-scroll {
  overflow: auto;
  height: 100%;
  transition: $transition;

  &.hide {
    transform: scale(.94);
  }

  &.show {
    transform: scale(1);
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
  animation: slide-in-blurred-br 0.6s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

@keyframes slide-in-blurred-br {
  from {
    transform: translate($bottom-bar-height, -$bottom-bar-height);
    opacity: $opacity-zero;
  }

  to {
    transform: translate(0, 0);
    opacity: $opacity-one;
  }
}
</style>
