import { defineStore } from 'pinia'
import Audio from '@/controlaudio'
import { debounce, loadLang } from '@/utils'
import { getLoginStatus } from '@/apis/login'
import config from '../../config'

const langModules = loadLang()

const bars = config.mainBottomBar.icons.map(icon => icon.comp)


export const useStore = defineStore('main', {
  state: () => ({
    userInfo: {},
    currentBar: 'recommend',
    currentCompKey: 'recommend',
    compQuene: [],
    loading: false,
    minePlayList: [],
    swiperData: [],
    mainBlocks: [],
    hotTexts: [],
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
    }
  },
  actions: {
    loginStatus() {
      return getLoginStatus().then(res => {
        const { profile } = res.data
        if (profile && profile.userId) {
          this.noLogin = false
          const { userId, nickname, userName, backgroundUrl, avatarUrl, gender } = profile
          const userInfo = {
            userId,
            nickname,
            userName,
            backgroundUrl,
            avatarUrl,
            gender
          }
          Object.assign(this.userInfo, userInfo)
        }
      })
    },
    regMessage(msg) {
      this.msg = msg
    },
    regLoadMore(key, fn) {
      this.loadMoreMap[key] = debounce(fn, 200)
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
    setImageWidth(PLAY_LIST_ITEM_W, w, PLAY_LIST_IMAGE_H, SONG_IMAGE_W_LITTLE, C_W_NO_PADDING, SONG_IMAGE_W_BIG, SONG_IMAGE_W_BIG_P, h) {
      this.imageW = PLAY_LIST_ITEM_W > 200 ? 200 : PLAY_LIST_ITEM_W
      this.clientW = w
      this.songListImgH = PLAY_LIST_IMAGE_H > 600 ? 600 : PLAY_LIST_IMAGE_H
      this.songImageW = SONG_IMAGE_W_LITTLE
      this.clientWNoPadding = C_W_NO_PADDING > 740 ? C_W_NO_PADDING / 2 : C_W_NO_PADDING
      this.songImageWBig = SONG_IMAGE_W_BIG > 320 ? 320 : SONG_IMAGE_W_BIG
      this.songImageWBigP = SONG_IMAGE_W_BIG_P > 400 ? 400 : SONG_IMAGE_W_BIG_P
      this.clientH = h
    },
    updateScrollHeight(event) {
      const el = event.instance.$el
      const { scrollTop, clientHeight, scrollHeight } = el
      const back = el.querySelector('.back')
      const scrollBar = el.querySelector('.scroll-bar')
      const blankBlock = el.querySelector('.blank-block')
      back && (this.backFixed = back.clientHeight / 2 < scrollTop)
      scrollBar && (this.fixed = scrollBar.clientHeight / 2 < scrollTop)
      if (!blankBlock) {
        return
      }
      if ((scrollHeight - scrollTop - clientHeight) <= 3 * blankBlock.clientHeight) {
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