class MyAudio {
  constructor() {
    this.instance = uni.getBackgroundAudioManager ? uni.getBackgroundAudioManager() : uni.createInnerAudioContext()
    this.instance.onError(err => {
      console.log(err)
    })
    this.instance.volume = 0.5
  }
  play(url) {
    if (url) {
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
}

export default new MyAudio()