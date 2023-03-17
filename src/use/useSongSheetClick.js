import { getSongUrlById, getSongLyric } from '@/apis/song'
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

function formatTime(time) {
  let temp = time.replace(/["\[\] ]/g, '').split('.')
  const ms = temp[0]
  const s1 = Math.round('0.' + temp[1])
  temp = ms.split(':')
  const m = Number(temp[0])
  const s = Number(temp[1]) + s1
  return m * 60 + s
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
    const { musicUrl, name, author, url } = copy
    Audio.play(musicUrl, name, author, url)
  })
  getSongLyric(song.id).then(res => {
    if (res.lrc && res.lrc.lyric) {
      const lyricArray = res.lrc.lyric.split('\n')
      const lyricObj = {}

      lyricArray.map(lyric => {
        let key
        const value = lyric.replace(/\[.*\] */g, match => {
          key = match
          return ''
        })
        key && value && (lyricObj[formatTime(key)] = value)
      })
      store.currentSong.lyric = lyricObj
    }
  })
}
