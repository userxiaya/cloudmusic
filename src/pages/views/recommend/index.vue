<template>
  <div class="content">
    <scroll class="recommend-content" ref="scroll" :in-page="inPages" :data="listLoadList" :start-y="historyPosition">
      <div :style="currentSong.id?{height:'auto','padding-bottom':(bottom+60)+'px'}:{height:'auto','padding-bottom':(bottom)+'px'}" ref="scrollBox">
        <div class="banner">
          <div class="decorate" v-if="bannerList.length>0"></div>
          <div class="slider" v-if="bannerList.length>0">
            <swiper :options="swiperOption">
              <swiper-slide v-for="slide in bannerList" :key="slide.image">
                <img :src="slide.image" width="100%" height="auto" ref="slideImage" />
              </swiper-slide>
              <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
          </div>
        </div>
        <h1 class="title">推荐歌单</h1>
        <ul>
          <li class="item" v-for="li in personalizedList" :key="li.id" @click.stop="$router.push({name:'songDetail',params:{id:li.id,image:li.image,title:li.name,playCount:li.playCount, trackCount:li.trackCount}})">
            <div class="icon">
              <div class="gradients">
                <div class="play-count">
                  <i class="iconfont listen-icon"></i>
                  {{li.playCount|playCount}}
                </div>
              </div>
              <img v-lazy="li.image" width="100%" height="auto">
            </div>
            <div class="text">
              {{li.name}}
            </div>
          </li>
        </ul>
        <h1 class="title">推荐歌曲</h1>
        <ul>
          <li class="item" v-for="li in newSongList" :key="li.id" @click.stop="play(li)">
            <div class="icon" v-item>
              <img v-lazy="li.image" width="100%" height="auto">
            </div>
            <p class="textsong">
              {{li.name}}
            </p>
            <p class="singer" style="color:#757575;">{{li.singer}}</p>
          </li>
        </ul>
      </div>
    </scroll>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import 'swiper/dist/css/swiper.css'
import {
  pageApiRecommend
} from '@/base/api'
import { swiper, swiperSlide } from '@/components/vue-awesome-swiper'
import scroll from '@/components/scroll'
export default {
  data () {
    return {
      listLoad: {
        bannerList: false,
        personalizedList: false,
        newSongList: false
      },
      swiperOption: {
        autoplay: true,
        loop: true,
        preventClicksPropagation: true, // 阻止click冒泡。拖动Swiper时阻止click事件。
        pagination: {
          el: '.swiper-pagination',
          bulletActiveClass: 'my-bullet-active',
          bulletClass: 'my-bullet'
        }
      },
      startY: '0',
      personalizedList: [],
      bannerList: [],
      newSongList: [],
      bottom: 0,
      inPages: true,
      historyPosition: '0'
    }
  },
  components: {
    scroll,
    swiper,
    swiperSlide
  },
  methods: {
    ...mapMutations({
      playBySong: 'PLAYBYSONG'
    }),
    play (item) {
      if (this.currentSong.id && this.currentSong.id + '' === item.id + '') {
        this.$bus.emit('player-show')
      } else {
        const self = this
        const song = item
        this.playBySong({ self, song })
      }
    },
    getData () {
      pageApiRecommend().then(res => {
        const data = (res.status + '' === '200') ? res.data : null
        if (data) {
          this.bannerList = data.bannerList
          this.personalizedList = data.personalizedList
          this.newSongList = data.newSongList
        }
      })
    }
  },
  mounted () {
    const dataRefashDate = localStorage.getItem('dataRefashDate')
    const now = new Date()
    const data = localStorage.getItem('indexPageData')
    if (data) {
      const indexPageData = data ? JSON.parse(data) : {}
      this.bannerList = indexPageData.banner
      this.personalizedList = indexPageData.personalized
      this.newSongList = indexPageData.newSong
    }
    if (dataRefashDate === `${now.getFullYear()}` + `${now.getMonth() + 1}` + `${now.getDate()}`) {
      return
    }
    this.getData()
    if (window.plus) {
      const top = window.plus.navigator.getStatusbarHeight()
      this.bottom = top
    } else {
      document.addEventListener(
        'plusready',
        function () {
          const top = window.plus.navigator.getStatusbarHeight()
          this.bottom = top
        },
        false
      )
    }
  },
  computed: {
    ...mapGetters(['currentSong']),
    listLoadList () {
      let list = []
      for (let key in this.listLoad) {
        if (this.listLoad[key] === true) {
          list.push('')
        }
      }
      return list
    },
    indexPageData () {
      // const now = new Date()
      return {
        banner: this.bannerList,
        personalized: this.personalizedList,
        newSong: this.newSongList
      }
    }
  },
  directives: {
    item: {
      // 指令的定义
      inserted: function (el) {
        el.style['min-height'] = `${el.clientWidth + 8}px`
      }
    }
  },
  watch: {
    '$store.state.checkLogin' () {
      this.getData()
    },
    '$store.state.loginState' () {
      this.getData()
    },
    'indexPageData' (val) {
      if (val.banner && val.banner.length > 0 && val.personalized && val.personalized.length > 0 && val.newSong && val.newSong.length > 0) {
        const now = new Date()
        const dataRefashDate = `${now.getFullYear()}` + `${now.getMonth() + 1}` + `${now.getDate()}`
        localStorage.setItem('dataRefashDate', dataRefashDate)
        localStorage.setItem('indexPageData', JSON.stringify(val))
      }
    }
  },
  activated () {
    this.inPages = true
    this.$parent.history = 'index'
  },
  deactivated () {
    this.historyPosition = this.$refs.scroll.scrollPosition() + ''
    this.inPages = false
  }
}
</script>

<style scoped lang="scss">
@import "@/common/scss/index.scss";
@import "@/common/scss/icon.scss";
p {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font-weight: 400;
  vertical-align: baseline;
}
.content {
  width: 100%;
  height: 100%;
  position: absolute;
  .recommend-content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    text-align: center;
  }
  .banner {
    width: 100%;
    padding-top: 5px;
    position: relative;
    .decorate {
      position: absolute;
      top: -30vh;
      background: #d44439;
      width: 100%;
      height: 47vh;
      vertical-align: inherit;
    }
    .slider {
      width: 97%;
      padding: 0;
      margin: 0 auto;
      height: auto;
      border-radius: 8px;
      min-height: 30px;
      max-height: 300px;
      height: auto;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
      overflow: hidden;
      overflow: hidden;
    }
  }
  .title {
    height: 65px;
    line-height: 65px;
    padding-left: 1.5%;
    text-align: left;
    font-size: 16px;
    font-weight: 700;
    color: #2e3030;
  }
  ul {
    height: auto;
    width: 100%;
    padding: 0;
    margin: 0;
    padding-left: 0.5%;
    display: flex;
    flex-flow: row wrap;
    align-content: flex-start;
    .item {
      flex: 0 0 33%;
      display: inline-block;
      position: relative;
      box-sizing: border-box;
      width: 33%;
      padding: 0 1%;
      height: auto;
      .icon {
        padding: 0px;
        position: relative;
        display: inline-block;
        width: 100%;
        margin-bottom: 5px;
        img {
          border-radius: 5px;
        }
        .gradients {
          position: absolute;
          top: 0;
          width: 100%;
          height: 35px;
          border-radius: 3px;
          background: linear-gradient(
            hsla(0, 0%, 43%, 0.4),
            hsla(0, 0%, 100%, 0)
          );
        }
        .play-count {
          position: absolute;
          height: 12px;
          line-height: 12px;
          top: 5px;
          right: 5px;
          font-size: 12px;
          color: #f1f1f1;
        }
      }
      .text {
        text-align: left;
        height: 45px;
        width: 100%;
        overflow: hidden;
        margin-bottom: 10px;
        font-size: 11px;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      .textsong {
        text-align: left;
        margin-bottom: 0px;
        height: 13px; /*no*/
        line-height: 13px; /*no*/
        font-size: 11px; /*no*/
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        box-sizing: border-box;
      }
      .singer {
        box-sizing: border-box;
        height: 13px; /*no*/
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin-bottom: 10px;
        margin-top: 3px;
        line-height: 13px; /*no*/
        text-align: left;
        @include no-wrap();
        font-size: $font-size-small; /*no*/
        color: $color-text-g;
      }
    }
  }
  .listen-icon {
    &:before {
      content: $icon-listen;
    }
  }
}
</style>
