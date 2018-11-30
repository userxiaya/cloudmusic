<template>
  <div id="app">
    <!-- 分发click事件 -->
    <scroll class="scroll" :click="true">
      <div class="scroll">
        <keep-alive>
          <router-view />
        </keep-alive>
      </div>
      <playlist ref="playlist"></playlist>
    </scroll>
    <playBox v-show="playerShowFlag"></playBox>
  </div>
</template>

<script>
import scroll from '@/components/scroll'
import { mapGetters, mapMutations, mapState } from 'vuex'
import AudioPlus from '@/base/audio'
import { loginStatus } from '@/base/api'
import playlist from '@/components/playlist'
const playBox = () => import('@/pages/playBox')
export default {
  name: 'App',
  data () {
    return {
      audio: null,
      timmer: null,
      player: null,
      songloading: null
    }
  },
  mounted () {
    if (window.plus) {
      this.plusLoad()
    } else {
      document.addEventListener('plusready', () => {
        this.plusLoad()
      })
    }
    this.$bus.on('player-show', this.playerShow)
    this.$bus.on('player-hide', this.playerHide)
    this.$bus.on('del-player', this.delPlayer)
    this.$bus.on('show-playlist', this.showPlaylist)
    this.$bus.on('set-play-state', this.setPlayState)
    this.$bus.on('add-seek-to', this.seekTo)
    this.$bus.on('add-prev-song', this.prevSong)
    this.$bus.on('add-next-song', this.nextSong)
    this.$bus.on('playMusicId', this.playMusicId)
  },
  methods: {
    ...mapMutations({
      setPlaying: 'SET_PlAYING',
      setPlayerObj: 'SET_PlAYEROBJ',
      nextSong: 'NEXTSONG',
      saveHistory: 'SAVEHISTORY',
      prevSong: 'PREVSONG',
      consummateSong: 'CONSUMMATESONG'
    }),
    playerShow () {
      this.$store.state.playerShowFlag = true
    },
    playerHide () {
      this.$store.state.playerShowFlag = false
    },
    showPlaylist () {
      this.$refs.playlist.show()
    },
    delPlayer () {
      if (this.audio) {
        this.audio.stop()
      }
    },
    plusLoad () {
      const webview = window.plus.webview.currentWebview()
      const Intent = window.plus.android.importClass('android.content.Intent')
      const intent = new Intent()
      const main = window.plus.android.runtimeMainActivity()
      const self = this
      window.plus.key.addEventListener('backbutton', function () {
        if (self.playerShowFlag === true) {
          self.playerHide()
        } else {
          webview.canBack(function (e) {
            if (e.canBack) {
              webview.back()
            } else {
              intent.setAction(Intent.ACTION_MAIN) // "android.intent.action.MAIN"
              intent.addCategory(Intent.CATEGORY_HOME) // "android.intent.category.HOME"
              main.startActivity(intent)
            }
          })
        }
      })
      this.audio = new AudioPlus('', this.setPlayerObj, this.setPlaying)
      if (this.currentSong.url) {
        this.playSong(this.currentSong.url)
      }
    },
    setPlayState (flag) {
      if (!this.currentSong.id) {
      } else if (flag) {
        if (this.audio) {
          if (this.audio.player) {
            this.audio.play()
            this.setPlaying(true)
          } else {
            this.playMusicId(this.currentSong.id)
          }
        }
      } else {
        this.setPlaying(false)
        this.audio.pause()
      }
    },
    playSong (id, play) {
      const self = this
      this.saveHistory(this.currentSong)
      this.consummateSong()
      if (this.audio) {
        this.audio
          .setPlayerById(id)
          .then(data => {
            if (data === 'next') {
              if (self.playMode === 3) {
                self.$bus.emit('add-seek-to', { precent: 0 })
              } else {
                self.$bus.emit('add-next-song', { self })
              }
            }
          })
          .catch(e => {})
      }
    },
    seekTo (val) {
      if (this.audio && this.audio.player) {
        const currentTime = this.playerObj.duration * val.precent
        if (currentTime === 0) {
          this.audio.seekTo(0.01)
        } else {
          this.audio.seekTo(currentTime)
        }
      }
    },
    playMusicId (id) {
      this.playSong(id)
    },
    getloginStatus () {
      loginStatus().then(res => {
        const result = res.data
        if (result.code + '' === '200') {
          this.$store.state.userName = `${result.profile.nickname}`
          this.$store.state.userId = `${result.profile.userId}`
          this.$store.state.userImg = result.profile.avatarUrl
        }
      })
    }
  },
  computed: {
    ...mapGetters(['currentSong', 'playing', 'playerObj', 'historyList']),
    ...mapState(['playMode', 'playerShowFlag'])
  },
  watch: {
    '$store.state.loginState' (val) {
      if (val) {
        this.getloginStatus()
      } else {
        this.$store.state.userName = ''
        this.$store.state.userId = ''
        this.$store.state.userImg = ''
      }
    }
  },
  components: {
    scroll,
    playlist,
    playBox
  }
}
</script>
<style scoped lang="scss">
.scroll {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>

<style>
.mint-navbar .mint-tab-item.is-selected {
  border: none !important;
}
</style>
<style lang="scss">
@import "@/common/scss/index.scss";
.my-bullet-active {
  background: $color-theme !important;
}
.my-bullet {
  width: 0.190476rem;
  height: 0.190476rem;
  display: inline-block;
  border-radius: 100%;
  background: #f1f1f1;
  margin: 0 0.095238rem;
}
.mint-tab-item-label {
  font-size: 15px;
}
.mint-navbar .mint-tab-item.is-selected {
  border: none;
  .mint-tab-item-label {
    font-size: 16px;
    color: #ffffff;
    .tab-span {
      border-bottom: 3px solid #ffffff;
    }
  }
  .tab-span {
    padding: 2px;
    padding-left: 6px;
    padding-right: 6px;
    width: auto;
  }
  margin-bottom: 0px;
}
.mint-navbar .mint-tab-item {
  padding: 0 0 !important;
  display: flex;
  justify-content: center;
  align-items: Center;
}
@font-face {
  font-family: "iconfont";
  src: url("assets/iconfont.eot?t=1542248818571"); /* IE9*/
  src: url("assets/iconfont.eot?t=1542248818571#iefix")
      format("embedded-opentype"),
    /* IE6-IE8 */
      url("data:application/x-font-woff;charset=utf-8;base64,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")
      format("woff"),
    url("assets/iconfont.ttf?t=1542248818571") format("truetype"),
    /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
      url("assets/iconfont.svg?t=1542248818571#iconfont") format("svg"); /* iOS 4.1- */
}
.iconfont {
  font-family: "iconfont" !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
}
.icon-loading {
  height: 40px;
  width: 40px;
  margin: 0 auto;
  margin-bottom: 10px;
  background: url(./assets/loading.gif);
  background-size: 100%, 100%;
}
</style>
