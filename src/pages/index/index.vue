<template>
  <view class="content">
    <view :class="['music-scroll', store.playerShow ? 'hide' : 'show']">
      <transition name="fade" mode="out-in">
        <Recommend v-if="store.currentCompKey === 'recommend'"></Recommend>
        <Mine v-else-if="store.currentCompKey === 'mine'"></Mine>
        <SongList v-else-if="store.currentCompKey === 'songlist'"></SongList>
        <CateGory v-else-if="store.currentCompKey === 'category'"></CateGory>
        <Search v-else-if="store.currentCompKey === 'search'"></Search>
      </transition>
    </view>
    <view class="bottom-fixed-bar">
      <view v-show="!store.playerShow" class="player-bar" @tap="onPlayerBarClick">
        <image class="song-image slide-in-blurred-br"
          :src="store.currentSong.url + `?param=${store.songImageW}y${store.songImageW}`"></image>
        <text class="song-name">{{ store.currentSong.name }}</text>
        <view class="song-btns">
          <text @tap.stop="playOrPause" :class="playOrPauseCls"></text>
          <text @tap.stop="next" :class="nextCls"></text>
        </view>
      </view>
      <view class="bottom-bar" v-show="!store.playerShow">
        <view :class="icon.comp === store.currentBar ? 'bar-item active' : 'bar-item'" @tap="barItemClick(icon)"
          v-for="icon in iconList" :key="icon.icon">
          <text :class="icon.icon"></text>
          <text class="icontext">{{ store.langObj[icon.text] }}</text>
        </view>
      </view>
    </view>
    <Player ref="player" />
    <Message ref="msg" />
    <Loading />
  </view>
</template>

<script setup>
import MainConfig from '@/config/index'
import Player from '@/pages/player/Player'
import { ref, reactive, onMounted, onBeforeMount } from 'vue'
import { useStore } from '@/store/main/index'
import Message from '@/components/message/Message.vue'
import Loading from '@/components/loading/Loading.vue'

import Recommend from '@/pages/recommend/Recommend.vue'
import Mine from '@/pages/mine/Mine.vue'
import SongList from '@/pages/songlist/SongList.vue'
import CateGory from '@/pages/category/CateGory.vue'
import Search from '@/pages/search/Search.vue'

import { usePlayerBtns } from '@/use/usePlayerBtns.js'

const { playOrPause, playOrPauseCls, next, nextCls } = usePlayerBtns()

const msg = ref()

const player = ref()

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
  const PLAY_LIST_IMAGE_H = h * 0.48
  const SONG_IMAGE_W_BIG_P = w * 0.872
  store.setImageWidth(PLAY_LIST_ITEM_W, w, PLAY_LIST_IMAGE_H, SONG_IMAGE_W_LITTLE, C_W_NO_PADDING, SONG_IMAGE_W_BIG, SONG_IMAGE_W_BIG_P, h)
  store.regMessage(msg)
})

const iconList = reactive(MainConfig.mainBottomBar.icons)

const store = useStore()

function barItemClick(icon) {
  store.setCurrentBar(icon.comp)
}

function onPlayerBarClick() {
  store.setPlayerShow(true)
}

</script>

<style lang="scss">
@import "@/style/keyframes.scss";

.content {
  height: 100vh;
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
    padding: 0 2rem;

    .iconfont {
      font-size: $bottom-bar-icon-size;
      margin: $bottom-bar-icon-margin;
      color: var(--bottom-bar-color);
    }

    .icontext {
      font-size: $bottom-bar-text-size;
    }

    &.active {

      .iconfont,
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

    .iconfont {
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
</style>
