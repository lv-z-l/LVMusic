<template>
  <scroll-view scroll-y enable-flex :scroll-into-view="currentLyricKeyId" class="lyric">
    <view :id="'id' + key" :class="['lyric-item', key === currentLyricKey ? 'current' : '']" v-for="key in allKeys"
      :key="key">
      {{ store.currentSong.lyric[key] }}</view>
  </scroll-view>
</template>
<script setup>
import { useStore } from '../../store/main'
import { computed, watchEffect, ref } from 'vue'

const store = useStore()

const allKeys = computed(() => Object.keys(store.currentSong.lyric))

const currentLyricKeyId = ref('')

const currentLyricKey = ref('')

watchEffect(() => {
  const cur = Math.ceil(store.currentSong.start)
  const keys = allKeys.value
  const l = keys.length
  const key = keys.find((k, index) => cur >= Number(keys[index]) && cur <= Number(keys[index + 1 > l ? l : index + 1]))
  currentLyricKeyId.value = 'id' + key
  currentLyricKey.value = key
})

</script>
<style lang="scss">
.lyric {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  font-size: $player-song-info-name-size;

  .lyric-item {
    padding: .6rem 0;
    font-size: $play-song-name-size;
    color: $white-color;
    text-align: center;
    transition: $transition;

    &.current {
      color: $bottom-bar-active-color-opcaty;
    }
  }
}
</style>