<template>
  <swiper v-if="props.sheet.length" :class="['swiper-sheet', props.marginR ? 'need-margin-r' : '']"
    :style="{ width: pxw }" vertical circular autoplay indicator-dots :interval="3000">
    <swiper-item class="swiper-item" v-for="st in props.sheet" :key="st.id">
      <view class="song-sheet" @click="onSheetClick(st)">
        <LazyLoader :w="pxw" :h="pxw">
          <image class="image" :style="{ width: pxw, height: pxw }" :src="st.coverImgUrl + `?param=${w}y${w}`">
          </image>
        </LazyLoader>
        <view class="play-count">
          <text class="icon-24gf-playCircle"></text>
          <text class="text">{{ Number.parseInt(st.playCount / 10000) + 'w' }}</text>
        </view>
        <view class="name" :style="{ maxWidth: pxw }">{{ st.name }}</view>
      </view>
    </swiper-item>
  </swiper>
  <view v-else :class="['song-sheet', props.marginR ? 'need-margin-r' : '']" @click="onSheetClick(props.sheet)">
    <LazyLoader :w="pxw" :h="pxw">
      <image class="image" :style="{ width: pxw, height: pxw }" :src="props.sheet.coverImgUrl + `?param=${w}y${w}`">
      </image>
    </LazyLoader>
    <view class="play-count">
      <text class="icon-24gf-playCircle"></text>
      <text class="text">{{ Number.parseInt(props.sheet.playCount / 10000) + 'w' }}</text>
    </view>
    <view class="name" :style="{ maxWidth: pxw }">{{ props.sheet.name }}</view>
  </view>
</template>
  
<script setup>
import { useStore } from '../../store/main';
import { computed } from 'vue';
import LazyLoader from '@/components/lazyloader/LazyLoader.vue'
import { getSongListByCateId } from '@/apis/category'

const store = useStore()
const props = defineProps({
  sheet: Object | Array,
  marginR: Boolean
})

const w = computed(() => store.imageW)

const pxw = computed(() => w.value + 'px')

const emit = defineEmits(['sheet-click'])

function onSheetClick(sheet) {
  getSongListByCateId({ id: sheet.id, limit: 20 }).then(res => {
    const { description, coverImgUrl, name, tracks } = res.playlist
    const lists = tracks.map(track => {
      const { name, id, al, ar } = track
      return {
        name,
        id,
        url: al.picUrl,
        author: ar.map(t => t.name).join('、')
      }
    })
    store.setSongs({
      sheetId: sheet.id,
      coverImgUrl,
      description,
      name,
      lists
    })
    store.setCurrentBar('songlist')
  })
}

</script>
  
<style lang="scss">
.song-sheet {
  width: 47%;
  position: relative;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: $song-sheet-margin;

  &.need-margin-r {
    margin-right: 5.33%;
  }

  .play-count {
    position: absolute;
    top: $song-sheet-playcount-size;
    right: $song-sheet-playcount-size;
    background-color: $bg-d;
    display: flex;
    align-items: center;
    padding: calc($song-sheet-playcount-size / 2);
    border-radius: $song-sheet-playcount-size;
    font-size: $song-sheet-playcount-size;
    color: $white-color;

    [class^=icon-] {
      padding-right: calc($song-sheet-playcount-size / 2);
    }

  }

  .image {
    border-radius: $border-radius;
  }

  .name {
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-size: $song-sheet-playcount-size;
  }
}

.swiper-sheet {
  flex: 0 0 auto;
  height: auto;

  &.need-margin-r {
    margin-right: 5.33%;
  }

  .song-sheet {
    width: 100%;
  }
}
</style>