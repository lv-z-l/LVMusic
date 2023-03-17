class MyAudio {
  constructor() {
    this.instance = uni.getBackgroundAudioManager ? uni.getBackgroundAudioManager() : uni.createInnerAudioContext()
    this.instance.onError(err => {
      console.log(err)
    })
    this.instance.volume = 0.5
  }
  play(url, title, singer, img) {
    if (!url || this.instance.src === url) {
      return this.instance.play()
    }
    this.instance.title = title
    this.instance.singer = singer
    this.instance.src = url
    this.instance.coverImgUrl = img
  }
  pause() {
    this.instance.pause()
  }
  seek(time) {
    this.instance.seek(time)
  }
  destroy() {
    this.instance.destroy()
  }
  setVolume(v) {
    this.instance.volume = v < 0 ? 0 : v > 1 ? 1 : v
  }
  getCurrentTime() {
    return this.instance.currentTime
  }
  regEvent(onEnded, onPrev, onNext, onPlay, onPause) {
    this.instance.onEnded(onEnded)
    this.instance.onPrev && this.instance.onPrev(onPrev)
    this.instance.onNext && this.instance.onNext(onNext)
    this.instance.onPlay && this.instance.onPlay(onPlay)
    this.instance.onPause && this.instance.onPause(onPause)
  }
}

export default new MyAudio()