<template>
  <view class="my-space">
    <view class="avatar-box">
      <image class="avatar" :src="store.userInfo.avatarUrl"></image>
      <text class="nick-name">{{ store.userInfo.nickname }}</text>
      <text>{{ store.userInfo.gender === 1 ? store.langObj.genderMan : store.langObj.genderWoMan }}</text>
    </view>
    <view class="like-playlists" v-loading="loading">
      <text class="title">{{ store.langObj.likeList }}</text>
      <view class="list">
        <SongSheet v-for="list in playList" :sheet="list" margin-r :show-play-count="false">
        </SongSheet>
      </view>
    </view>
    <view ref="blankBlock" class="blank-block"></view>
  </view>
  
</template>
<script setup>
import { reactive, onBeforeMount, nextTick, ref } from 'vue'
import { useStore } from '../../store/main'
import SongSheet from '../../components/songsheet/SongSheet.vue'
import { getUserPlaylist, getRecentSonglist } from '@/apis/mine'

const store = useStore()

const playList = reactive([
  {
    id: 'RECENT',
    name: store.langObj.latest,
    coverImgUrl: store.userInfo.avatarUrl,
    playCount: 9999,
    subscribed: true
  }
])

const loading = ref(false)

const loadData = () => {
  if (store.userInfo.userId) {
    loading.value = true
    getUserPlaylist(store.userInfo.userId).then(res => {
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
      playList.splice(1, playList.length - 1, ...temp)
      loading.value = false
    }).catch(() => loading.value = false)
  }
}

onBeforeMount(loadData)
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

  .blank-block {
    width: 100%;
    height: calc(2 * $bottom-bar-height);
    flex: 0 0 auto;
  }

  .avatar-box {
    display: flex;
    flex: 0 0 auto;
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

  .like-playlists {
    flex-direction: column;
    flex: 0 0 auto;

    .list,
    .title {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      box-sizing: border-box;
      padding: 0 calc($page-frame-scroll-margin-top / 4);

    }

    .list {
      justify-content: space-evenly;
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