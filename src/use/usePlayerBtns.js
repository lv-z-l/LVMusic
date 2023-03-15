import { computed, ref } from 'vue'
import { useStore } from '@/store/main'
import { playSong } from '@/use/useSongSheetClick.js'

export function usePlayerBtns() {
  const store = useStore()

  const active = ref(false)

  const nextCls = ref('icon-next-fill')

  const lastCls = ref('icon-next-fill roate')

  const playOrPauseCls = computed(() => `icon-${store.currentSong.playing ? 'pause' : 'play'}-fill ${active.value ? 'active' : ''}`)

  function playOrPause() {
    store.playOrPause()
    active.value = true
    setTimeout(() => active.value = false, 1000)
  }

  function next() {
    nextOrlast()
    const reset = changeBack(nextCls, ' active')
    reset()
  }

  function last() {
    nextOrlast(true)
    const reset = changeBack(lastCls, ' active')
    reset()
  }

  function changeBack(target, cls) {
    let temp = target.value
    if (temp.endsWith(cls)) {
      return () => { }
    }
    target.value += cls
    return () => {
      setTimeout(() => target.value = temp, 1000)
    }
  }

  const nextOrlast = (last) => {
    let songs = store.songs.lists
    if (!store.songs.lists) {
      return store.currentSong.playing = false
    }
    const song = songs.find(song => song.id === store.currentSong.id)
    const index = songs.indexOf(song)
    const l = songs.length
    if (last) {
      playSong(store, songs[index > 0 ? index - 1 : l - 1])
    } else {
      playSong(store, songs[index < l - 1 ? index + 1 : 0])
    }
  }

  return { playOrPause, playOrPauseCls, next, nextCls, last, lastCls }
}