<template>
  <view class="song-list-item" @click="playSong(store, props.song)">
    <LazyLoader :w="w + 'px'" :h="w + 'px'">
      <image class="song-image" :src="props.song.url + `?param=${w}y${w}`" :alt="song.name"></image>
    </LazyLoader>
    <view class="name-author">
      <text class="name">{{ props.song.name }}</text>
      <text class="author">{{ props.song.author }}</text>
      <text class="recommend-res" v-if="props.song.recommendRes">{{
        props.song.recommendRes
      }}</text>
    </view>
    <view v-if="props.showIcon" :class="['icon-shoucang menu', store.likeList.includes(props.song.id) ? 'like' : '']"
      @click="like(props.song.id)"></view>
  </view>
</template>
<script setup>
import { computed } from 'vue'
import { useStore } from '../../store/main'
import LazyLoader from '@/components/lazyloader/LazyLoader.vue'
import { playSong } from '@/use/useSongSheetClick.js'
import { likeSong } from '@/apis/mine'

const store = useStore()
const props = defineProps({
  song: Object,
  showIcon: Boolean
})

const w = computed(() => store.songImageW)

function like(id) {
  likeSong(id).then(() => {
    store.msg.open({ msg: store.langObj.likesuccess, type: 'success' })
    store.likeList.unshift(id)
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
    height: $play-song-image-width;
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
      color: var(--bottom-bar-color);
      // padding-top: calc(0.4 * $play-song-name-size);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .recommend-res {
      &::before {
        content: "⭐️ ";
      }

      color: $bottom-bar-active-color;
      font-size: .4rem;
    }
  }


  .menu {
    flex: 2 0 auto;
    text-align: right;
    font-size: calc(1.5 * $play-song-name-size);

    &.like {
      color: $bottom-bar-active-color;
    }
  }
}
</style>