import { defineStore } from 'pinia'
import { defineAsyncComponent } from 'vue'
import Recommend from '@/pages/recommend/Recommend.vue'
import Audio from '@/use/controlaudio'
import { loadLang } from '@/utils'
import { getLoginStatus } from '@/apis/login'
import { getLikeList } from '@/apis/mine'
import config from '@/config'

const langModules = loadLang()

const bars = config.icons.map(icon => icon.comp)
const compMap = {
  recommend: Recommend,
  mine: defineAsyncComponent(() => import('@/pages/mine/Mine.vue')),
  songlist: defineAsyncComponent(() => import('@/pages/songlist/SongList.vue')),
  category: defineAsyncComponent(() => import('@/pages/category/CateGory.vue')),
  search: defineAsyncComponent(() => import('@/pages/search/Search.vue')),
}

export const useStore = defineStore('main', {
  state: () => ({
    cookie: '',
    userInfo: {},
    currentBar: 'recommend',
    currentCompKey: 'recommend',
    compQuene: ['recommend'],
    currentSong: {
      name: '暂无歌曲',
      author: '未知歌手',
      playing: false,
      musicUrl: '',
      url: '',
      id: '888',
      start: 0,
      time: 0,
      lyric: {},
    },
    loadMoreMap: {},
    lang: 'zh-cn',
    noLogin: true,
    noCheck: true,
    songs: {},
    playList: [],
    likeList: [],
    historyList: [],
    imageW: 140,
    clientW: 350,
    clientH: 750,
    songListImgH: 750,
    songImageW: 48,
    songImageWBig: 200,
    songImageWBigP: 300,
    clientWNoPadding: 350,
    cacheSongImageBG: {},
    backFixed: false,
    fixed: false,
    playerShow: false,
    timeMoving: false,
    vioceMoving: false,
    showSongImage: true,
  }),
  getters: {
    langObj() {
      const sysLang = uni.getLocale()
      const prefix = sysLang.split('-')[0]
      const key = Object.keys(langModules).find(key => key.includes(prefix))
      return langModules[key].default
    },
    currentComp() {
      if (this.compQuene[this.compQuene.length - 1] !== this.currentCompKey) {
        this.compQuene.push(this.currentCompKey)
      }
      return compMap[this.currentCompKey]
    },
  },
  actions: {
    getLikeListIds(userId) {
      getLikeList(userId).then(res => {
        res.ids && this.likeList.splice(0, this.likeList.length, ...res.ids)
      })
    },
    removeAudioEvent() {
      Audio.instance.destory()
    },
    addAudioEvent() {
      Audio.instance.onCanplay(() => (this.currentSong.playing = true))
      Audio.instance.onError(() => (this.currentSong.playing = false))
    },
    loginStatus() {
      if (import.meta.env.MODE === 'production') {
        this.cookie = localStorage.getItem('MUSIC_COOKIE') || ''
      }
      return getLoginStatus()
        .then(res => {
          const { profile } = res.data
          if (profile && profile.userId) {
            this.noLogin = false
            this.noCheck = false
            const { userId, nickname, userName, backgroundUrl, avatarUrl, gender } = profile
            this.getLikeListIds(userId)
            const userInfo = {
              userId,
              nickname,
              userName,
              backgroundUrl,
              avatarUrl,
              gender,
            }
            Object.assign(this.userInfo, userInfo)
          } else {
            this.noCheck = false
          }
          return profile
        })
        .catch(() => (this.noCheck = false))
    },
    regMessage(msg) {
      this.msg = msg
    },
    regLoadMore(key, fn) {
      this.loadMoreMap[key] = fn
    },
    getCurrentTime() {
      const currentTime = Audio.getCurrentTime()
      this.currentSong.start = currentTime
    },
    playOrPause() {
      if (!this.currentSong.musicUrl) {
        return
      }
      if (this.currentSong.playing) {
        this.currentSong.playing = !this.currentSong.playing
        // 暂停
        Audio.pause()
      } else {
        const { musicUrl, name, author } = this.currentSong
        if (Audio.instance.src === musicUrl) {
          this.currentSong.playing = !this.currentSong.playing
        }
        Audio.play(musicUrl, name, author)
      }
    },
    back() {
      this.compQuene.pop()
      this.currentCompKey = this.compQuene[this.compQuene.length - 1]
    },
    pushCompQuene(comp) {
      this.compQuene.push(comp)
    },
    setImageWidth() {
      const windowInfo = uni.getWindowInfo()
      const { windowWidth: w, windowHeight: h } = windowInfo
      // 5.33% 是 padding
      const PLAY_LIST_ITEM_W = Math.floor((w - 0.0533 * w * 3) / 2)
      const C_W_NO_PADDING = Math.floor(w - 0.0533 * w * 2)
      const SONG_IMAGE_W_BIG = w * 0.64
      const PLAY_LIST_IMAGE_H = h * 0.48
      const SONG_IMAGE_W_BIG_P = w * 0.872
      this.imageW = PLAY_LIST_ITEM_W > 200 ? 200 : PLAY_LIST_ITEM_W
      this.clientW = w
      this.songListImgH = PLAY_LIST_IMAGE_H > 600 ? 600 : PLAY_LIST_IMAGE_H
      this.clientWNoPadding = C_W_NO_PADDING > 740 ? C_W_NO_PADDING / 2 : C_W_NO_PADDING
      this.songImageWBig = SONG_IMAGE_W_BIG > 320 ? 320 : SONG_IMAGE_W_BIG
      this.songImageWBigP = SONG_IMAGE_W_BIG_P > 360 ? 360 : SONG_IMAGE_W_BIG_P
      this.clientH = h
    },
    updateScrollHeight(event) {
      const el = event.instance.$el
      const { scrollTop } = el
      const back = el.querySelector('.back')
      const scrollBar = el.querySelector('.scroll-bar')
      back && (this.backFixed = back.clientHeight / 2 < scrollTop)
      scrollBar && (this.fixed = scrollBar.clientHeight / 2 < scrollTop)
    },
    loadMore() {
      this.loadMoreMap[this.currentCompKey] && this.loadMoreMap[this.currentCompKey]()
    },
    setSongs(s) {
      this.songs = s
    },
    setTimeMoving(bool) {
      this.timeMoving = bool
    },
    setVoiceMoving(bool) {
      this.vioceMoving = bool
    },
    setCurrentBar(curr) {
      this.currentCompKey = curr
      if (this.compQuene[this.compQuene.length - 1] !== this.currentCompKey) {
        this.compQuene.push(this.currentCompKey)
      }
      if (bars.includes(curr)) {
        this.currentBar = curr
      }
    },
    setPlayerShow(show) {
      this.playerShow = show
    },
    putCacheSongImageBG(url, bg) {
      this.cacheSongImageBG[url] = bg
    },
  },
})
