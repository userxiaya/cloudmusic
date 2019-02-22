<template>
  <div class="bottom">
    <div class="btn_list">
      <div class="like-btn iconfont"></div>
      <div class="pinglun-btn iconfont hasNum">
        <div class="num">{{commentCount|commentCount}}</div>
      </div>
      <div class="more-btn iconfont"></div>
    </div>
    <bar :duration="duration" :position="position" @percentChangeEnd="seekTo"></bar>
    <div class="btn-box2">
      <div :class="'iconfont '+playModeClass+'-btn'" @click="changeMode"></div>
      <div class="last-btn iconfont" @click.stop="prevSong"></div>
      <div :class="!playing?'play-btn iconfont':'pause-btn iconfont'" @click.stop="$bus.emit('set-play-state',!playing)"></div>
      <div class="next-btn iconfont" @click.stop="nextSong"></div>
      <div class="caidan-btn iconfont" @click.stop="$bus.emit('show-playlist')"></div>
    </div>
  </div>
</template>

<script>
import bar from './playBar'
import { mapGetters, mapState } from 'vuex'
export default {
  data () {
    return {}
  },
  components: {
    bar
  },
  props: {
    duration: {
      type: Number,
      default () {
        return 0
      }
    },
    commentCount: {
      type: String,
      default () {
        return ''
      }
    },
    position: {
      type: Number,
      default () {
        return 0
      }
    }
  },
  methods: {
    changeMode () {
      if (this.playMode === 3) {
        this.$store.state.playMode = 1
        window.localStorage.setItem('playMode', 1)
      } else {
        this.$store.state.playMode = this.playMode + 1
        window.localStorage.setItem('playMode', this.$store.state.playMode)
      }
    },
    seekTo (percent) {
      this.$emit('percentChangeEnd', percent)
    },
    nextSong () {
      const self = this
      this.$bus.emit('add-next-song', { self })
    },
    prevSong () {
      const self = this
      this.$bus.emit('add-prev-song', { self })
    }
  },
  computed: {
    ...mapGetters(['playing']),
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
  filters: {
    commentCount (val) {
      if (val > 100000) {
        return '10w+'
      }
      if (val > 10000) {
        return '1w+'
      } else {
        return val
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/common/scss/icon.scss";
.bottom {
  width: 100%;
  position: absolute;
  bottom: 40px;
  color: #f1f1f1;
  .btn_list {
    -ms-flex-align: center;
    align-items: center;
    width: 90%;
    margin: 0 auto;
    padding: 5px 30px;
    box-sizing: border-box;
    font-size: 30px;
    color: #f1f1f1;
    display: flex;
    .like-btn {
      flex: 1;
      text-align: center;
      &:before {
        content: $icon-love;
      }
    }
    .pinglun-btn {
      flex: 1;
      text-align: center;
      position: relative;
      &.hasNum {
        &:before {
          content: $icon-pinglun;
        }
      }
      &:before {
        content: $icon-pinglun1;
      }
      .num {
        box-sizing: border-box;
        position: absolute;
        top: 0px;
        font-size: 3px; /*no*/
        width: auto;
        text-align: center;
        padding-left: 53%;
      }
    }
    .more-btn {
      flex: 1;
      text-align: center;
      &:before {
        content: $icon-more;
      }
    }
  }
  .btn-box2 {
    -ms-flex-align: center;
    align-items: center;
    width: 90%;
    margin: 0 auto;
    padding: 10px 0;
    box-sizing: border-box;
    font-size: 40px;
    color: #f1f1f1;
    display: flex;
  }
  .pause-btn {
    flex: 1;
    text-align: center;
    &:before {
      content: $icon-zanting;
    }
  }
  .play-btn {
    flex: 1;
    text-align: center;
    &:before {
      content: $icon-bofang;
    }
  }
  .next-btn {
    flex: 1;
    text-align: center;
    &:before {
      content: $icon-xiayiqu;
    }
  }
  .last-btn {
    flex: 1;
    text-align: center;
    &:before {
      content: $icon-shangyiqu;
    }
  }
  .liebiaoxunhuan-btn {
    flex: 1;
    text-align: center;
    &:before {
      content: $icon-liebiaoxunhuan;
    }
  }
  .suijibofang-btn {
    flex: 1;
    text-align: center;
    &:before {
      content: $icon-suijibofang;
    }
  }
  .danquxunhuan-btn {
    flex: 1;
    text-align: center;
    &:before {
      content: $icon-danquxunhuan;
    }
  }
  .caidan-btn {
    flex: 1;
    text-align: center;
    &:before {
      content: $icon-caidan;
    }
  }
}
</style>
