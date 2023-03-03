<template>
  <view class="song-list-item" @click="playSong">
    <LazyLoader :w="w + 'px'" :h="w + 'px'">
      <image class="song-image" :src="props.song.url + `?param=${w}y${w}`"></image>
    </LazyLoader>
    <view class="name-author">
      <text class="name">{{ props.song.name }}</text>
      <text class="author">{{ props.song.author }}</text>
    </view>
    <view v-if="props.showIcon" class="icon-gengduo1 menu"></view>
  </view>
</template>
<script setup>
import { computed } from 'vue';
import { useStore } from '../../store/main';
import LazyLoader from '@/components/lazyloader/LazyLoader.vue'
import { getSongUrlById } from '@/apis/song'
import Audio from '@/controlaudio'
const store = useStore()
const props = defineProps({
  song: Object,
  showIcon: Boolean
})

const w = computed(() => store.songImageW)
function playSong() {
  getSongUrlById(props.song.id).then(res => {
    const copy = Object.assign({}, props.song)
    copy.playing = true
    copy.musicUrl = res.data[0].url
    if (!copy.musicUrl) {
      return store.msg.open({ i: 'icon-suijibofang', msg: store.langObj.cantPlay })
    }
    copy.time = res.data[0].time
    copy.start = 0
    store.$patch({ currentSong: copy })
    store.setPlayerShow(true)
    Audio.play(copy.musicUrl)
  })
}

</script>
<style lang="scss">
.song-list-item {
  width: 100%;
  height: $bottom-bar-height;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 0 0 auto;

  .song-image {
    flex: 0 0 auto;
    width: $play-song-image-width;
    height: $play-song-image-height;
    margin-right: $play-song-name-margin;
    border-radius: $border-radius;
  }

  .name-author {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    width: calc(100% - $play-song-name-margin - 2 * $play-song-image-width);
    font-size: $play-song-name-size;

    .name {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .author {
      font-size: calc(0.6 * $play-song-name-size);
      color: $bottom-bar-text-color;
      padding-top: calc(0.4 * $play-song-name-size);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }


  .menu {
    font-size: calc(1.5 * $play-song-name-size);
    color: $black-color;
  }
}
</style>