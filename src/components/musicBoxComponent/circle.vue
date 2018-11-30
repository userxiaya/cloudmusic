<template>
    <div class="box">
       <div class="middle-l">
           <div class="cd-wrapper">
               <div :class="'cd play '+playType">
                   <img class="image" v-lazy="currentSong.image" :key="currentSong.image">
                </div>
            </div>
       </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    playType: {
      type: String,
      default () {
        return 'pause'
      }
    },
    picUrl: {
      type: String,
      default () {
        return ''
      }
    }
  },
  computed: {
    ...mapGetters(['currentSong'])
  }
}
</script>

<style scoped lang="scss">
@import "@/common/scss/index.scss";
.box {
  width: 100%;
  height: auto;
}
.middle-l {
  display: inline-block;
  vertical-align: top;
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 80%;
  .cd-wrapper {
    position: absolute;
    left: 10%;
    top: 0;
    width: 80%;
    height: 100%;
    .cd {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border: 15px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      &.play {
        animation: rotate 20s linear infinite;
      }
      &.pause {
        animation-play-state: paused;
      }
      .image {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
    -webkit-transform:rotate(0deg);
  }
  100% {
    -webkit-transform:rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
