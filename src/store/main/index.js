import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({ 
	  currentBar: '',
    
		currentSong: {
      name: '泡沫',
      singer: '邓紫棋',
      playing: false,
			image: 'http://127.0.0.1:3000/wangyiyun//U10EUHljYZWT07TWezJg8g==/109951166677557030.jpg',
		},
    cacheSongImageBG: {},
    voiceBarWidth: 20,
    playerShow: false,
    timeMoving: false,
    vioceMoving: false
	}),
  getters: {
    
  },
  actions: {
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