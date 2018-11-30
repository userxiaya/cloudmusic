<template>
  <div style="width:100%; height:100%">
    <scroll v-if="nolrc" :click="true">
      <div class="lyric-wrapper">
        <div class="lyric">
          <p class="loading-lyric" style="pointer-events: auto;">纯音乐无歌词</p>
        </div>
      </div>
    </scroll>
    <scroll ref="scroll" :data="lrc" v-else-if="lrc&&lrc.length>0" :click="true">
      <div class="lyric-wrapper">
        <div class="lyric">
          <div :class="lrcIndex===index?'item active':'item'" v-for="(item,index) in lrc" :key="item.time" ref="lyricLine">
            <div class="p" v-if="item.text1">{{item.text1}}</div>
            <div class="p" v-if="item.text2">{{item.text2}}</div>
          </div>
        </div>
      </div>
    </scroll>
    <scroll v-else :click="true">
      <div class="lyric-wrapper">
        <div class="lyric">
          <p class="loading-lyric" style="pointer-events: auto;">{{lryempty?'暂无歌词,叫爸爸就给加':'歌词加载中...'}}</p>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import scroll from '../scroll'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      top: 0,
      lyricLine: [],
      lrcIndexCopy: 0
    }
  },
  props: {
    lrc: {
      type: Array,
      default () {
        return {}
      }
    },
    nolrc: {
      type: Boolean,
      default: false
    },
    lryempty: {
      type: Boolean,
      default: false
    }
  },
  components: {
    scroll
  },
  methods: {
    singTo (index) {
      try {
        this.$refs.scroll.scrollTo(
          0,
          -(this.lyricLine[index].offsetTop - this.top),
          1000
        )
      } catch (e) {}
    }
  },
  computed: {
    ...mapGetters(['playerObj']),
    lrcIndex () {
      const position = this.playerObj.position
        ? this.playerObj.position * 1000
        : 0
      const lrc = this.lrc
      let res = 0
      if (lrc.length > 0) {
        if (position > lrc[lrc.length - 1].time) {
          res = lrc.length - 1
          return res
        }
      }
      for (let i = 0; i < lrc.length; i++) {
        if (
          lrc[i + 1] &&
          (position >= lrc[i].time && position < lrc[i + 1].time)
        ) {
          res = i
          break
        }
      }
      return res
    }
  },
  watch: {
    lrcIndex (val) {
      this.lrcIndexCopy = val
      this.singTo(val)
    },
    lrc () {
      this.lrcIndexCopy = 0
      this.$nextTick(() => {
        if (this.$refs.scroll) {
          this.$refs.scroll.scrollTo(0, 0, 0)
          this.lyricLine = this.$refs.lyricLine || []
          if (this.lyricLine.length > 0) {
            this.top = this.lyricLine[0].offsetTop
            setTimeout(() => {
              this.$refs.scroll.scrollTo(
                0,
                -(this.lyricLine[this.lrcIndex].offsetTop - this.top),
                0
              )
            }, 0)
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.lyric-wrapper {
  width: 80%;
  height: auto;
  margin: 0 auto;
  text-align: center;
  .loading-lyric {
    line-height: 40px;
    color: #c7c7c7;
    font-size: 16px;
  }
  .lyric {
    padding-top: 60%;
    padding-bottom: 60%;
    width: 100%;
    height: auto;
    overflow: hidden;
    .item {
      padding-top: 10px; /*no*/
      padding-bottom: 10px; /*no*/
      box-sizing: border-box;
      height: auto;
      .p {
        white-space: normal;
        text-align: center;
        width: 100%;
        height: auto;
        color: #c7c7c7;
        font-size: 14px; /*no*/
      }
      &.active {
        .p {
          color: #ffffff;
        }
      }
    }
  }
}
</style>
