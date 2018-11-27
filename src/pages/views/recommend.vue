<template>
  <div class="main">
    <div class="main-content">
      <div class="main-content">
        <navbar v-model="selected" class="tab">
          <tab-item id="index"><span class="tab-span">推荐</span></tab-item>
          <tab-item id="rank"><span class="tab-span">排行</span></tab-item>
          <tab-item id="singer"><span class="tab-span">歌手</span></tab-item>
        </navbar>
        <!-- <div class="mint-navbar tab">
          <div :class="selected==='index'?'mint-tab-item tab-item is-selected':'mint-tab-item tab-item'" @click.stop="$router.replace('/recommend/index')">
            <div class="mint-tab-item-icon"></div>
            <div class="mint-tab-item-label"><span class="tab-span">推荐</span></div>
          </div>
          <div :class="selected==='rank'?'mint-tab-item tab-item is-selected':'mint-tab-item tab-item'" @click.stop="$router.replace('/recommend/rank')">
            <div class="mint-tab-item-icon"></div>
            <div class="mint-tab-item-label"><span class="tab-span">排行</span></div>
          </div>
          <div :class="selected==='singer'?'mint-tab-item tab-item is-selected':'mint-tab-item tab-item'" @click.stop="$router.replace('/recommend/singer')">
            <div class="mint-tab-item-icon"></div>
            <div class="mint-tab-item-label"><span class="tab-span">歌手</span></div>
          </div>
        </div> -->
        <div class="contents">
          <div class="main-content">
            <swiper :options="swiperOption" class="box" ref="swipers">
              <swiper-slide>
                <index></index>
              </swiper-slide>
              <swiper-slide>
                <rank></rank>
              </swiper-slide>
              <swiper-slide>
                <singer></singer>
              </swiper-slide>
            </swiper>
            <!-- <keep-alive>
                <router-view></router-view>
              </keep-alive> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Navbar, TabItem } from 'mint-ui'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import index from './recommend/index'
import rank from './recommend/rank'
import singer from './recommend/singer'
export default {
  data () {
    return {
      history: 'index',
      selected: 'index',
      swiperOption: {
        autoplay: false,
        loop: false,
        noSwiping: true,
        noSwipingClass: 'stop-swiping',
        threshold: 25,
        // preventClicksPropagation: true, // 阻止click冒泡。拖动Swiper时阻止click事件。
        on: {
          slideChangeTransitionEnd: swipe => {
            switch (this.$refs.swipers.swiper.activeIndex) {
              case 1:
                this.selected = 'rank'
                break
              case 2:
                this.selected = 'singer'
                break
              default:
                this.selected = 'index'
            }
          }
        }
      }
    }
  },
  components: {
    Navbar,
    TabItem,
    index,
    rank,
    singer,
    swiper,
    swiperSlide
  },
  computed: {
  },
  activated () {
  },
  watch: {
    selected (val) {
      let index = 0
      switch (val) {
        case 'rank':
          index = 1
          break
        case 'singer':
          index = 2
          break
        default:
          index = 0
      }
      this.$refs.swipers.swiper.slideTo(index, 300, false)// 切换到第一个slide，速度为1秒
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/common/scss/index.scss";
.main {
  position: absolute;
  height: 100%;
  width: 100%;
  .main-content {
    height: 100%;
    width: 100%;
    position: relative;
  }
  .tab {
    margin: 0;
    position: absolute;
    top: 0px;
    line-height: 44px;
    height: 50px;
    box-sizing: border-box;
    padding-top: 6px;
    width: 100%;
    background: $color-theme;
    z-index: 99;
    .tab-item {
      color: #e4e4e4;
    }
  }
  .contents {
    position: absolute;
    height: 100%;
    width: 100%;
    padding-top: 50px;
    left: 0px;
    box-sizing: border-box;
    .box {
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
    }
  }
}
</style>
