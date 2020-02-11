<template>
  <transition :name="slideName">
    <div class="main">
      <popup v-model="popupVisible" style="border-radius: 5px; padding-bottom: 30px; padding-top: 10px">
        <h2>请选择要查看的歌手</h2>
        <scroll :data="currentSong.artistNew" class="singer-box" :stopPropagation="true" :click="true">
          <div style="width:100%; height:auto">
            <div v-for="(item,index) in currentSong.artistNew" :key="index" @click.stop="selectSinger(item)">
              <cell class="cell" :title="item.name">
                <img style="border-radius:5px; margin-right:20px" slot="icon" v-lazy="item.singerImage" :key="item.singerImage" width="auto" height="60">
              </cell>
            </div>
          </div>
        </scroll>
      </popup>
      <musicBox :commentCount="commentCount" @openComment="openComment" @singerclick="showSinger" v-immersed :currentMusic="currentMusic" @percentChangeEnd="seekTo" :playType="playing?'play':'pause'"></musicBox>
    </div>
  </transition>
</template>

<script>
import musicBox from '@/components/musicBox'
import { mapGetters, mapState } from 'vuex'
import { songComment } from '@/base/api'
import scroll from '@/components/scroll'
import { Popup, Cell } from 'mint-ui'
export default {
  data () {
    return {
      commentCount: '0',
      slideName: 'up',
      popupVisible: false,
      currentMusic: {
        duration: 0,
        position: 0,
        image: '',
        name: '',
        artist: []
      },
      artistList: []
    }
  },
  components: {
    musicBox,
    Popup,
    Cell,
    scroll
  },
  computed: {
    ...mapGetters(['currentSong', 'playing', 'musicList']),
    ...mapState(['playerShowFlag'])
  },
  mounted () {
    let currentMusic = this.currentMusic
    for (let key in this.currentMusic) {
      currentMusic[key] = this.currentSong[key]
    }
  },
  methods: {
    seekTo (precent) {
      this.$bus.emit('add-seek-to', { precent: precent })
    },
    selectSinger (singer) {
      this.popupVisible = false
      this.slideName = ''
      this.$nextTick(() => {
        this.$bus.emit('player-hide')
        const params = {id: singer.id, image: singer.singerImage || singer.image, title: singer.name}
        this.$bus.emit('singer-detail-acrive', { params })
        this.$router.push({name: 'singerDetail', params: params})
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
    openComment () {
      this.popupVisible = false
      this.slideName = ''
      this.$nextTick(() => {
        this.$bus.emit('player-hide')
        const currentSong = this.currentSong
        const params = {id: currentSong.id, image: currentSong.image, name: currentSong.name, singer: currentSong.singer}
        this.$router.push({name: 'commentMusic', params: params})
      })
    }
  },
  watch: {
    currentSong: {
      handler (val) {
        let currentMusic = this.currentMusic
        for (let key in this.currentMusic) {
          currentMusic[key] = val[key]
        }
        songComment(val.id).then(res => {
          if (res.status === 200) {
            const data = res.data
            if (data.code === 200) {
              let total = data.total + ''
              if (total.length > 4) {
                total = `${total.slice(0, total.length - 4)}w+`
              }
              this.commentCount = total
            }
          }
        })
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
h2{
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
  .cell{
    width: 280px;
    margin-top: 10px;
    background-repeat: inherit
  }
}
.singer-box::-webkit-scrollbar {
    display: none;
}
</style>
