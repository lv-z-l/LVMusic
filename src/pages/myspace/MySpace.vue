<template>
  <view class="my-space">
    <view class="avatar-box">
      <image class="avatar" :src="store.userInfo.avatarUrl"></image>
      <text class="nick-name">{{ store.userInfo.nickname }}</text>
      <text>{{ store.userInfo.gender === 1 ? store.langObj.genderMan : store.langObj.genderWoMan }}</text>
    </view>
    <view class="function">
      <view class="function-item" @click="getRecentSongList">
        <text class="icon-yinlegedanyinfu"></text>
        <text class="text">{{ store.langObj.latest }}</text>
      </view>
      <view class="function-item" @click="getLikeSong">
        <text class="icon-shoucang"></text>
        <text class="text">{{ store.langObj.like }}</text>
      </view>
    </view>
    <view class="like-playlists">
      <text class="title">{{ store.langObj.likeList }}</text>
      <view class="list">
        <SongSheet v-for="list in playList" :sheet="list" margin-r half-w :show-play-count="false">
        </SongSheet>
      </view>
    </view>
  </view>
</template>
<script setup>
import { reactive, onBeforeMount, nextTick } from 'vue';
import { useStore } from '../../store/main'
import SongSheet from '../../components/songsheet/SongSheet.vue';
import { getUserPlaylist, getRecentSonglist } from '@/apis/mine'
import { onSheetClick } from '@/use/useSongSheetClick.js'

const playList = reactive([])

const loadData = () => {
  store.userInfo.userId && getUserPlaylist(store.userInfo.userId).then(res => {
    const { playlist } = res
    const temp = playlist.map(play => {
      const { id, coverImgUrl, name, playCount, subscribed } = play
      return {
        id: id,
        name,
        coverImgUrl: coverImgUrl,
        playCount: playCount,
        subscribed
      }
    })
    playList.splice(0, playList.length, ...temp)
  })
}

onBeforeMount(loadData)

const store = useStore()

function getList(data) {
  const { list } = data
  const lists = list.map(song => {
    const { name, id, al, ar } = song.data
    return {
      name,
      id,
      url: al.picUrl,
      author: ar.map(t => t.name).join('、')
    }
  })
  return lists
}

function getLikeSong() {
  const likePlay = playList[0]
  onSheetClick(store, likePlay)
}

function getRecentSongList() {
  store.setSongs({
    sheetId: 'recent',
    coverImgUrl: '',
    description: store.langObj.recent,
    name: store.langObj.latest,
    lists: [],
    more: true,
    loadMore: () => {
      return getRecentSonglist({ limit: 20, offset: store.songs.lists.length }).then(res => {
        const lists = getList(res.data)
        !store.songs.coverImgUrl && (store.songs.coverImgUrl = lists[0].url)
        store.songs.lists.push(...lists)
      })
    }
  })
  nextTick(() => store.setCurrentBar('songlist'))
}
</script>
<style lang="scss">
.my-space {
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  padding: 0 $global-padding;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  .avatar-box {
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100vh / 8);
    margin-top: calc(2 * $page-frame-scroll-margin-top);
    background-color: var(--bg);
    border-radius: $border-radius;
    width: 100%;
    position: relative;

    .nick-name {
      margin-right: $category-text-margin;
    }

    .avatar {
      width: $avatar-width;
      height: $avatar-width;
      border-radius: 50%;
      position: absolute;
      top: calc(-0.5 * $avatar-width)
    }
  }

  .function,
  .like-playlists {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    min-height: calc(100vh / 4);
    margin-top: calc($page-frame-scroll-margin-top / 2);
    background-color: var(--bg);
    border-radius: $border-radius;
    padding: calc($page-frame-scroll-margin-top / 4);
    box-sizing: border-box;
    width: 100%;
  }

  .function {
    min-height: calc(100vh / 8);
    width: 100%;
    flex-direction: row;

    .function-item {
      display: flex;
      box-sizing: border-box;
      padding: calc($page-frame-scroll-margin-top / 4);
      flex-direction: column;
      align-items: center;
    }

    [class^=icon-] {
      font-size: $bottom-bar-icon-size;
      margin: $bottom-bar-icon-margin;
      color: $bottom-bar-active-color;
    }

    .text {
      font-size: calc($bottom-bar-text-size / 2);
    }
  }

  .like-playlists {
    flex-direction: column;

    .list,
    .title {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      box-sizing: border-box;
      padding: 0 calc($page-frame-scroll-margin-top / 4);

    }

    .list {
      margin-top: calc($page-frame-scroll-margin-top / 4);
    }

    .title {
      height: 10%;
      font-size: $song-sheet-playcount-size;
      align-items: center;
    }
  }

}
</style>