<template>
     <transition :name="slideName">
      <div class="main">
        <transition :name="slideName1">
          <commentMusic @closeComment="closeComment" :comment="comment" :image="currentSong.image" :name="currentSong.name" :singer="currentSong.singer" v-show="commentShow"></commentMusic>
        </transition>
        <popup
          v-model="popupVisible"
          style="border-radius: 5px; padding-bottom: 30px; padding-top: 10px"
        >
          <h2>请选择要查看的歌手</h2>
          <scroll
            :data="currentSong.artistNew"
            class="singer-box"
            :stopPropagation="true"
            :click="true"
          >
            <div style="width:100%; height:auto">
              <div
                v-for="(item,index) in currentSong.artistNew"
                :key="index"
                @click.stop="selectSinger(item)"
              >
                <cell
                  class="cell"
                  :title="item.name"
                >
                  <img
                    style="border-radius:5px; margin-right:20px"
                    slot="icon"
                    v-lazy="item.singerImage"
                    :key="item.singerImage"
                    width="auto"
                    height="60"
                  >
                </cell>
              </div>
            </div>
          </scroll>
        </popup>
        <musicBox
          @singerclick="showSinger"
          v-immersed
          :currentMusic="currentMusic"
          @percentChangeEnd="seekTo"
          :playType="playing?'play':'pause'"
          :commentCount="commentCount"
          @openComment="openComment"
        ></musicBox>
      </div>
    </transition>
</template>

<script>
import commentMusic from '@/pages/commentMusic'
import musicBox from '@/components/musicBox'
import { mapGetters, mapState } from 'vuex'
import { pageApiCommentMusic } from '@/base/api'
import scroll from '@/components/scroll'
import { Popup, Cell } from 'mint-ui'
export default {
  data () {
    return {
      comment: [],
      commentShow: false,
      slideName: 'up',
      slideName1: 'up',
      popupVisible: false,
      currentMusic: {
        duration: 0,
        position: 0,
        image: '',
        name: '',
        artist: []
      },
      artistList: [],
      commentCount: ''
    }
  },
  components: {
    musicBox,
    Popup,
    Cell,
    scroll,
    commentMusic
  },
  computed: {
    ...mapGetters(['currentSong', 'playing', 'musicList']),
    ...mapState(['playerShowFlag'])
  },
  mounted () {
    if (window.plus) {
      this.plusLoad()
    } else {
      document.addEventListener('plusready', () => {
        this.plusLoad()
      })
    }
    let currentMusic = this.currentMusic
    for (let key in this.currentMusic) {
      currentMusic[key] = this.currentSong[key]
    }
  },
  methods: {
    plusLoad () {
      const webview = window.plus.webview.currentWebview()
      const Intent = window.plus.android.importClass('android.content.Intent')
      const intent = new Intent()
      const main = window.plus.android.runtimeMainActivity()
      const self = this
      window.plus.key.addEventListener('backbutton', function () {
        if (self.commentShow === true) {
          self.closeComment()
        } else if (self.playerShowFlag === true) {
          self.$bus.emit('player-hide')
        } else {
          webview.canBack(function (e) {
            if (e.canBack) {
              webview.back()
            } else {
              intent.setAction(Intent.ACTION_MAIN) // "android.intent.action.MAIN"
              intent.addCategory(Intent.CATEGORY_HOME) // "android.intent.category.HOME"
              main.startActivity(intent)
            }
          })
        }
      })
    },
    openComment () {
      this.commentShow = true
      this.slideName1 = 'down'
    },
    closeComment () {
      this.commentShow = false
      this.slideName1 = 'up'
    },
    seekTo (precent) {
      this.$bus.emit('add-seek-to', { precent: precent })
    },
    selectSinger (singer) {
      this.popupVisible = false
      this.slideName = ''
      this.$nextTick(() => {
        this.$bus.emit('player-hide')
        const params = {
          id: singer.id,
          image: singer.singerImage || singer.image,
          title: singer.name
        }
        this.$bus.emit('singer-detail-acrive', { params })
        this.$router.push({ name: 'singerDetail', params: params })
      })
    },
    showSinger () {
      const artistNew = this.currentSong.artistNew
      if (artistNew && artistNew.length > 0) {
        if (artistNew.length === 1) {
          this.selectSinger(artistNew[0])
        } else {
          this.popupVisible = true
        }
      } else {
        this.toast('繁忙，请稍后再试')
      }
    },
    getCommentMusic (id) {
      pageApiCommentMusic(id).then(res => {
        if (res.status + '' === '200' && res.data.code + '' === '200') {
          const data = res.data
          this.commentCount = data.total + ''
          this.comment = data.hotComments
          console.log(data)
        }
      })
    }
  },
  watch: {
    currentSong: {
      handler (val) {
        this.commentCount = ''
        this.comment = []
        this.getCommentMusic(val.id)
        let currentMusic = this.currentMusic
        for (let key in this.currentMusic) {
          currentMusic[key] = val[key]
        }
      },
      deep: true
    },
    musicList (val) {
      if (val.length === 0) {
        if (this.playerShowFlag === true) {
          this.$bus.emit('player-hide')
        }
      }
    },
    playerShowFlag (val) {
      if (val === true) {
        this.slideName = 'up'
      }
    }
  },
  activated () {
    this.slideName = 'up'
  }
}
</script>

<style scoped lang='scss'>
h2 {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 18px;
  font-weight: 400;
  vertical-align: baseline;
  padding: 0 0.238095rem;
  margin-bottom: 7px;
}
.main {
  z-index: 200;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  top: 0px;
  left: 0px;
  position: fixed;
  background: #ffffff;
}
.up-enter {
  -webkit-transform: translate3d(0, 100%, 0);
  -moz-transform: translate3d(0, 100%, 0);
  -ms-transform: translate3d(0, 100%, 0);
  transform: translate3d(0, 100%, 0);
}
.up-enter-active {
  transition: 300ms;
}
.up-leave-to {
  z-index: 181;
  -webkit-transform: translate3d(0, 100%, 0);
  -moz-transform: translate3d(0, 100%, 0);
  -ms-transform: translate3d(0, 100%, 0);
  transform: translate3d(0, 100%, 0);
}
.up-leave-active {
  transition: 300ms;
}
.singer-box {
  max-height: 205px; /*no*/
  height: auto;
  .cell {
    width: 280px;
    margin-top: 10px;
    background-repeat: inherit;
  }
}
.singer-box::-webkit-scrollbar {
  display: none;
}
</style>
