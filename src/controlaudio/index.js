class MyAudio {
  constructor() {
    this.instance = uni.getBackgroundAudioManager ? uni.getBackgroundAudioManager() : uni.createInnerAudioContext()
    this.instance.onError(err => {
      console.log(err)
    })
    this.instance.volume = 0.5
  }
  play(url, title, singer) {
    if (this.instance.src !== url) {
      this.instance.title = title
      this.instance.singer = singer
      this.instance.src = url
    }
    this.instance.play()
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
  regEvent(onEnded, onPrev, onNext) {
    this.instance.onEnded(onEnded)
    this.instance.onPrev && this.instance.onPrev(onPrev)
    this.instance.onNext && this.instance.onNext(onNext)
  }
}

export default new MyAudio()