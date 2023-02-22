import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({ 
	  currentBar: '',
    
		currentSong: {
      name: '泡沫',
      singer: '邓紫棋',
      playing: false,
			image: '',
		},
    imageW: 100,
    cacheSongImageBG: {},
    fixed: false,
    voiceBarWidth: 20,
    playerShow: false,
    timeMoving: false,
    vioceMoving: false
	}),
  getters: {
    
  },
  actions: {
    setImageWidth(w) {
      this.imageW = w
    },
    updateScrollHeight(event) {
      const el = event.instance.$el
      const scrollTop = el.scrollTop
      // const take = el.querySelector('.take')
      const scrollBar = el.querySelector('.scroll-bar')
      this.fixed = scrollBar.clientHeight / 2 < scrollTop
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