<template>
  <div class="myMessage">
    <scroll class="scroll" :in-page="inPages" :data="createList" :start-y="historyPosition" ref="scroll">
      <div :style="currentSong.id?{height:'auto','padding-bottom':(bottom+60)+'px'}:{height:'auto','padding-bottom':(bottom)+'px'}">
        <div class="decorate"></div>
        <div style="padding-top:10px">
          <div class="user">
            <div class="icon">
              <img v-lazy="$store.state.userImg" :key="$store.state.userImg" width="100%" height="100%" />
            </div>
            <div class="userName">{{$store.state.userName||'未登录'}}</div>
            <div class="user_btn" @click.stop="goToLogin" v-if="$store.state.loginState===false">登陆</div>
            <div class="user_btn" v-if="$store.state.loginState===true" @click.stop="logout">注销</div>
          </div>
        </div>
        <div class="title" style="margin-top: 15px" @click.stop="localListShow=!localListShow">
          <i :class="localListShow?'iconfont icon icon-back':'iconfont icon icon-next'"></i>
          记录
        </div>
        <ul class="list" v-show="localListShow">
          <li class="item" v-if="historyList.length>0" @click.stop="goToDetail({image:historyList[0].image,name:'最近播放',trackCount:historyList.length})">
            <img v-lazy="historyList[0].image" :key="historyList[0].image" class="icon">
            <div class="box">
              <h2 class="name">最近播放</h2>
              <p class="count">{{historyList.length}}(首)</p>
            </div>
          </li>
        </ul>
        <div v-if="!listLoading">
          <div class="title" style="margin-top: 15px" v-if="createList.length>0" @click.stop="createListShow=!createListShow">
            <i :class="createListShow?'iconfont icon icon-back':'iconfont icon icon-next'"></i>
            创建的歌单
          </div>
          <ul class="list" v-show="createListShow">
            <li class="item" v-for="item in createList" :key="item.id" @click.stop="$router.push({name:'songDetail',params:{id:item.id,image:item.image,title:item.name,playCount:item.playCount, trackCount:item.trackCount}})">
              <img v-lazy="item.image" :key="item.image" class="icon">
              <div class="box">
                <h2 class="name">{{item.name}}</h2>
                <p class="count">{{item.trackCount}}(首)</p>
              </div>
            </li>
          </ul>
          <div class="title" style="margin-top: 15px" v-if="subList.length>0" @click.stop="subListShow=!subListShow">
            <i :class="subListShow?'iconfont icon icon-back':'iconfont icon icon-next'"></i>
            收藏的歌单
          </div>
          <ul class="list" v-show="subListShow">
            <li class="item" v-for="item in subList" :key="item.id" @click.stop="$router.push({name:'songDetail',params:{id:item.id,image:item.image,title:item.name,playCount:item.playCount, trackCount:item.trackCount}})">
              <img v-lazy="item.image" :key="item.image" class="icon">
              <div class="box">
                <h2 class="name">{{item.name}}</h2>
                <p class="count">{{item.trackCount}}(首)</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <div class="loading-content" v-if="listLoading">
      <loading></loading>
    </div>
  </div>
</template>

<script>
import loading from '@/components/loading'
import { mapGetters, mapMutations } from 'vuex'
import scroll from '@/components/scroll'
import { userPlaylist, logout } from '@/base/api'
import { Indicator } from 'mint-ui'
export default {
  data () {
    return {
      historyPosition: '0',
      userImg: '',
      createList: [],
      subList: [],
      listLoading: false,
      bottom: 0,
      localListShow: true,
      createListShow: true,
      subListShow: true,
      inPages: true
    }
  },
  components: {
    scroll,
    loading
  },
  methods: {
    ...mapMutations({
      setMusicList: 'SET_MUSICLIST',
      setCurrentIndex: 'SET_CURRENTINDEX'
    }),
    getPlayList (uid, timeFlag) {
      if (timeFlag !== true) {
        this.listLoading = true
      }
      userPlaylist(uid)
        .then(res => {
          const data = res.data
          if (data && data.code + '' === '200') {
            const playlist = data.playlist
            if (playlist) {
              playlist.forEach(e => {
                e.image = e.coverImgUrl
                e.name =
                  e.userId + '' === uid + '' &&
                  e.name.indexOf(this.$store.state.userName) !== -1
                    ? e.name.replace(this.$store.state.userName, '我')
                    : e.name
              })
              const subList = playlist.filter(e => {
                return e.userId + '' !== uid + ''
              })
              const createList = playlist.filter(e => {
                return e.userId + '' === uid + ''
              })
              setTimeout(() => {
                this.createList = createList
                this.subList = subList
                this.listLoading = false
              }, 1000)
            }
          }
        })
        .catch(e => {
          this.listLoading = false
        })
    },
    logout () {
      Indicator.open('注销中')
      logout()
        .then(res => {
          Indicator.close()
          this.$store.state.loginState = false
          this.setCurrentIndex(0)
          this.setMusicList([])
          this.$bus.emit('del-player')
        })
        .catch(e => {
          this.toast('注销失败！')
          Indicator.close()
        })
    },
    goToLogin () {
      this.setCurrentIndex(0)
      this.setMusicList([])
      this.$bus.emit('del-player')
      this.$router.push('/phoneLogin')
    },
    goToDetail (item) {
      this.$router.push({name: 'songDetail',
        params: {
          type: 'historyList',
          title: item.name,
          image: item.image,
          trackCount: item.trackCount
        }
      })
    }
  },
  watch: {
    '$store.state.userId' (val) {
      const createList = JSON.parse(localStorage.getItem('my_message.createList')) || []
      const subList = JSON.parse(localStorage.getItem('my_message.subList')) || []
      if (val) {
        if (createList.length > 0 && subList.length > 0) {
          this.createList = createList
          this.subList = subList
          setTimeout(() => {
            this.getPlayList(this.$store.state.userId, true)
          }, 1000)
          return
        }
        this.getPlayList(val)
      } else {
        this.createList = []
        this.subList = []
      }
    },
    'createList' (val) {
      localStorage.setItem('my_message.createList', JSON.stringify(val))
    },
    'subList' (val) {
      localStorage.setItem('my_message.subList', JSON.stringify(val))
    }
  },
  mounted () {
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
    if (this.$store.state.userId) {
      const createList = JSON.parse(localStorage.getItem('my_message.createList')) || []
      const subList = JSON.parse(localStorage.getItem('my_message.subList')) || []
      if (createList.length > 0 && subList.length > 0) {
        this.createList = createList
        this.subList = subList
        setTimeout(() => {
          this.getPlayList(this.$store.state.userId, true)
        }, 1000)
        return
      }
      this.getPlayList(this.$store.state.userId)
    }
  },
  activated () {
    this.inPages = true
  },
  computed: {
    ...mapGetters(['currentSong', 'historyList'])
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
.myMessage {
  width: 100%;
  height: 100%;
  background: #f2f3f4;
  position: absolute;
  overflow: hidden;
  .scroll {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .decorate {
    position: absolute;
    top: -28vh;
    z-index: -10;
    background: #d44439;
    width: 100%;
    height: 36vh;
    vertical-align: inherit;
  }
  .user {
    width: 95%;
    height: 80px;
    background: #e4e4e4;
    margin: 0 auto;
    // margin-top: 20px;
    border-radius: 5px;
    display: flex;
    align-items: Center;
    position: relative;
    .icon {
      width: 50px;
      height: 50px;
      margin-left: 15px;
      border-radius: 50%;
      overflow: hidden;
      float: left;
    }
    .userName {
      float: left;
      width: auto;
      height: 20px;
      font-size: 16px;
      line-height: 20px;
      font-weight: 600;
      margin-left: 10px;
      color: #2e3030;
    }
    .user_btn {
      width: 65px;
      height: 30px;
      border: 1px solid #d44439;
      color: #d44439;
      font-size: 16px;
      position: absolute;
      right: 15px;
      text-align: center;
      line-height: 30px;
      border-radius: 15px;
    }
  }
  .title {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    background: #e4e4e4;
    padding-left: 15px;
    .icon {
      font-size: 16px;
      &.icon-back {
        &:before {
          content: $icon-right;
        }
      }
      &.icon-next {
        &:before {
          content: $icon-next;
        }
      }
    }
  }
  h2,
  p {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font-weight: 400;
    vertical-align: baseline;
  }
  ul {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font-weight: 400;
    vertical-align: baseline;
  }
  .list {
    width: 100%;
    height: auto;
    .item {
      display: flex;
      align-items: Center;
      height: 80px;
      width: 100%;
      position: relative;
      // border-bottom: 1px solid #e4e4e4;
      list-style: none;
      padding-left: 15px;
      .icon {
        height: 65px;
        width: 65px;
        border-radius: 5px;
        overflow: hidden;
      }
      .box {
        // display: flex;
        // align-items: Center;
        padding-top: 7.5px;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        box-sizing: border-box;
        padding-left: 90px;
        .name {
          font-size: 20px;
          color: #2e3030;
          width: 80%;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          height: 30px;
          line-height: 30px;
        }
        .count {
          margin-top: 3px;
          font-size: 16px;
          width: 100%;
          height: 25px;
          line-height: 25px;
        }
      }
    }
  }
  .loading-content {
    position: fixed;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
