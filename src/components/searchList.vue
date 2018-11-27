<template>
    <div class="search-result" :style="{'pointer-events':'auto'}">
        <div class="suggest">
            <div class="search-suggest" v-if="!searchShow && query && songs.length > 0">
                <p class="title">最佳匹配</p>
                <div class="search-suggest-item"  @click.stop="singerDetail(suggest.artists[0])" v-if="suggest.artists&&suggest.artists[0]"><img v-lazy="suggest.artists[0].img1v1Url" :key="suggest.artists[0].img1v1Url" width="50" height="50"> <span>歌手：{{suggest.artists[0].name}}</span></div>
                <div class="search-suggest-item" @click.stop="songDetail(suggest.playlists[0])" v-if="suggest.playlists&&suggest.playlists[0]"><img v-lazy="suggest.playlists[0].coverImgUrl" :key="suggest.playlists[0].coverImgUrl" width="50" height="50">
                    <div class="text">
                        <p>歌单：{{suggest.playlists[0].name}}</p>
                        <p class="singer" v-if="suggest.albums&&suggest.albums[0]">{{suggest.albums[0].artist.name}}</p>
                    </div>
                </div>
            </div>
            <ul class="suggest-list">
                <li class="suggest-item" v-for="(item, index) in songs" :key="index" @click.stop="selectItem(item)">
                    <div class="icon"><i></i></div>
                    <div class="name">
                        <p class="song">{{item.name}}</p>
                        <p class="singer">{{item.singer}}</p>
                    </div>
                </li>
                <div class="loading">
                    <loading v-if="(songs.length>=limit||searching)&&haveMore && query"></loading>
                </div>
            </ul>
            <div class="no-result-wrapper" style="display: none;">
                抱歉，暂无搜索结果
            </div>
        </div>
    </div>
</template>

<script>
import loading from '@/components/loading'
import { getSearchSongs, getSearchSuggest } from '@/base/api'
import { createSearchSong } from '@/base/song'
export default {
  data () {
    return {
      songs: [],
      limit: 30,
      page: 1,
      suggest: {},
      haveMore: false,
      searchShow: true,
      searching: false
    }
  },
  props: {
    query: {
      type: String,
      default: ''
    }
  },
  components: {
    loading
  },
  mounted () {},
  watch: {
    query (val) {
      if (val === '') {
        this.suggest = {}
        this.songs = []
        this.haveMore = false
        return
      }
      this.suggest = {}
      this.songs = []
      this.searchShow = true
      this.page = 1
      this.haveMore = true
      this.search()
    }
  },
  methods: {
    search () {
      this.searchShow = false
      this.haveMore = true
      this.searching = true
      getSearchSongs(this.query, this.page)
        .then(res => {
          if (!res.data.result.songs) {
            this.haveMore = false
            return
          }
          let list = res.data.result.songs
          let ret = []
          list.forEach(item => {
            ret.push(createSearchSong(item))
          })
          this.songs = ret
          this.searching = false
        })
        .catch(e => {
          this.searching = false
        })
      this.page += this.limit
      getSearchSuggest(this.query).then(res => {
        this.suggest = res.data.result
      })
    },
    searchMore () {
      if (!this.haveMore) {
        return
      }
      if (!this.songs.length) {
        return
      }
      getSearchSongs(this.query, this.page).then(res => {
        let list = res.data.result.songs
        if (!res.data.result.songs) {
          this.haveMore = false
          return
        }
        let ret = []
        list.forEach(item => {
          ret.push(createSearchSong(item))
        })
        this.songs = this.songs.concat(ret)
        this.$emit('refresh')
        this.page += this.limit
      })
    },
    songDetail (item) {
      const param = {id: item.id, image: item.coverImgUrl, title: item.name, playCount: item.playCount, trackCount: item.trackCount}
      this.$emit('songDetail', param)
    },
    selectItem (item) {
      this.$emit('selectItem', item)
    },
    singerDetail (item) {
      const param = {id: item.id, image: item.img1v1Url, title: item.name}
      this.$emit('singerDetail', param)
    }
  }
}
</script>

<style scoped lang="less">
.search-result {
  position: relative;
  width: 100%;
  top: 10px;
  bottom: 0;
  .suggest {
    height: 100%;
    overflow: hidden;
    .search-suggest {
      .title {
        padding-left: 20px; /*no*/
        padding-bottom: 10px; /*no*/
        padding-top: 10px; /*no*/
        color: #d44439;
        font-size: 11px; /*no*/
      }
      .search-suggest-item {
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        padding: 8px 20px; /*no*/
        border-bottom: 1px solid #e4e4e4; /*no*/
        font-size: 14px; /*no*/
        img {
          flex: 0 0 50px; /*no*/
          padding-right: 15px; /*no*/
        }
        .text {
          width: 100%;
          p {
            padding: 3px 0; /*no*/
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .singer {
            font-size: 12px; /*no*/
            color: #2e3030;
          }
        }
      }
    }
    .suggest-list {
      padding-bottom: 30px; /*no*/
      .suggest-item {
        display: flex;
        padding: 3px 20px; /*no*/
        height: 50px; /*no*/
        -ms-flex-align: center;
        align-items: center;
        border-bottom: 1px solid #e4e4e4; /*no*/
        .name {
          flex: 1; /*no*/
          font-size: 14px; /*no*/
          color: #2e3030;
          overflow: hidden;
          p {
            padding: 3px 0; /*no*/
          }
          .song {
            font-size: 16px; /*no*/
            color: #2e3030;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .singer {
            font-size: 12px;
            color: #757575;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
div,
p,
span,
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
</style>
