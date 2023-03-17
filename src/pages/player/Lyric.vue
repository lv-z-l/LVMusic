<template>
  <view class="lyric">
    {{ currentLyric }}
  </view>
</template>
<script setup>
import { useStore } from '../../store/main'
import { computed } from 'vue';
const store = useStore()

const currentLyric = computed(() => {
  const cur = Math.ceil(store.currentSong.start)
  const keys = Object.keys(store.currentSong.lyric)
  const l = keys.length
  const key = keys.find((k, index) => cur >= Number(keys[index]) && cur <= Number(keys[index + 1 > l ? l : index + 1]))
  return store.currentSong.lyric[key]
})

</script>
<style lang="scss">
.lyric {
  width: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  top: calc(2 * $player-top-line-margin-top + $player-top-line-height);
  font-size: $player-song-info-name-size;
  color: $bottom-bar-active-color-opcaty;
}
</style>