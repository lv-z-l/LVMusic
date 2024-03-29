<template>
  <view class="songlist" v-loading="loading">
    <Back :title="store.songs.name"></Back>
    <PageFrame>
      <view class="song-info"
        :style="{ width: store.clientW + 'px', height: store.songListImgH + 'px', backgroundImage: !store.songs.coverImgUrl ? '' : 'url(' + store.songs.coverImgUrl + `?param=${store.clientW}y${store.songListImgH}` + ')' }">
        <view class="name">{{ store.songs.name }}</view>
        <view class="btns">
          <view class="icon-play-fill btn" @click="next">{{ store.langObj.play }}</view>
          <view class="icon-suijibofang btn" @click="next">{{ store.langObj.anyPlay }}</view>
        </view>
        <view class="desc">
          {{ store.songs.description }}
        </view>
      </view>
      <view class="list">
        <SongListItem v-for="song in store.songs.lists" show-icon :key="song.id" :song="song"></SongListItem>
      </view>
    </PageFrame>
  </view>
</template>
<script setup>
import PageFrame from '@/components/pageframe/PageFrame'
import Back from '@/components/back/Back.vue'
import SongListItem from '@/components/songlistitem/SongListItem.vue'
import { useStore } from '../../store/main';

import { getSongListByCateId } from '@/apis/category'
import { onMounted, ref, onDeactivated, onActivated } from 'vue'
import { usePlayerBtns } from '@/use/usePlayerBtns.js'
const { next } = usePlayerBtns()

const store = useStore()

const loading = ref(true)

onDeactivated(() => loading.value = true)

onActivated(() => setTimeout(() => loading.value = false, 1000))

onMounted(() => setTimeout(() => loading.value = false, 1000))

store.regLoadMore('songlist', () => {
  if (!store.songs.more && store.songs.sheetId !== '0') {
    return store.msg.open({ msg: store.langObj.nomore })
  }
  loading.value = true
  const loadMore = store.songs.loadMore
  if (loadMore) {
    return loadMore()
      .then(() => loading.value = false)
      .catch(() => loading.value = false)
  }
  getSongListByCateId({ id: store.songs.sheetId, limit: 20, offset: store.songs.lists.length }).then(res => {
    const { tracks, trackCount, description } = res.playlist
    if (!tracks || tracks.length === 0) {
      return
    }
    const lists = tracks.map(track => {
      const { name, id, al, ar } = track
      return {
        name,
        id,
        url: al.picUrl,
        author: ar.map(t => t.name).join('、')
      }
    })
    loading.value = false
    store.songs.lists.push(...lists)
    store.songs.more = trackCount > store.songs.lists.length
    !store.songs.description && (store.songs.description = description)
  })
    .catch(() => loading.value = false)
})
</script>
<style lang="scss">
.songlist {
  width: 100%;
  box-sizing: border-box;
  z-index: 2;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;

  .song-info {
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    align-items: center;
    padding: 0 $global-padding;
    box-sizing: border-box;
    color: $white-color;
    font-size: $player-song-info-name-size;
    text-align: center;

    .btns {
      margin-top: $category-text-margin;
      width: 100%;
      display: flex;
      justify-content: space-between;

      .btn {
        height: calc(2 * $player-song-info-name-size);
        font-size: $player-song-info-name-size;
        background-color: var(--bg);
        border-radius: $border-radius;
        backdrop-filter: $backdrop-filter;
        width: 45%;
        display: flex;
        justify-content: center;
        align-items: center;

        &::before {
          margin-right: $process-padding;
        }
      }
    }

    .desc {
      margin: $category-text-margin 0;
      font-size: $song-sheet-playcount-size;
      max-height: 10rem;
      text-align: left;
      width: 100%;
      position: relative;

      .more {
        position: absolute;
        right: 0;
        bottom: 0;
        backdrop-filter: blur($backdrop-filter);
        padding: 0 $song-sheet-playcount-size;
      }
    }
  }

  .list {
    padding: 0 $global-padding;
    display: flex;
    flex-wrap: wrap;
  }
}
</style>