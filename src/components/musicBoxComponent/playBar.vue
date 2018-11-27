<template>
  <div class="progress-wrapper">
    <div class="time time-l">{{position|time}}</div>
    <div class="progress-bar-wrapper" ref="progressBar">
      <div class="progress-bar">
        <div class="bar-inner">
          <div class="progress" ref="progress" :style="{width:progressStyle.width}"></div>
          <div class="progress-btn-wrapper" ref="progressBtn" :style="{transform:progressStyle.transform}" @touchstart.prevent="progressTouchStart" @touchmove.prevent="progressTouchMove" @touchend.prevent="progressTouchEnd">
            <div class="progress-btn" ref="progressBtn2"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="time time-r">{{duration|time}}</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      touch: {
        initiated: false
      },
      progressBtnWidth: 0,
      progressStyle: {},
      percent: 0
    }
  },
  methods: {
    progressTouchStart (e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      this.triggerPercent()
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(
        Math.min(
          this.$refs.progressBar.clientWidth - this.progressBtnWidth,
          Math.max(0, this.touch.left + deltaX)
        )
      )
      this.offset(offsetWidth)
    },
    progressTouchEnd (e) {
      this.touch.initiated = false
      const barWidth =
        this.$refs.progressBar.clientWidth - this.progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChangeEnd', percent)
    },
    triggerPercent () {
      const barWidth =
        this.$refs.progressBar.clientWidth - this.progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
    },
    offset (offsetWidth) {
      const style = {
        width: `${offsetWidth}px`,
        transform: `translate3d(${offsetWidth}px, 0, 0)`
      }
      this.progressStyle = style
    }
  },
  mounted () {
    this.progressBtnWidth = this.$refs.progressBtn2.clientWidth
  },
  props: {
    duration: {
      type: Number,
      default () {
        return 0
      }
    },
    position: {
      type: Number,
      default () {
        return 0
      }
    }
  },
  filters: {
    time (interval) {
      interval = interval | 0
      let minute = (interval / 60) | 0
      let second = interval % 60
      if (second < 10) {
        second = '0' + second
      }
      return minute + ':' + second
    }
  },
  watch: {
    position (val) {
      if (val + '' === 0) {
        this.percent = 0
        this.offset(0)
      } else {
        this.percent = val / this.duration
      }
    },
    percent (newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth =
          this.$refs.progressBar.clientWidth - this.progressBtnWidth
        const offsetWidth = newPercent * barWidth
        this.offset(offsetWidth)
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/common/scss/index.scss";
.progress-wrapper {
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  width: 80%;
  margin: 0 auto;
  padding: 10px 0;
  .progress-bar-wrapper {
    flex: 1;
  }
  .time {
    font-size: 11px;
    -ms-flex: 0 0 38px;
    flex: 0 0 38px;
    line-height: 30px;
    width: 38px;
    &.time-r {
      text-align: right;
    }
  }
}
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 5px solid $color-theme-l;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
