<template>
  <scroll :data="data" class="listview" ref="listview" :listenScroll="listenScroll" @scroll="scroll" :probeType="probeType" :in-page="inPages" :start-y="historyPosition">
    <ul>
      <li v-for="group in data" class="list-group" :key="group.id" ref="listGroup">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li @click.stop="selectItem(item)" v-for="item in group.items" class="list-group-item" :key="item.id">
            <img v-lazy="item.image" :key="item.image" class="avatar">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutStart" @touchmove.stop.prevent="onShortcutMove">
      <ul>
        <li v-for="(item, index) in shortcutList" class="item" :data-index="index" :key="item.id" :class="{'current': currentIndex === index}">
          {{ item }}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script>
import Scroll from '@/components/scroll'
import { getData } from '@/common/js/dom'
const ANCHOR_HEIGHT = 20
// const TITLE_HEIGHT = 30
export default {
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0,
      inPages: true,
      historyPosition: '0'
      // diff: -1
    }
  },
  created () {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  methods: {
    selectItem (item) {
      this.$emit('select', item)
    },
    refresh () {
      this.$refs.listview.refresh()
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    onShortcutStart (e) {
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutMove (e) {
      let firshTouch = e.touches[0]
      this.touch.y2 = firshTouch.pageY
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    _scrollTo (index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    _calculateHeight () {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        // height += item.clientHeight
        this.listHeight.push(item.offsetTop)
      }
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY (newY) {
      const listHeight = this.listHeight
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i - 1
          return
        }
      }
      this.currentIndex = listHeight.length - 2
    }
  },
  computed: {
    shortcutList () {
      return this.data.map(group => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : ''
    }
  },
  components: {
    Scroll
  },
  activated () {
    this.inPages = true
    this.$parent.history = 'index'
  },
  deactivated () {
    this.historyPosition = this.$refs.listview.scrollPosition() + ''
    this.inPages = false
  }
}
</script>

<style lang="scss" scoped>
@import "@/common/scss/index.scss";
li,
ul {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font-weight: 400;
  vertical-align: baseline;
}
li {
  list-style: none;
}
.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;
  .list-group {
    // padding: 10px 0;
    .list-group-title {
      height: 20px; /*no*/
      line-height: 20px; /*no*/
      padding-left: 12px; /*no*/
      margin-bottom: 10px; /*no*/
      font-size: $font-size-small; /*no*/
      color: #fff;
      background: rgba(0, 0, 0, 0.1);
    }
    .list-group-item {
      display: flex;
      align-items: center;
      padding: 5px 0; /*no*/
      margin: 0 5px; /*no*/
      border-bottom: 1px solid rgb(228, 228, 228); /*no*/
      &:last-child {
        border: none;
        margin-bottom: 10px; /*no*/
      }
      .avatar {
        width: 50px; /*no*/
        height: 50px; /*no*/
        color: $color-text;
        font-size: $font-size-medium; /*no*/
      }
      .name {
        margin-left: 20px; /*no*/
      }
    }
  }
  .list-shortcut {
    z-index: 30;
    right: 3px; /*no*/
    height: 100%;
    position: absolute;
    width: 20px; /*no*/
    border-radius: 3px; /*no*/
    text-align: center;
    font-family: Helvetica;
    top: 0px;
    .item {
      flex:1;
      padding: 3.5px 5px; /*no*/
      line-height: 1;
      color: $color-text-g;
      font-size: $font-size-small;
      font-weight: bold;
      &.current {
        color: $color-theme;
      }
    }
  }
  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-title {
      height: 20px; /*no*/
      line-height: 20px; /*no*/
      padding-left: 20px; /*no*/
      font-size: $font-size-small; /*no*/
      color: $color-text-l;
      background: rgba(0, 0, 0, 0.1);
    }
  }
  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
