<template>
  <view class="songlist">
    <Back />
    <PageFrame>
      <view class="song-info"
        :style="{ width: store.clientW + 'px', height: store.clientH + 'px', backgroundImage: 'url(' + store.songs.coverImgUrl + `?param=${store.clientW}y${store.clientH}` + ')' }">
        <view class="name">{{ store.songs.name }}</view>
        <view class="btns">
          <view class="icon-play-fill btn">播放</view>
          <view class="icon-suijibofang btn">随机播放</view>
        </view>
        <view class="desc">
          {{ store.songs.description }}
          <view class="more">更多</view>
        </view>
      </view>
      <view class="list">
        <SongListItem v-for="song in store.songs.lists" :key="song.id" :song="song"></SongListItem>
      </view>
    </PageFrame>
  </view>
</template>
<script setup>
import PageFrame from '@/components/pageframe/PageFrame'
import Back from '@/components/back/Back.vue'
import SongListItem from '@/components/songlistitem/SongListItem.vue';
import { useStore } from '../../store/main';

const store = useStore()
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
    padding: $global-padding;
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
    padding: $global-padding;
  }
}
</style>