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

const playListsOther = reactive([])

function resolveSwiperData(data) {

}

function resolvePlayLists(data) {

}

function resolveSongs(data) {

}

function resolvePlayListsOther(data) {

}

function loadPageData() {
  getHomePageData().then(res => {
    if (res.data && res.data.blocks) {
      const blocks = res.data.blocks
      resolveSwiperData(blocks[0])
      resolvePlayLists(blocks[1])
      resolveSongs(blocks[2])
      resolvePlayListsOther(blocks[3])
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