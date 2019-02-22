<template>
  <div
    class="main"
    v-show="isMounted"
  >
    <div class="background">
      <div class="filter"></div>
      <img
        width="100%"
        height="100%"
        :src="currentMusic.pic"
      >
    </div>
    <div class="top">
      <div
        class="back"
        @click.stop="back"
      >
        <i class="fa iconfont"></i>
      </div>
      <h1 class="title">{{currentMusic.name}}</h1>
      <h2 class="subtitle"><span
          v-for="(item,key) in currentMusic.artist"
          :key="key"
          @click.stop="$emit('singerclick')"
        >
          <template v-if="key<currentMusic.artist.length-1">{{item.name}}/</template>
          <template v-else>{{item.name}}</template>
        </span></h2>
    </div>
    <div
      class="middle"
      @click="changeMiddle"
    >
      <transition name="middleL">
        <circleBox
          v-if="currentShow === 'cd' && playerShowFlag===true"
          :picUrl="currentMusic.image||''"
          class="middlel"
          :playType="playType"
        ></circleBox>
      </transition>
      <transition name="middleR">
        <lrc
          v-if="lrcFlags"
          v-show="currentShow === 'lyric'"
          class="middle-r"
          :lrc="currentShow === 'lyric'&&playerShowFlag===true?lrcData:[]"
          :nolrc="nolrc"
          :lryempty="lryempty"
        ></lrc>
      </transition>
    </div>
    <bottom
      :duration="playerObj.duration"
      :position="playerObj.position"
      :commentCount="commentCount"
      @percentChangeEnd="seekTo"
    ></bottom>
  </div>
</template>

<script>
import Parser from '@/base/lrcParser'
import { lyric } from '@/base/api'
import { mapGetters, mapState } from 'vuex'
import bottom from './musicBoxComponent/bottom'
import lrc from './musicBoxComponent/lrc'
import circleBox from './musicBoxComponent/circle'
export default {
  data () {
    return {
      currentShow: 'cd',
      isMounted: false,
      lrcFlags: false,
      lrcData: [],
      lryempty: false,
      nolrc: false
    }
  },
  computed: {
    ...mapGetters(['playerObj', 'currentSong']),
    ...mapState(['playerShowFlag'])
  },
  props: {
    playType: {
      type: String,
      default () {
        return 'pause'
      }
    },
    commentCount: {
      type: String,
      default () {
        return ''
      }
    },
    currentMusic: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  components: {
    bottom,
    circleBox,
    lrc
  },
  mounted () {
    this.isMounted = true
  },
  methods: {
    back () {
      this.$bus.emit('player-hide')
    },
    getLyric (id) {
      this.nolrc = false
      this.lryempty = false
      lyric(id)
        .then(res => {
          const data = res.data
          if (data) {
            let lrcObject = {}
            let lrcList = []
            if (data.nolyric + '' === 'true') {
              this.nolrc = true
            }
            if (data.lrc && data.lrc.lyric) {
              const list = Parser(data.lrc.lyric, () => {})
              list.forEach(e => {
                const obj = { text1: e.txt }
                lrcObject[e.time + ''] = obj
              })
            } else {
              this.lryempty = true
            }
            if (data.tlyric && data.tlyric.lyric) {
              const list = Parser(data.tlyric.lyric, () => {})
              list.forEach(e => {
                const obj = { text2: e.txt }
                if (lrcObject[e.time + '']) {
                  lrcObject[e.time + ''] = Object.assign(
                    lrcObject[e.time + ''],
                    obj
                  )
                }
              })
            }
            for (let key in lrcObject) {
              const obj = lrcObject[key]
              obj.time = key
              lrcList.push(obj)
            }
            this.lrcData = lrcList
          }
        })
        .catch(e => {})
    },
    changeMiddle () {
      if (this.currentShow === 'cd') {
        this.currentShow = 'lyric'
      } else {
        this.currentShow = 'cd'
      }
    },
    seekTo (percent) {
      this.$emit('percentChangeEnd', percent)
    }
  },
  watch: {
    lrcData (val) {},
    'currentSong.id' (val) {
      this.lrcData = []
      if (this.currentShow === 'lyric') {
        this.getLyric(val)
      }
      if (this.playerShowFlag === false) {
        this.lrcFlags = false
        this.currentShow = 'cd'
      }
    },
    currentShow (val) {
      if (val === 'lyric') {
        this.lrcFlags = true
        if (this.lrcData.length === 0) {
          this.getLyric(this.currentSong.id)
        }
      }
    },
    playerShowFlag (val) {
      if (val === false) {
        this.currentShow = 'cd'
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/common/scss/icon.scss";
.main {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: absolute;
  z-index: 3;
  .top {
    position: relative;
    box-sizing: border-box;
    color: #f1f1f1;
    margin-bottom: 25px;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 50;
      .fa {
        display: block;
        padding: 5px 9px;
        font-size: 35px;
        color: #f1f1f1;
        &:before {
          content: $icon-back;
        }
      }
    }
    .title {
      width: 70%;
      margin: 0 auto;
      height: 30px;
      line-height: 30px;
      text-align: center;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      color: #f1f1f1;
      padding-top: 10px;
      font-size: 20px;
      font-weight: 700;
    }
    .subtitle {
      font-size: 12px;
      width: 70%;
      height: 20px;
      margin: 0 auto;
      line-height: 20px;
      text-align: center;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      color: #f1f1f1;
    }
  }
  .middle {
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    position: absolute;
    width: 100%;
    top: 95px;
    bottom: 210px;
    white-space: nowrap;
  }
  .background {
    .filter {
      position: absolute;
      width: 100%;
      height: 100%;
      background: #000;
      opacity: 0.8;
    }
    position: absolute;
    left: -50%;
    top: -50%;
    width: 300%;
    height: 300%;
    z-index: -1;
    opacity: 0.6;
    -webkit-filter: blur(30px);
    filter: blur(30px);
  }
}
.middle-r {
  position: absolute;
  &.middleR-enter-active,
  &.middleR-leave-active {
    transition: all 0.2s;
  }
  &.middleR-enter,
  &.middleR-leave-to {
    opacity: 0;
  }
}
.middlel {
  &.middleL-enter-active,
  &.middleL-leave-active {
    transition: all 0.2s;
  }
  &.middleL-enter,
  &.middleL-leave-to {
    opacity: 0;
  }
}
</style>
