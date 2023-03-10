<template>
  <view class="songlist">
    <PageFrame>
      <Back :title="store.songs.name"></Back>
      <view class="song-info"
        :style="{ width: store.clientW + 'px', height: store.songListImgH + 'px', backgroundImage: 'url(' + store.songs.coverImgUrl + `?param=${store.clientW}y${store.songListImgH}` + ')' }">
        <view class="name">{{ store.songs.name }}</view>
        <view class="btns">
          <view class="iconfont icon-play-fill btn">{{ store.langObj.play }}</view>
          <view class="iconfont icon-suijibofang btn">{{ store.langObj.anyPlay }}</view>
        </view>
        <view class="desc">
          {{ store.songs.description }}
          <view class="more">{{ store.langObj.more }}</view>
        </view>
      </view>
      <view class="list">
        <view style="width: 100%;">
          <SongListItem v-for="song in store.songs.lists" show-icon :key="song.id" :song="song"></SongListItem>
        </view>
      </view>
    </PageFrame>
  </view>
</template>
<script setup>
import PageFrame from '@/components/pageframe/PageFrame'
import Back from '@/components/back/Back.vue'
import SongListItem from '@/components/songlistitem/SongListItem.vue';
import { useStore } from '../../store/main';

import { getSongListByCateId } from '@/apis/category'

const store = useStore()

store.regLoadMore('songlist', () => {
  if (!store.songs.more) {
    return
  }
  const loadMore = store.songs.loadMore
  if (loadMore) {
    return loadMore()
  }
  getSongListByCateId({ id: store.songs.sheetId, limit: 20, offset: store.songs.lists.length - 1 }).then(res => {
    const { tracks } = res.playlist
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
    store.songs.lists.push(...lists)
  })
})
</script>
<style lang="scss">
.songlist {
  position: relative;
  bottom: var(--status-bar-height);

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
        background-color: $bg;
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
      max-height: calc(4 * $song-sheet-playcount-size);
      overflow: hidden;
      width: 100%;
      position: relative;

      .more {
        position: absolute;
        right: 0;
        bottom: 0;
        backdrop-filter: blur(12px);
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