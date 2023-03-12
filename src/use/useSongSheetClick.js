import { getSongListByCateId } from '@/apis/category'
import { getSongUrlById } from '@/apis/song'
import Audio from '@/controlaudio'
import { nextTick } from 'vue'


export function onSheetClick(store, sheet) {
  getSongListByCateId({ id: sheet.id, limit: 20 }).then(res => {
    const { description, coverImgUrl, name, tracks, trackCount } = res.playlist
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
      more: trackCount > lists.length,
      lists
    })
    nextTick(() => store.setCurrentBar('songlist'))
  })
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
    // store.setPlayerShow(true)
    Audio.play(copy.musicUrl, copy.name, copy.author)
  })
}
