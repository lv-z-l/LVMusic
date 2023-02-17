import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({ 
	  currentBar: '',
    
		currentSong: {
			
		},
    voiceBarWidth: 20,
    playerShow: false,
	}),
  getters: {

  },
  actions: {
    setCurrentBar(curr) {
      this.currentBar = curr
    },
    setPlayerShow(show) {
      this.playerShow = show
    }
  },
})