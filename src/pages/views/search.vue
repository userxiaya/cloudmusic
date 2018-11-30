<template>
  <div class="search" ref="searchWrapper">
    <div class="head" ref="header" v-immersed1>
      <div class="back iconfont" @click.stop="$router.go(-1)"></div>
      <input type="text" placeholder="搜索歌曲，歌手" v-model="query" ref="input">
      <div class="close iconfont" @click.stop="clear" v-show="this.query"></div>
    </div>
    <scroll ref="scroll" :pullup="true" @scrollToEnd="searchMore" :style="{width:'100%',height:height,'overflow':'hidden'}">
      <div :style="{width:'100%', height:'auto','padding-bottom':pt}">
        <div class="search-hots" style="pointer-events: auto;" v-show="!query">
          <p class="title">热门搜索</p>
          <span class="search-hots-item" v-for="item in hots" :key="item.first" @click.stop="setSearch(item.first)">
            {{ item.first }}
          </span>
        </div>
        <div class="search-history" v-show="!query">
          <h1 class="title" v-show="searchHistoryList.length>0"><span class="text">搜索历史</span> <span class="clear" @click.stop="setSearchHistory([])"><i class="icon-clear iconfont"></i></span></h1>
          <div class="search-list">
            <ul>
              <li class="search-item" v-for="(item,index) in searchHistoryList" :key="index" @click.stop="setSearch(item)">
                <span class="text">{{item}}</span>
                <span class="icon"><i class="icon-delete iconfont"></i></span>
              </li>
            </ul>
          </div>
        </div>
        <searchList :query="query" ref="suggest" @singerDetail="singerDetail" @songDetail="songDetail" v-show="query" @selectItem="selectItem"></searchList>
      </div>
    </scroll>

  </div>
</template>

<script>
import scroll from '@/components/scroll'
import { searchHot } from '@/base/api'
import { mapGetters, mapMutations } from 'vuex'
import searchList from '@/components/searchList'
export default {
  data () {
    return {
      query: '',
      hots: [],
      height: '',
      pt: ''
    }
  },
  computed: {
    ...mapGetters(['currentSong', 'searchHistoryList'])
  },
  mounted () {
    let height = screen.height - this.$refs.header.clientHeight
    if (this.currentSong.id) {
      this.pt = '60px'
    }
    this.height = `${height}px`
    searchHot().then(res => {
      if (res.data && res.data.code + '' === '200') {
        const result = res.data.result
        this.hots = result.hots
      }
    })
  },
  methods: {
    ...mapMutations({
      playBySong: 'PLAYBYSONG',
      saveSearchHistory: 'SAVESEARCHHISTORY',
      setSearchHistory: 'SET_SEARCHHISTORY'
    }),
    setSearch (query) {
      this.query = query
      this.saveSearchHistory(query)
    },
    searchMore () {
      this.$refs.suggest.searchMore()
    },
    songDetail (item) {
      this.$refs.input.blur()
      this.saveSearchHistory(this.query)
      this.$router.push({name: 'songDetail', params: item})
    },
    singerDetail (param) {
      this.saveSearchHistory(param.title)
      this.$router.push({name: 'singerDetail', params: param})
    },
    selectItem (item) {
      this.$refs.input.blur()
      this.saveSearchHistory(this.query)
      if (this.currentSong.id && this.currentSong.id + '' === item.id + '') {
        this.$bus.emit('player-show')
      } else {
        const self = this
        const song = item
        this.playBySong({self, song})
      }
    },
    clear () {
      this.query = ''
    }
  },
  components: {
    scroll,
    searchList
  },
  watch: {
    'currentSong.id' (val) {
      if (val) {
        this.pt = '60px'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/common/scss/icon.scss";
@import "@/common/scss/index.scss";
div,
p,
h1,
ul,
li {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font-weight: 400;
  vertical-align: baseline;
}
.search {
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  .head {
    box-sizing: border-box;
    margin: 0;
    width: 100%;
    height: 40px; /*no*/
    box-sizing: border-box;
    background: $color-theme;
    position: relative;
    box-sizing: border-box;
    color: #f1f1f1;
    top: 0px;
    padding-top: 3px; /*no*/
    .close {
      &:before {
        content: $icon-cha1;
      }
      height: 30px; /*no*/
      width: 10%;
      line-height: 30px; /*no*/
      font-size: 15px; /*no*/
      text-align: center;
      box-sizing: border-box;
      float: left;
    }
    .back {
      &:before {
        content: $icon-back;
      }
      height: 30px; /*no*/
      width: 15%;
      line-height: 30px;/*no*/
      font-size: 28px; /*no*/
      padding-left: 6px; /*no*/
      box-sizing: border-box;
      float: left;
    }
    input {
      width: 75%;
      height: 30px; /*no*/
      line-height: 30px; /*no*/
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      font-weight: 400;
      vertical-align: baseline;
      flex: 1;
      background: #d44439;
      color: #fff;
      font-size: 14px; /*no*/
      border: none;
      float: left;
      outline: medium;
      &::placeholder {
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }
  .search-hots {
    margin: 0 25px;
    .title {
      padding: 15px 5px 0; /*no*/
      height: 30px; /*no*/
      line-height: 30px; /*no*/
      font-size: 12px; /*no*/
      color: #757575;
    }
    span {
      display: inline-block;
      padding: 3px 5px; /*no*/
      margin: 4px; /*no*/
      border: 0.8px solid #c7c7c7;
      border-radius: 5px; /*no*/
      line-height: 20px; /*no*/
      color: #2e3030;
      font-size: 14px; /*no*/
    }
  }
  .search-history {
    position: relative;
    margin: 10px 25px; /*no*/
    .title {
      display: flex;
      -ms-flex-align: center;
      align-items: center;
      height: 30px; /*no*/
      font-size: 12px; /*no*/
      color: #757575;
      .text {
        flex: 1;
      }
      .clear {
        position: relative;
        .icon-clear {
          font-size: 14px; /*no*/
          color: #2e3030;
          &:before {
            content: $icon-delete;
          }
        }
      }
    }
    .search-item {
      display: flex;
      -ms-flex-align: center;
      align-items: center;
      height: 35px; /*no*/
      overflow: hidden;
      font-size: 14px; /*no*/
      .text {
        flex: 1;
        color: #2e3030;
      }
      .icon {
        position: relative;
        .icon-delete {
          font-size: 11px; /*no*/
          color: #2e3030;
          &:before {
            content: $icon-cha1;
          }
        }
      }
    }
  }
}
</style>
