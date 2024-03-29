<template>
  <view class="recommend" v-if="!store.noLogin" v-loading="loading">
    <PageFrame :frame-name="store.langObj.recommend">
      <!-- swiper -->
      <view class="swiper-dayrecom-box">
        <swiper class="swiper" :style="{ height: pxh }" circular autoplay indicator-dots :interval="3000">
          <swiper-item class="swiper-item" v-for="s in swiperData" :key="s.encodeId">
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
      <view class="song-palylist" v-for="(block, index) in mainBlocks" :key="block.title">
        <view class="title">{{ block.title }}</view>
        <view class="song-content" v-if="index === 1">
          <view class="song-content-child" v-for="childRes in block.resources">
            <SongListItem v-for="song in childRes" :song="song"></SongListItem>
          </view>
        </view>
        <view class="playlist-content" v-else>
          <SongSheet v-for="resource, index in block.resources" :key="resource.id + '' + index || 'swiper-sheet'"
            :sheet="resource">
          </SongSheet>
        </view>
      </view>
    </PageFrame>
  </view>
  <NoLogin v-else-if="store.noLogin && !store.noCheck" />
</template>
  
<script setup>
import PageFrame from '@/components/pageframe/PageFrame'
import { watch, reactive, computed, ref } from 'vue'
import NoLogin from '../../components/nologin/NoLogin.vue'
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

const swiperData = reactive([])

const playLists = []

const songs = []

const mainBlocks = reactive([])

const playListsOther = []

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
  if (!creatives) {
    return
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
    const { mainTitle, image, subTitle } = uiElement
    return {
      id: resourceId,
      name: mainTitle.title,
      url: image.imageUrl,
      author: resourceExtInfo.artists.map(t => t.name).join('、'),
      recommendRes: subTitle && subTitle.title || ''
    }
  }
  const lists = []
  creatives && creatives.forEach((creative, cindex) => {
    const resources = creative.resources
    songs[cindex] = []
    songs[cindex].id = Date.now()
    resources.forEach(resource => {
      songs[cindex].push(genPlayList(resource))
      lists.push(genPlayList(resource))
    })
  })
  store.setSongs({
    sheetId: 'recommend',
    coverImgUrl: '',
    description: 'recommend',
    name: 'recommend',
    lists,
    more: false
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
  if (!creatives) {
    return
  }
  playListsOther.splice(0)
  creatives.forEach(creative => {
    playListsOther.push(genPlayList(creative))
  })
}

function resolveMianTitle(blkcs) {
  const resolved = blkcs.map(block => ({ title: block.uiElement.subTitle.title }))
  mainBlocks.splice(0)
  resolved[0].resources = playLists
  resolved[1].resources = songs
  resolved[2].resources = playListsOther
  mainBlocks.push(...resolved)
}

function findBlockByCode(blocks, code) {
  return blocks.find(b => b.blockCode && b.blockCode === code) || {}
}

function loadPageData() {
  getHomePageData().then(res => {
    if (res.data && res.data.blocks) {
      const blocks = res.data.blocks
      const banner = findBlockByCode(blocks, 'HOMEPAGE_BANNER')
      const plRcmd = findBlockByCode(blocks, 'HOMEPAGE_BLOCK_PLAYLIST_RCMD')
      const songs = findBlockByCode(blocks, 'HOMEPAGE_BLOCK_STYLE_RCMD')
      const plOther = findBlockByCode(blocks, 'HOMEPAGE_BLOCK_MGC_PLAYLIST')
      resolveSwiperData(banner)
      resolvePlayLists(plRcmd)
      resolveSongs(songs)
      resolvePlayListsOther(plOther)
      resolveMianTitle([plRcmd, songs, plOther])
      loading.value = false
    }
  })
}

watch(() => store.noLogin, (val) => {
  if (val === false) {
    loading.value = true
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
  padding: 0 $global-padding;
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
  padding: 0 $global-padding;
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
    gap: $song-sheet-margin-right;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
}
</style>