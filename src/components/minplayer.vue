<template>
  <div>
    <transition name="mini">
      <div class="mini-player" v-show="currentSong.id" @click.stop="$bus.emit('player-show')">
        <div class="icon">
          <img
            :class="playing?'play':'play pause'"
            v-lazy="currentSong.image"
            :key="currentSong.image"
            width="40"
            height="40"
          />
        </div>
        <div class="text">
          <div class="name" v-html="currentSong.name"></div>
          <div class="desc" v-html="singer"></div>
        </div>
        <div class="control" @click.stop="$bus.emit('set-play-state',!playing)">
          <progress-circle
            style="width:100%; text-align:center"
            :radius="radius"
            :percent="percent+''"
          >
            <i :class="playing?'iconfont fa-stop fa':'iconfont fa-play fa'"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="$bus.emit('show-playlist')">
          <i class="iconfont icon-caidan"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ProgressCircle from '@/components/progress-circle'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      radius: 32
    }
  },
  computed: {
    ...mapGetters(['currentSong', 'playing', 'playerObj']),
    singer () {
      let res = ''
      if (this.currentSong.artist && this.currentSong.artist.length > 0) {
        for (let i = 0; i < this.currentSong.artist.length; i++) {
          res = res + this.currentSong.artist[i].name
          if (this.currentSong.artist.length !== i + 1) {
            res = res + '/'
          }
        }
      }
      return res
    },
    percent () {
      if (this.playerObj.duration && this.playerObj.position) {
        return (this.playerObj.position / this.playerObj.duration).toFixed(4)
      } else {
        return 0
      }
    }
  },
  components: {
    ProgressCircle
  },
  props: {}
}
</script>

<style scoped lang="scss">
@import "@/common/scss/icon.scss";
@import "@/common/scss/index.scss";
.mini-player {
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60Px; /* no*/
  background: hsla(0, 0%, 100%, 0.95);
  &.mini-enter-active,
  &.mini-leave-active {
    transition: all 1s;
  }
  &.mini-enter,
  &.mini-leave-to {
    opacity: 0;
  }
  .icon {
    flex: 0 0 40Px; /* no*/
    width: 40Px; /* no*/
    padding: 0 10px 0 20Px; /* no*/
    img {
      border-radius: 50%;
      &.play {
        animation: rotate 10s linear infinite;
      }
      &.pause {
        animation-play-state: paused;
      }
    }
  }
  .text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    overflow: hidden;
    .name {
      margin-bottom: 2Px; /* no*/
      line-height: 14Px; /* no*/
      @include no-wrap();
      font-size: $font-size-small;
      color: $color-text;
    }
    .desc {
      margin-bottom: 2Px; /* no*/
      line-height: 14Px; /* no*/
      @include no-wrap();
      font-size: $font-size-small;
      color: $color-text;
    }
  }
  .control {
    flex: 0 0 30Px; /* no*/
    padding: 0 10Px; /* no*/
    .icon-play-mini,
    .icon-pause-mini,
    .icon-playlist,
    .iconfont {
      font-size: 30Px; /* no*/
      color: $color-theme-d;
    }
    .iconfont {
      position: relative;
      left: -5Px; /* no*/
      top: -3Px; /* no*/
    }
    .fa-play {
      &:before {
        content: $icon-play;
      }
      color: $color-theme-d;
      font-size: 14Px; /* no*/
      position: absolute;
      left: 10.5Px; /* no*/
      top: 9Px; /* no*/
    }
    .fa-stop {
      &:before {
        content: $icon-minizanting;
      }
      color: $color-theme-d;
      font-size: 12Px; /* no*/
      position: absolute;
      left: 10Px; /* no*/
      top: 9.5Px; /* no*/
    }
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
.icon-caidan {
  &:before {
    content: $icon-caidan;
  }
}
</style>
