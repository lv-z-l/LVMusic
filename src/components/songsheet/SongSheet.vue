<template>
  <swiper v-if="props.sheet.length" class="swiper-sheet"
    :style="{ width: pxw }" vertical circular autoplay indicator-dots :interval="3000">
    <swiper-item class="swiper-item" v-for="st in props.sheet" :key="st.id">
      <view class="song-sheet" @click="onSheetClick(store, st)">
        <LazyLoader :w="pxw" :h="pxw">
          <image class="image" :style="{ width: pxw, height: pxw }" :src="st.coverImgUrl + `?param=${w}y${w}`">
          </image>
        </LazyLoader>
        <view class="play-count" v-if="props.showPlayCount">
          <text class="icon-24gf-playCircle"></text>
          <text class="text">{{ toW(st.playCount) }}</text>
        </view>
        <view class="name" :style="{ maxWidth: pxw }">{{ st.name }}</view>
      </view>
    </swiper-item>
  </swiper>
  <view v-else :style="{ width: pxw }" class="song-sheet"
    @click="onSheetClick(store, props.sheet)">
    <LazyLoader :w="pxw" :h="pxw">
      <image class="image" :style="{ width: pxw, height: pxw }" :src="props.sheet.coverImgUrl + `?param=${w}y${w}`">
      </image>
    </LazyLoader>
    <view class="play-count" v-if="props.showPlayCount">
      <text class="icon-24gf-playCircle"></text>
      <text class="text">{{ toW(props.sheet.playCount) }}</text>
    </view>
    <view class="name" :style="{ maxWidth: pxw }">{{ props.sheet.name }}</view>
  </view>
</template>
  
<script setup>
import { useStore } from '../../store/main'
import { computed } from 'vue'
import LazyLoader from '@/components/lazyloader/LazyLoader.vue'
import { onSheetClick } from '@/use/useSongSheetClick.js'
import { toW } from '@/utils'

const store = useStore()
const props = defineProps({
  sheet: Object | Array,
  marginR: Boolean,
  showPlayCount: {
    type: Boolean,
    default: true
  }
})

const w = computed(() => store.imageW)

const pxw = computed(() => w.value + 'px')

const emit = defineEmits(['sheet-click'])

</script>
  
<style lang="scss">
.song-sheet {
  position: relative;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: $song-sheet-margin-bottom;

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

  .song-sheet {
    width: 100%;
  }
}
</style>