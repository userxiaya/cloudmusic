<template>
    <transition name="list-fade">
        <div class="playlist" v-show="showFlag" @click.stop="hide">
            <div class="list-wrapper" @click.stop>
                <div class="list-header">
                    <h1 class="title">
                        <i :class="'iconfont '+playModeClass+'-btn'" @click="changeMode"></i>
                        <span class="text">
                          <template v-if="playMode===1">顺序播放</template>
                          <template v-if="playMode===2">随机播放</template>
                          <template v-if="playMode===3">单曲循环</template>
                        (<span class="count">{{musicList.length}}</span>)
                        </span><span class="clear" @click="clear"><i class="icon-clear iconfont"></i></span>
                    </h1>
                </div>
                <scroll :data="musicList" class="content" ref="scroll" v-if="showFlag">
                    <ul style="width:100%; height:auto">
                        <li class="item" v-for="(item,index) in musicList" :key="index" @click.stop="select(item)">
                            <div class="text">{{item.name}}-{{item.singer}}</div>
                            <span class="delete" @click.stop="del(index)"><i class="icon-delete iconfont"></i></span>
                        </li>
                    </ul>
                </scroll>
                <div class="close" @click.stop="hide"><span>关闭</span></div>
            </div>
        </div>
    </transition>
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex'
import scroll from '@/components/scroll'
export default {
  data () {
    return {
      showFlag: false
    }
  },
  components: {
    scroll
  },
  methods: {
    ...mapMutations({
      setMusicList: 'SET_MUSICLIST',
      playBySong: 'PLAYBYSONG'
    }),
    hide () {
      this.showFlag = false
    },
    show () {
      this.showFlag = true
    },
    changeMode () {
      if (this.playMode === 3) {
        this.$store.state.playMode = 1
        window.localStorage.setItem('playMode', 1)
      } else {
        this.$store.state.playMode = this.playMode + 1
        window.localStorage.setItem('playMode', this.$store.state.playMode)
      }
    },
    clear () {
      this.$bus.emit('del-player')
      this.setMusicList([])
      this.hide()
    },
    del (index) {
      const self = this
      let list = self.musicList.map(item => {
        return item
      })
      list.splice(index, 1)
      if (list.length === 0) {
        self.$bus.emit('del-player')
        self.hide()
      } else {
        const obj = list.find(function (e) {
          return e.id === self.currentMusicIndex
        })
        if (!obj) {
          self.$bus.emit('add-next-song', { self })
        }
      }
      self.setMusicList(list)
    },
    select (item) {
      if (this.currentSong.id && this.currentSong.id + '' === item.id + '') {
        this.hide()
      } else {
        const self = this
        const song = item
        this.playBySong({ self, song })
        this.hide()
      }
    }
  },
  computed: {
    ...mapGetters(['musicList', 'currentMusicIndex', 'currentSong']),
    ...mapState(['playMode']),
    playModeClass () {
      let lei = 'liebiaoxunhuan'
      switch (this.playMode) {
        case 2:
          lei = 'suijibofang'
          break
        case 3:
          lei = 'danquxunhuan'
          break
        default:
          lei = 'liebiaoxunhuan'
      }
      return lei
    }
  },
  watch: {}
}
</script>

<style scoped lang="scss">
@import "@/common/scss/icon.scss";
.playlist {
  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter,
  &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 240;
  background-color: rgba(0, 0, 0, 0.3);
  .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-radius: 8px; /*no*/
    background-color: #f2f3f4;
    .list-header {
      .title {
        height: 20px; /*no*/
        line-height: 20px; /*no*/
        display: flex;
        .iconfont {
          margin-right: 10px; /*no*/
          font-size: 20px; /*no*/
          color: #757575;
        }
        .clear {
          position: relative;
          .icon-clear {
            font-size: 14px; /*no*/
            color: #757575;
            margin-right: 0px; /*no*/
          }
        }
        .text {
          height: 20px; /*no*/
          line-height: 20px; /*no*/
          flex: 1;
          font-size: 14px; /*no*/
          color: #2e3030;
        }
      }
      position: relative;
      padding: 20px 30px 10px 20px; /*no*/
    }
    .content {
      max-height: 200px; /*no*/
      height: auto;
      overflow: hidden;
      position: relative;
      .item {
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        height: 40px; /*no*/
        pointer-events: auto;
        padding: 0 30px 0 20px; /*no*/
        position: relative;
        overflow: hidden;
        .text {
          width: 80%;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          line-height: 20px; /*no*/
          font-size: 14px; /*no*/
          color: #2e3030;
        }
        .delete {
          // float: right;
          right: 30px; /*no*/
          position: absolute;
          font-size: 11px;
          color: #d44439;
        }
      }
    }
    .close {
      text-align: center;
      line-height: 50px; /*no*/
      background: #f2f3f4;
      font-size: 16px; /*no*/
      color: #2e3030;
    }
  }
}
.liebiaoxunhuan-btn {
  &:before {
    content: $icon-liebiaoxunhuan;
  }
}
.suijibofang-btn {
  &:before {
    content: $icon-suijibofang;
  }
}
.danquxunhuan-btn {
  &:before {
    content: $icon-danquxunhuan;
  }
}
.icon-clear {
  &:before {
    content: $icon-delete;
  }
}
.icon-delete {
  &:before {
    content: $icon-cha1;
  }
}
a,
abbr,
acronym,
address,
applet,
article,
aside,
audio,
b,
big,
blockquote,
body,
canvas,
caption,
center,
cite,
code,
dd,
del,
details,
dfn,
div,
dl,
dt,
em,
embed,
fieldset,
figcaption,
figure,
footer,
form,
h1,
h2,
h3,
h4,
h5,
h6,
header,
html,
i,
iframe,
img,
input,
ins,
kbd,
label,
legend,
li,
mark,
menu,
nav,
object,
ol,
output,
p,
pre,
q,
ruby,
s,
samp,
section,
small,
span,
strike,
strong,
sub,
summary,
sup,
table,
tbody,
td,
tfoot,
th,
thead,
time,
tr,
tt,
u,
ul,
var,
video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font-weight: 400;
  vertical-align: baseline;
}
</style>
