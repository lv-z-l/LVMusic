import { defineStore } from 'pinia'
import { defineAsyncComponent } from 'vue'
import Recommend from '../../pages/recommend/Recommend.vue'

const compMap = {
  recommend: Recommend,
  songlist: defineAsyncComponent(() => import(/* webpackChunkName: "songlist" */'../../pages/songlist/SongList.vue')),
  category: defineAsyncComponent(() => import(/* webpackChunkName: "category" */'../../pages/category/CateGory.vue')),
  search: defineAsyncComponent(() => import(/* webpackChunkName: "search" */'../../pages/search/Search.vue'))
}

export const useStore = defineStore('main', {
  state: () => ({
    currentBar: ['recommend'],
    compQuene: [],
    currentSong: {
      name: '泡沫',
      author: '邓紫棋',
      playing: false,
      url: '',
      musicUrl: '',
      id: ''
    },
    songs: {},
    imageW: 140,
    clientW: 350,
    clientH: 750,
    songImageW: 49,
    cacheSongImageBG: {},
    fixed: false,
    voiceBarWidth: 20,
    playerShow: false,
    timeMoving: false,
    vioceMoving: false
  }),
  getters: {
    currentComp() {
      if (this.compQuene[this.compQuene] !== this.currentBar) {
        this.compQuene.push(this.currentBar)
      }
      return compMap[this.currentBar]
    }
  },
  actions: {
    back() {
      this.compQuene.pop()
      this.currentBar = this.compQuene[this.compQuene.length - 1]
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
      const scrollTop = el.scrollTop
      // const take = el.querySelector('.take')
      const scrollBar = el.querySelector('.scroll-bar')
      if (!scrollBar) {
        return
      }
      this.fixed = scrollBar.clientHeight / 2 < scrollTop
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
      this.currentBar = curr
    },
    setPlayerShow(show) {
      this.playerShow = show
    },
    putCacheSongImageBG(url, bg) {
      this.cacheSongImageBG[url] = bg
    }
  },
})