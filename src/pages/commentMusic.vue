<template>
<transition :name="slideName">
  <div class="main">
    <div class="header" :style="statusbar" v-immersed1>
        <div class="back" @click.stop="closeComment">
          <strong class="iconback iconfont"></strong>
        </div>
        <div class="text">
          <h1 class="title" style="margin: 0;padding: 0;border: 0;font-size: 100%;font-weight: 400;vertical-align: baseline;">热门评论</h1>
        </div>
    </div>
    <scroll :data="hotComment"  :click="true">
        <div class="list">
            <div class="statusbar" :style="{height:statusbarHeight}">&nbsp;</div>
            <div class="songDetail">
            <img
                class="image"
                v-lazy="image"
                :key="image"
            />
            <div class="right">
                <div class="name">{{name}}</div>
                <div class="singer">{{singer}}</div>
                <div class="iconfont icon-right">
                <div class="icon"></div>
                </div>
            </div>
            </div>
            <div class="hot_comment">
            <h1 class="title">精彩评论</h1>
            <ul>
                <li class="item" v-for="(item, index) in hotComment" :key="index">
                <div class="user">
                    <div class="left">
                    <img
                        class="image"
                        v-lazy="item.user.avatarUrl.replace(/.jpg|.jpeg|.png|.gif|.bmp/g, '.webp?imageView&thumbnail=360y360&quality=75&tostatic=0&type=webp')" :key="item.user.avatarUrl.replace(/.jpg|.jpeg|.png|.gif|.bmp/g, '.webp?imageView&thumbnail=360y360&quality=75&tostatic=0&type=webp')"
                    />
                    <div class="text">
                        <div class="userName">{{item.user.nickname}}</div>
                        <div class="time">{{item.time|formatTime('yyyy年MM月dd日')}}</div>
                    </div>
                    </div>
                    <div class="right">
                    123645&nbsp;&nbsp;
                    <img src="@/assets/good.png" />
                    </div>
                </div>
                <div class="comment">
                {{item.content}}
                </div>
                </li>
            </ul>
            </div>
        </div>
    </scroll>
  </div>
</transition>
</template>
<script>
import scroll from '@/components/scroll'
import { songComment } from '@/base/api'
export default {
  data () {
    return {
      statusbar: {},
      artistNew: [],
      image: '',
      name: '',
      singer: '',
      hotComment: [],
      slideName: 'up',
      statusbarHeight: '0px'
    }
  },
  mounted () {
    if (window.plus) {
      this.plusLoad()
    } else {
      document.addEventListener('plusready', () => {
        this.plusLoad()
      })
    }
  },
  activated () {
    const params = this.$route.params || {}
    this.image = params.image
    this.singer = params.singer
    this.name = params.name
    const id = params.id
    songComment(id).then(res => {
      if (res.status === 200) {
        const data = res.data
        if (data.code === 200) {
          this.hotComment = data.hotComments
        }
      }
    })
  },
  components: {
    scroll
  },
  methods: {
    plusLoad () {
      const height = window.plus.navigator.getStatusbarHeight()
      this.statusbarHeight = `${window.plus.navigator.getStatusbarHeight()}px`
      const headHeight = 44
      this.statusbar = {
        'background-color': '#d44439',
        'height': `${height + headHeight}px`,
        'padding-top': `${height}px`
      }
    },
    closeComment () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/common/scss/icon.scss";
@import "@/common/scss/index.scss";
.statusbar {
    width: 100%;
}
.up-enter {
   -webkit-transform: translate3d(0,100%,0);
   -moz-transform: translate3d(0,100%,0);
   -ms-transform: translate3d(0,100%,0);
   transform: translate3d(0,100%,0);
}
.up-enter-active {
  transition: 300ms;
}
.up-leave-to {
  z-index: 10;
  -webkit-transform: translate3d(0,100%,0);
  -moz-transform: translate3d(0,100%,0);
  -ms-transform: translate3d(0,100%,0);
  transform: translate3d(0,100%,0);
}
.up-leave-active {
  transition: 300ms;
}
.main {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #ffffff;
  .list {
    width: 100%;
    height: auto;
    padding-bottom: 90px;
    background-color: #ffffff;
    padding-top: 60px;
  }
  .songDetail {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    padding-left: 5px;
    padding-right: 5px;
    overflow: hidden;
    display: flex;
    align-items: center;
    .image {
      width: 22%;
      height: auto;
      float: left;
      border-radius: 5px;
    }
    .right {
      box-sizing: border-box;
      padding-left: 10px;
      height: 100%;
      width: 78%;
      overflow: hidden;
      float: left;
      position: relative;
      padding-right: 40px;
      .name {
        overflow: hidden;
        font-size: 18px;
        color: #2e3030;
        word-wrap: break-word;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .singer {
        overflow: hidden;
        height: 30px;
        line-height: 30px;
        font-size: 16px;
        color: skyblue;
        word-wrap: break-word;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .icon-right {
        position: absolute;
        right: 10px;
        top: 0px;
        font-size: 25px;
        width: 25px;
        height: 100%;
        display: flex;
        align-items: center;
        .icon {
          width: 100%;
          height: auto;
          &:before {
            content: $icon-next;
          }
        }
      }
    }
  }
  .hot_comment {
    padding-top: 10px;
    width: 100%;
    height: auto;
    padding-left: 10px;
    padding-right: 10px;
    .title {
      text-align: left;
      font-size: 16px;
      font-weight: 600;
      color: #2e3030;
    }
    .item {
      margin-bottom: 15px;
      width: 100%;
      height: auto;
      list-style: none;
      position: relative;
      .user {
        height: 50px;
        width: auto;
        display: flex;
        align-items: center;
        .left {
          width: 60%;
          position: relative;
          height: 40px;
        }
        .image {
          border-radius: 50%;
          height: 40px;
          width: 40px;
          float: left;
        }
        .text {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          left: 0px;
          top: 0px;
          padding-left: 50px;
          .userName {
            font-size: 18px;
            height: 20px;
            line-height: 20px;
            color: #485159;
          }
          .time {
            font-size: 9px;
            color: #545454;
          }
        }
        .right {
          position: absolute;
          right: 30px;
          height: 100%;
          display: flex;
          font-size: 16px;
          color: #4b5258;
          align-items: center;
          img {
            width: 18px;
            height: 18px;
          }
        }
      }
      .comment {
        word-wrap: break-word;
        padding-left: 50px;
        padding-right: 30px;
        font-size: 16px;
      }
    }
  }
  h1 {
    display: block;
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }
  ul {
    padding-left: 0px;
  }
  .header {
    box-sizing: border-box;
    position: fixed;
    background: #d44439;
    z-index: 10;
    top: 0;
    width: 100%;
    height: 44px; /*no*/
    color: #fff;
    z-index: 100;
    .back {
        position: absolute;
        left: 15px; /*no*/
        width: 100%;
        line-height: 44px; /*no*/
        font-size: 40px; /*no*/
        .iconback {
        position: absolute;
        color: #f1f1f1;
        height: 44px; /*no*/
        font-size: 28px; /*no*/
        line-height: 44px; /*no*/
        &:before {
            content: $icon-back;
        }
        }
    }
    .text {
        position: absolute;
        left: 48px; /*no*/
        width: 80%;
        line-height: 44px; /*no*/
        font-size: 18px; /*no*/
        @include no-wrap();
        .title {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        }
    }
  }
}
</style>
