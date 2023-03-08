<template>
  <view class="recommend" v-if="!store.noLogin" v-loading="loading">
    <PageFrame :frame-name="store.langObj.recommend">
      <!-- swiper -->
      <view class="swiper-dayrecom-box">
        <swiper class="swiper" :style="{ height: pxh }" circular autoplay indicator-dots :interval="3000">
          <swiper-item class="swiper-item" v-for="s in store.swiperData" :key="s.encodeId">
            <text class="text">{{ s.typeTitle }}</text>
            <image class="img" :style="{ width: pxw, height: pxh }" :src="s.pic + `?param=${w}y${h}`"></image>
          </swiper-item>
        </swiper>
        <view class="song-palylist">
          <view class="title">{{ store.langObj.dayrecom }}</view>
          <DayRecommend />
        </view>
      </view>
      <!-- 歌曲、歌单 -->
      <view class="song-palylist" v-for="(block, index) in store.mainBlocks" :key="block.title">
        <view class="title">{{ block.title }}</view>
        <view class="song-content" v-if="index === 1">
          <view class="song-content-child" v-for="childRes in block.resources">
            <SongListItem v-for="song in childRes" :song="song"></SongListItem>
          </view>
        </view>
        <view class="playlist-content" v-else>
          <SongSheet v-for="resource in block.resources" :sheet="resource" margin-r></SongSheet>
        </view>
      </view>
    </PageFrame>
  </view>
  <NoLogin v-else />
</template>
  
<script setup>
import PageFrame from '@/components/pageframe/PageFrame'
import { watch, reactive, computed, ref, onBeforeMount } from 'vue'
import NoLogin from '../../common/nologin/NoLogin.vue'
import { useStore } from '../../store/main'
import { getHomePageData } from '@/apis/recommend'
import SongSheet from '../../components/songsheet/SongSheet.vue'
import SongListItem from '@/components/songlistitem/SongListItem.vue'
import DayRecommend from '../dayrecommend/DayRecommend.vue'


const w = computed(() => store.clientWNoPadding)
const h = computed(() => store.imageW)

const pxw = computed(() => w.value + 'px')
const pxh = computed(() => h.value + 'px')

const store = useStore()

const loading = ref(true)

const swiperData = []

const playLists = []

const songs = []

const mainBlocks = []

const playListsOther = []

onBeforeMount(() => {
  !store.noLogin && loadPageData()
})

/**
 * 处理滑动数据
 * @param {*} data 
 */
function resolveSwiperData(data) {
  const banners = data.extInfo.banners
  const filtered = banners.filter(item => item.typeTitle !== store.langObj.adv)
  filtered.forEach(banner => {
    if (banner.song) {
      const { name, id, al, ar } = banner.song
      banner.songs = {
        name,
        id,
        url: al.picUrl,
        author: ar.map(t => t.name).join('、')
      }
    }
  })
  swiperData.splice(0, swiperData.length, ...filtered)
}

/**
 * 处理歌单数据
 * @param {} data 
 */
function resolvePlayLists(data) {
  const { creatives } = data
  const genPlayList = (resource) => {
    const { resourceId, resourceExtInfo, uiElement } = resource
    const { mainTitle, image } = uiElement
    return {
      id: resourceId,
      name: mainTitle.title,
      coverImgUrl: image.imageUrl,
      playCount: resourceExtInfo.playCount
    }
  }
  const resolved = creatives.map(creative => {
    const resources = creative.resources
    if (resources.length > 1) {
      return resources.map((resource) => genPlayList(resource))
    } else if (resources.length === 1) {
      return genPlayList(resources[0])
    }
  })
  playLists.splice(0, playLists.length, ...resolved)
}

function resolveSongs(data) {
  const { creatives } = data
  const genPlayList = (resource) => {
    const { resourceId, resourceExtInfo, uiElement } = resource
    const { mainTitle, image } = uiElement
    return {
      id: resourceId,
      name: mainTitle.title,
      url: image.imageUrl,
      author: resourceExtInfo.artists.map(t => t.name).join('、')
    }
  }
  creatives.forEach((creative, cindex) => {
    const resources = creative.resources
    resources.forEach(resource => {
      (songs[cindex] ? songs[cindex] : (songs[cindex] = [])).push(genPlayList(resource))
    })
  })
}

function resolvePlayListsOther(data) {
  const { creatives } = data
  const genPlayList = (resource) => {
    const { creativeId, resources, uiElement } = resource
    const { mainTitle, image } = uiElement
    return {
      id: creativeId,
      name: mainTitle.title,
      coverImgUrl: image.imageUrl,
      playCount: resources[0].resourceExtInfo.playCount
    }
  }
  playListsOther.splice(0)
  creatives.forEach(creative => {
    playListsOther.push(genPlayList(creative))
  })
}

function resolveMianTitle(blkcs) {
  const resolved = blkcs.filter(block => block.showType !== 'BANNER').map(block => ({ title: block.uiElement.subTitle.title }))
  mainBlocks.splice(0)
  resolved[0].resources = playLists
  resolved[1].resources = songs
  resolved[2].resources = playListsOther
  mainBlocks.push(...resolved)
}

function loadPageData() {
  if (store.mainBlocks.length === 0) {
    getHomePageData().then(res => {
      if (res.data && res.data.blocks) {
        const blocks = res.data.blocks
        resolveSwiperData(blocks[0])
        resolvePlayLists(blocks[1])
        resolveSongs(blocks[2])
        resolvePlayListsOther(blocks[3])
        resolveMianTitle(res.data.blocks)
        store.$patch({
          mainBlocks
        })
        store.$patch({
          swiperData
        })
        loading.value = false
      }
    })
  } else {
    loading.value = false
  }
}

watch(() => store.noLogin, (val) => {
  if (val === false) {
    loadPageData()
  }
})

</script>
  
<style lang="scss">
.swiper-dayrecom-box {
  display: flex;
  flex-direction: column;
}

.swiper {
  width: 100%;
  padding: $global-padding;
  box-sizing: border-box;
  margin-top: $player-top-line-margin-top;

  .swiper-item {
    border-radius: $border-radius;

    .text {
      position: absolute;
      bottom: $song-sheet-playcount-size;
      right: $song-sheet-playcount-size;
      font-size: $song-sheet-playcount-size;
      color: $white-color;
      background-color: $bg-d;
      padding: calc($song-sheet-playcount-size / 2);
      border-radius: $song-sheet-playcount-size;
      z-index: 3;
    }
  }
}

.song-palylist {
  width: 100%;
  padding: $global-padding;
  box-sizing: border-box;
  margin-top: $player-top-line-margin-top;

  .title {
    font-size: $page-frame-fixed-text-size;
    padding: 0 0 calc($page-frame-fixed-text-size / 2) 0;
  }

  .song-content {
    display: flex;
    width: 100%;
    overflow-x: auto;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }

    .song-content-child {
      width: calc(100% - 5.33%);
      flex: 0 0 auto;
    }
  }

  .playlist-content {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    overflow-x: auto;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
}
</style>