<template>
  <transition :name="slideName">
    <div class="main">
      <div class="header" ref="header" :style="{background:headerBackground}" v-immersed1>
        <div class="back" @click.stop="$router.go(-1)">
          <strong class="iconback iconfont"></strong>
        </div>
        <div class="text">
          <h1 class="title" style="margin: 0;padding: 0;border: 0;font-size: 100%;font-weight: 400;vertical-align: baseline;">{{headerTitle}}</h1>
        </div>
      </div>
      <scroll @scroll="scroll" :listenScroll="true" :probe-type="probeType" :data="songs" :bounce="bounce">
        <div style="height:aoto; width:100%">
          <div class="image" ref="bgImage" :style="bgStyle">
            <div class="filter"></div>
            <div class="text">
              <h2 :class="playCount?'text-title':'text-title2'">{{title}}</h2>
              <p class="play-count" v-show="playCount" ><i class="iconfont listen-icon"></i>
                {{playCount|playCount}}
              </p>
            </div>
          </div>
          <div :class="currentSong.id?'song-list-wrapper haveplayer':'song-list-wrapper'">
            <div class="sequence-play">
              <i class="iconfont icon-bofangicon"></i>
              <div class="text" @click.stop="playSongList()">
                  <i class="play-btn iconfont" style="padding-right: 0.1rem"></i>
                  播放全部
              </div>
              <span class="count">(共{{trackCount}}首)</span>
            </div>
            <songList :songs="songs" @select="select"></songList>
          </div>
        </div>
      </scroll>
      <div class="loading-content" v-if="songs.length===0">
        <loading></loading>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import scroll from '@/components/scroll'
import { playlistDetail } from '@/base/api'
import loading from '@/components/loading'
import songList from '@/components/songList'
import { createRecommendListSong } from '@/base/song'
export default {
  data () {
    return {
      bounce: {
        top: false,
        bottom: true,
        left: false,
        right: false
      },
      pageType: '',
      inPage: false,
      image: '',
      id: '',
      headerTitle: '歌单',
      songs: [],
      scrollY: 0,
      imageHeight: null,
      minTranslateY: null,
      RESERVED_HEIGHT: null,
      probeType: 3,
      headerBackground: 'rgba(212, 68, 57, 0)',
      playCount: '',
      trackCount: '',
      title: '',
      timer: null,
      slideName: 'up'
    }
  },
  components: {
    loading,
    songList,
    scroll
  },
  activated () {
    this.slideName = 'up'
    this.inPage = true
    this.$nextTick(() => {
      const params = this.$route.params
      if (this.id) {
        return
      }
      this.id = params.id
      this.image = params.image
      this.playCount = params.playCount
      this.trackCount = params.trackCount
      this.title = params.title
      this.RESERVED_HEIGHT = this.$refs.header.clientHeight
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.minTranslateY = -this.imageHeight + this.RESERVED_HEIGHT
      if (params.type && params.type === 'historyList') {
        this.songs = this.historyList
        this.id = 'historyList'
        this.pageType = 'historyList'
        return
      }
      playlistDetail(params.id).then(res => {
        res = res.data
        if (res.code + '' === '200') {
          let list =
            res.playlist && res.playlist.tracks ? res.playlist.tracks : []
          this.timer = setTimeout(() => {
            if (this.inPage) {
              this.songs = list.map(item => {
                return createRecommendListSong(item)
              })
            }
          }, 500)
        }
      })
    })
  },
  beforeRouteLeave (to, from, next) {
    const toIndex = to.meta.index || to.meta.parentIndex
    const Indexs = this.$route.meta.index || this.$route.meta.parentIndex
    if (toIndex < Indexs) {
      clearTimeout(this.timer)
      this.inPage = false
      this.songs = []
      this.scrollY = 0
      this.id = ''
      this.pageType = ''
      next()
    } else {
      this.slideName = ''
      this.$nextTick(() => {
        next()
      })
    }
  },
  deactivated () {
    // this.songs = []
    // this.scrollY = 0
  },
  computed: {
    ...mapGetters(['currentSong', 'historyList']),
    bgStyle () {
      return `background-image: url(${this.image})`
    }
  },
  methods: {
    ...mapMutations({
      playBySong: 'PLAYBYSONG',
      playBySongList: 'PLAYBYSONGLIST'
    }),
    scroll (pos) {
      this.scrollY = pos.y
    },
    select (item) {
      if (this.currentSong.id && this.currentSong.id + '' === item.id + '') {
        this.slideName = ''
        this.$nextTick(() => {
          this.$bus.emit('player-show')
        })
      } else {
        const self = this
        const song = item
        this.playBySong({ self, song })
      }
    },
    playSongList () {
      const songs = this.songs
      this.playBySongList({list: songs, id: songs[0].id, self: this})
    }
  },
  watch: {
    scrollY (newY) {
      const percent = Math.abs(newY / this.imageHeight)
      if (newY < this.minTranslateY + this.RESERVED_HEIGHT - 20) {
        this.headerTitle = this.title
      } else {
        this.headerTitle = '歌单'
      }
      if (newY < 0) {
        this.headerBackground = `rgba(212, 68, 57, ${percent})`
      } else {
        this.headerBackground = `rgba(212, 68, 57, 0)`
      }
    },
    historyList: {
      handler (val) {
        if (this.pageType === 'historyList') {
          this.songs = val
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/common/scss/index.scss";
@import "@/common/scss/icon.scss";
.play-btn {
    flex: 1;
    text-align: center;
    &:before {
      content: $icon-bofang;
    }
  }
.up-enter {
   -webkit-transform: translate3d(0,100%,0);
   -moz-transform: translate3d(0,100%,0);
   -ms-transform: translate3d(0,100%,0);
   transform: translate3d(0,100%,0);
}
.up-enter-active {
  transition: 300ms;
}
.up-leave-to {
  z-index: 10;
  -webkit-transform: translate3d(0,100%,0);
  -moz-transform: translate3d(0,100%,0);
  -ms-transform: translate3d(0,100%,0);
  transform: translate3d(0,100%,0);
}
.up-leave-active {
  transition: 300ms;
}
.main {
  position: fixed;
  height: 100%;
  width: 100%;
  background: $color-background;
  overflow: hidden;
  .image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 75%;
    transform-origin: top;
    background-size: cover;
    background-position: 0 30%;
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #000;
      opacity: 0.2;
    }
    .text {
      position: absolute;
      bottom: 50px;
      width: 100%;
      left: 20px;
      color: #fff;
      .text-title {
        position: absolute;
        bottom: 0;
        font-size: 20px;
        // line-height: 22px;
        font-weight: 700;
        letter-spacing: 1px;
        width: 80%;
      }
      .text-title2 {
        position: absolute;
        bottom: -28px;
        font-size: 20px;
        // line-height: 22px;
        font-weight: 700;
        letter-spacing: 1px;
        width: 80%;
      }
      .play-count {
        font-weight: 700;
        position: absolute;
        bottom: -28px;
        font-size: 15px;
        .listen-icon {
          &:before {
            content: $icon-listen;
          }
        }
      }
    }
  }
}
.header {
  box-sizing: border-box;
  position: fixed;
  top: 0;
  width: 100%;
  height: 44px; /*no*/
  color: #fff;
  z-index: 100;
  .back {
    position: absolute;
    left: 15px; /*no*/
    width: 100%;
    line-height: 44px; /*no*/
    font-size: 40px; /*no*/
    .iconback {
      position: absolute;
      color: #f1f1f1;
      height: 44px; /*no*/
      font-size: 28px; /*no*/
      line-height: 44px; /*no*/
      &:before {
        content: $icon-back;
      }
    }
  }
  .text {
    position: absolute;
    left: 48px; /*no*/
    width: 80%;
    line-height: 44px; /*no*/
    font-size: 18px; /*no*/
    @include no-wrap();
    .title {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
.song-list-wrapper {
  padding: 41px 0 20px 0;
  border-radius: 10px;
  position: relative;
  top: -20px;
  background: $color-background;
  .sequence-play {
    z-index: 99;
    position: absolute;
    // left: 8;
    top: 0px;
    display: flex;
    align-items: center;
    width: 100%;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid rgb(228, 228, 228);
    .iconfont {
      font-size: 18px;
      color: $color-text;
      padding-right: 14px;
    }
    .text {
      font-size: $font-size-medium-x;
    }
    .count {
      font-size: $font-size-medium;
      color: $color-text-g;
    }
  }
}
.loading-content {
  position: fixed;
  width: 100%;
  top: 70%;
  transform: translateY(-50%);
}
.haveplayer {
  padding-bottom: 80Px; /* no*/
}
</style>
