import { getSongUrlById } from '@/apis/song'
import Audio from '@/controlaudio'
import { nextTick } from 'vue'


export function onSheetClick(store, sheet) {
  const { coverImgUrl, id, name } = sheet
  store.setSongs({
    sheetId: id,
    coverImgUrl,
    description: '',
    name,
    more: true,
    lists: []
  })
  nextTick(() => store.setCurrentBar('songlist'))
}

export function playSong(store, song) {
  getSongUrlById(song.id).then(res => {
    const copy = Object.assign({}, song)
    copy.playing = true
    copy.musicUrl = res.data[0].url
    if (!copy.musicUrl) {
      return store.msg.open({ msg: store.langObj.cantPlay })
    }
    copy.time = res.data[0].time
    copy.start = 0
    store.$patch({ currentSong: copy })
    const { musicUrl, name, author } = copy
    Audio.play(musicUrl, name, author)
  })
}
