<template>
  <view class="song-list-item" @click="playSong">
    <image class="song-image" :src="props.song.url + `?param=${store.songImageW}y${store.songImageW}`"></image>
    <view class="right">
      <view class="name-author">
        <text>{{ props.song.name }}</text>
        <text class="author">{{ props.song.author }}</text>
      </view>
      <view class="icon-gengduo menu"></view>
    </view>
  </view>
</template>
<script setup>
import { useStore } from '../../store/main';
import { getSongUrlById } from '@/apis/category'
import Audio from '@/controlaudio'
const store = useStore()
const props = defineProps({
  song: Object
})

function playSong() {
  getSongUrlById(props.song.id).then(res => {
    const copy = Object.assign({}, props.song)
    store.setPlayerShow(true)
    copy.playing = true
    copy.musicUrl = res.data[0].url
    store.$patch({ currentSong: copy })
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
  justify-content: center;

  .song-image {
    flex: 0 0 auto;
    width: $play-song-image-width;
    height: $play-song-image-height;
    margin-right: $play-song-name-margin;
    border-radius: $border-radius;
  }

  .right {
    flex: 2 0 auto;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: calc(100% - $play-song-name-margin - $play-song-image-width);

    .name-author {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      font-size: $play-song-name-size;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      .author {
        font-size: calc(0.6 * $play-song-name-size);
        color: $bottom-bar-text-color;
        padding-top: calc(0.4 * $play-song-name-size);
      }
    }

    .menu {
      font-size: calc(1.5 * $play-song-name-size);
      color: $black-color;
    }
  }
}
</style>