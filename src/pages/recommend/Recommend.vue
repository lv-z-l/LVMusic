<template>
  <view class="recommend">
    <NoLogin v-if="store.noLogin" />
    <PageFrame v-else :frame-name="store.langObj.recommend">
    </PageFrame>
  </view>
</template>
  
<script setup>
import PageFrame from '@/components/pageframe/PageFrame'
import { watch, reactive } from 'vue';
import NoLogin from '../../common/nologin/NoLogin.vue';
import { useStore } from '../../store/main'
import { getHomePageData } from '@/apis/recommend'

const store = useStore()

const swiperData = reactive([])

const playLists = reactive([])

const songs = reactive([])

const mainTitle = reactive([])

const playListsOther = reactive([])

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
  songs.splice(0)
  creatives.forEach(creative => {
    const resources = creative.resources
    const temp = resources.map((resource) => genPlayList(resource))
    songs.push(...temp)
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
  const resolved = creatives.forEach(creative => {
    playListsOther.push(genPlayList(creative))
  })
}

function resolveMianTitle(blocks) {
  const resolved = blocks.filter(block => block.showType !== 'BANNER').map(block => block.uiElement.subTitle.title)
  mainTitle.splice(0)
  mainTitle.push(...resolved)
}

function loadPageData() {
  getHomePageData().then(res => {
    if (res.data && res.data.blocks) {
      const blocks = res.data.blocks
      resolveMianTitle(res.data.blocks)
      resolveSwiperData(blocks[0])
      resolvePlayLists(blocks[1])
      resolveSongs(blocks[2])
      resolvePlayListsOther(blocks[3])
      debugger
    }
  })
}

watch(() => store.noLogin, (val) => {
  if (val === false) {
    loadPageData()
  }
})

</script>
  
<style></style>