<template>
  <swiper v-if="props.sheet.length" :class="['swiper-sheet', props.marginR ? 'need-margin-r' : '']"
    :style="{ width: pxw }" vertical circular autoplay indicator-dots :interval="3000">
    <swiper-item class="swiper-item" v-for="st in props.sheet" :key="st.id">
      <view class="song-sheet" @click="onSheetClick(store, st)">
        <image class="image" lazy-load :style="{ width: pxw, height: pxw }" :src="st.coverImgUrl + `?param=${w}y${w}`">
        </image>
        <view class="play-count" v-if="props.showPlayCount">
          <text class="iconfont icon-24gf-playCircle ico"></text>
          <text class="text">{{ Number.parseInt(st.playCount / 10000) + 'w' }}</text>
        </view>
        <view class="name" :style="{ maxWidth: pxw }">{{ st.name }}</view>
      </view>
    </swiper-item>
  </swiper>
  <view v-else :style="{ width: pxw }" :class="['song-sheet', props.marginR ? 'need-margin-r' : '']"
    @click="onSheetClick(store, props.sheet)">
    <image class="image" lazy-load :style="{ width: pxw, height: pxw }"
      :src="props.sheet.coverImgUrl + `?param=${w}y${w}`">
    </image>
    <view class="play-count" v-if="props.showPlayCount">
      <text class="iconfont icon-24gf-playCircle ico"></text>
      <text class="text">{{ Number.parseInt(props.sheet.playCount / 10000) + 'w' }}</text>
    </view>
    <view class="name" :style="{ maxWidth: pxw }">{{ props.sheet.name }}</view>
  </view>
</template>
  
<script setup>
import { useStore } from '../../store/main';
import { computed } from 'vue';
import { onSheetClick } from '@/use/useSongSheetClick.js'

const store = useStore()
const props = defineProps({
  sheet: Object | Array,
  marginR: Boolean,
  halfW: Boolean,
  showPlayCount: {
    type: Boolean,
    default: true
  }
})

const w = computed(() => props.halfW ? Number.parseInt(store.imageW / 2) : store.imageW)

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

    .ico {
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