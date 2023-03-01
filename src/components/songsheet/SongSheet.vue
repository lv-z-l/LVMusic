<template>
  <view class="song-sheet" @click="$emit('sheet-click', props.sheet)">
    <LazyLoader :w="pxw" :h="pxw">
      <image class="image" :style="{ width: pxw, height: pxw }" :src="props.sheet.coverImgUrl + `?param=${w}y${w}`">
      </image>
    </LazyLoader>
    <view class="play-count">
      <text class="icon-24gf-playCircle"></text>
      <text class="text">{{ Number.parseInt(props.sheet.playCount / 10000) + 'w' }}</text>
    </view>
    <view class="name">{{ props.sheet.name }}</view>
  </view>
</template>
  
<script setup>
import { useStore } from '../../store/main';
import { computed } from 'vue';
import LazyLoader from '@/components/lazyloader/LazyLoader.vue'
const store = useStore()
const props = defineProps({
  sheet: Object
})

const w = computed(() => store.imageW)

const pxw = computed(() => w.value + 'px')

const emit = defineEmits(['sheet-click'])

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
</style>