<template>
  <div ref="wrapper" style="width:100%; height:100%; overflow:hidden">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  data () {
    return {
      scroll: null
    }
  },
  props: {
    bounce: {
      type: Object,
      default () {
        return {
          top: true,
          bottom: true,
          left: false,
          right: false
        }
      }
    },
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: false
    },
    tap: {
      type: Boolean,
      default: false
    },
    stopPropagation: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: null
    },
    inPage: {
      type: Boolean,
      default () {
        return true
      }
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    pullup: {
      type: Boolean,
      default: false
    },
    refreshDelay: {
      type: Number,
      default: 20
    },
    startY: {
      type: String,
      default: '0'
    }
  },
  mounted () {
    setTimeout(() => {
      this.initScroll()
    })
  },
  methods: {
    initScroll () {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        bounce: this.bounce,
        click: this.click,
        startY: parseInt(this.startY),
        stopPropagation: this.stopPropagation, // 阻止外层
        tap: this.tap
      })
      if (this.listenScroll) {
        let _this = this
        this.scroll.on('scroll', pos => {
          _this.$emit('scroll', pos)
        })
      }
      if (this.pullup) {
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= this.scroll.maxScrollY + 50) {
            this.$emit('scrollToEnd')
          }
        })
      }
    },
    enable () {
      this.scroll && this.scroll.enable()
    },
    disable () {
      this.scroll && this.scroll.disable()
    },
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    scrollTo () {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement () {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    },
    scrollPosition () {
      return this.scroll.y
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this.refresh()
      }, this.refreshDelay)
    },
    inPage (val) {
      if (!val) {
        this.scroll.destroy()
      } else {
        this.initScroll()
        setTimeout(() => {
          this.refresh()
        })
      }
    }
  }
}
</script>

<style>
</style>
