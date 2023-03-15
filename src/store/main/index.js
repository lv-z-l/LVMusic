import { defineStore } from 'pinia'
import { defineAsyncComponent } from 'vue'
import Recommend from '../../pages/recommend/Recommend.vue'
import Audio from '@/controlaudio'
import { debounce, loadLang } from '@/utils'
import { getLoginStatus } from '@/apis/login'
import { getLikeList } from '@/apis/mine'
import config from '../../config'

const langModules = loadLang()

const bars = config.mainBottomBar.icons.map(icon => icon.comp)
const compMap = {
  recommend: Recommend,
  mine: defineAsyncComponent(() => import(/* webpackChunkName: "mine" */'../../pages/mine/Mine.vue')),
  songlist: defineAsyncComponent(() => import(/* webpackChunkName: "songlist" */'../../pages/songlist/SongList.vue')),
  category: defineAsyncComponent(() => import(/* webpackChunkName: "category" */'../../pages/category/CateGory.vue')),
  search: defineAsyncComponent(() => import(/* webpackChunkName: "search" */'../../pages/search/Search.vue'))
}

export const useStore = defineStore('main', {
  state: () => ({
    cookie: '',
    userInfo: {},
    currentBar: 'recommend',
    currentCompKey: 'recommend',
    compQuene: ['recommend'],
    currentSong: {
      name: 'Fade',
      author: 'AiPi',
      playing: false,
      musicUrl: 'http://m7.music.126.net/20230310112205/f4839435cceac5e59e620c62b117b0c3/ymusic/22d0/e126/67dd/15c2883ae8a187178250ef9b24a6449a.mp3',
      url: 'http://p3.music.126.net/JUnSAoafluMhc6XE2fgdzA==/18189220858697765.jpg',
      id: '34183461',
      start: 0,
      time: 297875
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
    songImageW: 49,
    songImageWBig: 200,
    songImageWBigP: 300,
    clientWNoPadding: 350,
    cacheSongImageBG: {},
    backFixed: false,
    fixed: false,
    playerShow: false,
    timeMoving: false,
    vioceMoving: false
  }),
  getters: {
    langObj() {
      const key = Object.keys(langModules).find(key => key.includes(this.lang))
      return langModules[key].default
    },
    currentComp() {
      if (this.compQuene[this.compQuene.length - 1] !== this.currentCompKey) {
        this.compQuene.push(this.currentCompKey)
      }
      return compMap[this.currentCompKey]
    }
  },
  actions: {
    getLikeListIds(userId) {
      getLikeList(userId).then(res => {
        res.ids && this.likeList.splice(0, this.likeList.length, ...res.ids)
      })
    },
    loginStatus() {
      if (config.mode === 'pro') {
        this.cookie = localStorage.getItem('MUSIC_COOKIE') || ''
      }
      return getLoginStatus().then(res => {
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
            gender
          }
          Object.assign(this.userInfo, userInfo)
        } else {
          this.noCheck = false
        }
        return profile
      }).catch(() => this.noCheck = false)
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
      if (this.currentSong.playing) { // 暂停
        Audio.pause()
      } else {
        const { musicUrl, name, author } = this.currentSong
        Audio.play(musicUrl, name, author)
      }
      this.currentSong.playing = !this.currentSong.playing
    },
    back() {
      this.compQuene.pop()
      this.currentCompKey = this.compQuene[this.compQuene.length - 1]
    },
    pushCompQuene(comp) {
      this.compQuene.push(comp)
    },
    setImageWidth(PLAY_LIST_ITEM_W, w, PLAY_LIST_IMAGE_H, SONG_IMAGE_W_LITTLE, C_W_NO_PADDING, SONG_IMAGE_W_BIG, SONG_IMAGE_W_BIG_P, h) {
      this.imageW = PLAY_LIST_ITEM_W > 200 ? 200 : PLAY_LIST_ITEM_W
      this.clientW = w
      this.songListImgH = PLAY_LIST_IMAGE_H > 600 ? 600 : PLAY_LIST_IMAGE_H
      this.songImageW = SONG_IMAGE_W_LITTLE
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
    }
  },
})