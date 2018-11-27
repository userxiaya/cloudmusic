
// 除了App.vue 其他地方不得调用
import { Toast } from 'mint-ui'
class AudioPlus {
  constructor (src, setPlayerObj, setPlaying) {
    this.status = true
    this.setPlayerObj = setPlayerObj
    this.setPlaying = setPlaying
    if (src) {
      this.src = src
      this.setPlayer(src)
    }
  }
  setPlayer (src) {
    return new Promise((resolve, reject) => {
      if (this.player) {
        try {
          this.stop()
          this.setPlayerObj({ duration: 0 })
          this.setPlayerObj({ position: 0 })
          this.loadState = false
          if (this.loadingClass) {
            this.loadingClass.close()
          }
          delete this.player
        } catch (e) { }
      }
      this.loading()
      this.setPlaying(false)
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      if (src) {
        setTimeout(() => {
          this.player = window.plus.audio.createPlayer(src)
          this.player.play(() => {
            resolve('next')
          }, (e) => {
            this.status = false
            this.loadingClass.close()
            Toast('播放出错')
            reject(e)
            if (this.timer) {
              clearInterval(this.timer)
              this.timer = null
            }
          })
          let stop = setInterval(() => {
            const duration = this.getDuration()
            if (duration && this.player) {
              this.setPlaying(true)
              setTimeout(() => {
                this.setPlaying(true)
              }, 0)
              this.setPlayerObj({ duration: duration })
              clearInterval(stop)
              this.loadingClass.close()
              this.timer = setInterval(() => {
                const position = this.getPosition()
                if (position) {
                  this.setPlayerObj({ position: position })
                }
              }, 100)
            }
          }, 150)
        }, 100)
      }
    })
  }
  loading () {
    const loading = Toast({
      message: '歌曲加载中...',
      duration: -1,
      iconClass: 'icon-loading'
    })
    this.loadingClass = loading
  }
  getPosition () {
    return this.player.getPosition()// 当前播放长度
  }
  getDuration () {
    return this.player.getDuration()// 总长度
  }
  seekTo (position) {
    return this.player.seekTo(position)// 跳转制定音频
  }
  play () {
    if (!this.status) {
      this.setPlayer(this.src)
    } else {
      this.player.resume()// 恢复播放
    }
  }
  pause () {
    this.player.pause()// 暂停播放
  }
  stop () {
    this.player.stop()// 停止播放
  }
}
export default AudioPlus
