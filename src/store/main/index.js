import { defineStore } from 'pinia'
import { defineAsyncComponent } from 'vue'
import Recommend from '../../pages/recommend/Recommend.vue'
import Audio from '@/controlaudio'
import { debounce, loadLang } from '../../utils'
import config from '../../config'

const langModules = loadLang()

const bars = config.mainBottomBar.icons.map(icon => icon.comp)
const compMap = {
  recommend: Recommend,
  mine: defineAsyncComponent(() => import(/* webpackChunkName: "login" */'../../pages/mine/Mine.vue')),
  songlist: defineAsyncComponent(() => import(/* webpackChunkName: "songlist" */'../../pages/songlist/SongList.vue')),
  category: defineAsyncComponent(() => import(/* webpackChunkName: "category" */'../../pages/category/CateGory.vue')),
  search: defineAsyncComponent(() => import(/* webpackChunkName: "search" */'../../pages/search/Search.vue'))
}

export const useStore = defineStore('main', {
  state: () => ({
    currentBar: 'recommend',
    currentCompKey: 'recommend',
    compQuene: [],
    currentSong: {
      name: '泡沫',
      author: '邓紫棋',
      playing: false,
      url: '',
      musicUrl: '',
      id: '',
      start: 0,
      time: 1000 * 60 * 3
    },
    loadMoreMap: {},
    lang: 'zh-cn',
    noLogin: true,
    songs: {},
    playList: [],
    historyList: [],
    imageW: 140,
    clientW: 350,
    clientH: 750,
    songImageW: 49,
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
    regMessage(msg) {
      this.msg = msg
    },
    regLoadMore(key, fn) {
      this.loadMoreMap[key] = debounce(fn, 100)
    },
    getCurrentTime() {
      const currentTime = Audio.getCurrentTime()
      this.currentSong.start = currentTime
    },
    playOrPause() {
      if (this.currentSong.playing) { // 暂停
        Audio.pause()
      } else {
        Audio.play()
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
    setImageWidth(cateW, w, h, sw) {
      this.imageW = cateW
      this.clientW = w
      this.clientH = h
      this.songImageW = sw
    },
    updateScrollHeight(event) {
      const el = event.instance.$el
      const { scrollTop, clientHeight, scrollHeight } = el
      const back = el.querySelector('.back')
      const scrollBar = el.querySelector('.scroll-bar')
      const blankBlock = el.querySelector('.blank-block')
      back && (this.backFixed = back.clientHeight / 2 < scrollTop)
      scrollBar && (this.fixed = scrollBar.clientHeight / 2 < scrollTop)
      if ((scrollHeight - scrollTop - clientHeight) <= 3 * blankBlock.clientHeight) {
        console.log('load-more')
        this.loadMoreMap[this.currentCompKey] && this.loadMoreMap[this.currentCompKey]()
      }
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
      this.backFixed = false
      this.fixed = false
      this.currentCompKey = curr
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