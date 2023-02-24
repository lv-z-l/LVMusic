class MyAudio {
  constructor() {
    this.instance = uni.createInnerAudioContext()
    this.instance.onError(err => {
      console.log(err)
    })
  }
  play(url) {
    this.instance.src = url
    this.instance.volume = 0.5
    this.instance.onCanplay(() => {
      this.instance.play()
    })
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
}

export default new MyAudio()