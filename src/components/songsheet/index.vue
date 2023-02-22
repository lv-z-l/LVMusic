<template>
  <view class="song-sheet" @click="$emit('sheet-click', props.sheet)">
    <image class="image" :style="{ width: store.imageW + 'px', height: store.imageW + 'px' }"
      :src="props.sheet.coverImgUrl + `?param=${store.imageW}y${store.imageW}`"></image>
    <view class="play-count">
      <text class="icon-play-fill"></text>
      <text class="text">{{ Number.parseInt(props.sheet.playCount / 10000) }}</text>
    </view>
    <view class="name">{{ props.sheet.name }}</view>
  </view>
</template>
  
<script setup name='songsheet'>
import { useStore } from '../../store/main';
const store = useStore()
const props = defineProps({
  sheet: Object
})

const emit = defineEmits(['sheet-click'])

</script>
  
<style lang="scss">
.song-sheet {
  width: 33.3%;
  position: relative;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  .play-count {
    position: absolute;
    top: 0;
    right: 0;
  }

  .name {
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>