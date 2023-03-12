<template>
  <view class="day-recommend" @tap.stop="toDayRecomSongList" :style="{ height: store.imageW + 'px' }">
    <text class="text">{{ day[0] }}</text>
    <text class="text">{{ day[1] }}</text>
    <image class="image" src="../../static/face.svg"></image>
  </view>
</template>
<script setup>
import { reactive, onBeforeMount, nextTick } from 'vue'
import { useStore } from '../../store/main'
import { getRecommendSongs } from '@/apis/mine'

const store = useStore()

const day = reactive([])

onBeforeMount(() => {
  const date = new Date()
  const d = date.getDate()
  if (d < 10) {
    day.push(...[0, d])
  } else {
    const strd = d + ''
    day.push(...strd)
  }
})
function toDayRecomSongList() {
  getRecommendSongs().then(res => {
    const { dailySongs, recommendReasons } = res.data
    const lists = dailySongs.map((song, index) => {
      const { name, id, al, ar } = song
      return {
        name,
        id,
        url: al.picUrl,
        author: ar.map(t => t.name).join('、'),
        recomRes: recommendReasons[index] ? recommendReasons[index].reason : ''
      }
    })
    store.setSongs({
      sheetId: '0',
      coverImgUrl: lists[0].url,
      description: store.langObj.recomDesc,
      name: store.langObj.dayrecom,
      lists,
      more: false
    })
    nextTick(() => store.setCurrentBar('songlist'))
  })
}

</script>
<style lang="scss">
.day-recommend {
  width: 100%;
  display: flex;
  align-items: center;
  background-color: var(--bg);
  border-radius: $border-radius;
  justify-content: space-evenly;
  background-image: linear-gradient(45deg, $white-color, rgb(255, 154, 44), $bottom-bar-active-color);

  .image {
    width: 40%;
    height: 80%;
  }

  .text {
    text-align: center;
    color: $white-color;
    font-weight: bold;
    font-size: calc(3 * $page-frame-scroll-text-size);
    animation: textLight .8s ease-in-out infinite alternate both;
  }

  @keyframes textLight {
    0% {
      text-shadow: 0 0 0 rgba(0, 0, 0, 0);
    }

    100% {
      text-shadow: 0 0 18px $bottom-bar-active-color-opcaty;
    }
  }
}
</style>