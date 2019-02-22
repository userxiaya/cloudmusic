<template>
  <div class="singer" ref="singer" :style="currentSong.id?{bottom:'60px'}:{}">
    <list-view :data="this.singers" @select="selectSinger" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import ListView from '@/components/listview'
import {getSingers} from '@/base/api'
import {mapGetters} from 'vuex'
class Singer {
  constructor ({id, name, image, aliaName}) {
    this.id = id
    this.name = name
    this.image = image.replace(/.jpg|.jpeg|.png|.gif|.bmp/g, '.webp?imageView&thumbnail=360y360&quality=75&tostatic=0&type=webp')
    this.aliaName = aliaName
  }
}
const pinyin = require('pinyin')
const HOT_NAME = '热门'
const HOT_SINGERS = 10
export default {
  data () {
    return {
      singers: []
    }
  },
  created () {
    this._getSingers()
  },
  methods: {
    selectSinger (singer) {
      this.$router.push({name: 'singerDetail', params: {id: singer.id, image: singer.image, title: singer.name}})
    },
    _getSingers () {
      getSingers().then((res) => {
        let s = res.data.artists
        s.map((item) => {
          let py = pinyin(item.name[0], {
            style: pinyin.STYLE_FIRST_LETTER
          })
          item.initial = py[0][0].toUpperCase()
        })
        this.singers = this._normalizeSinger(s)
      })
    },
    _normalizeSinger (list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGERS) {
          map.hot.items.push(new Singer({
            id: item.id,
            name: item.name,
            image: item.img1v1Url,
            aliaName: item.alias.join(' / ')
          }))
        }
        const key = item.initial
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.id,
          name: item.name,
          image: item.img1v1Url,
          aliaName: item.alias[0]
        }))
      })
      let hot = []
      let ret = []
      for (const key in map) {
        let val = map[key]
        if (val.title.match(/[A-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    }
  },
  components: {
    ListView
  },
  computed: {
    ...mapGetters(['currentSong'])
  },
  watch: {
    'currentSong.id' (val) {
      if (val) {
        this.$refs.singer.style.bottom = '60px'
        this.$refs.list.refresh()
      }
    }
  },
  activated () {
    this.$parent.history = 'singer'
  },
  mounted () {
    // let self = this
    // const nt = this.$refs.singer.offsetTop
    // if (window.plus) {
    //   const height = window.plus.navigator.getStatusbarHeight()
    //   self.$refs.singer.style.top = `${nt + height}px`
    //   self.$refs.list.refresh()
    // } else {
    //   document.addEventListener('plusready', function () {
    //     const height = window.plus.navigator.getStatusbarHeight()
    //     self.$refs.singer.style.top = `${nt + height}px`
    //     self.$refs.list.refresh()
    //   }, false)
    // }
  }
}
</script>

<style lang="scss" scoped>
 .singer {
    position: fixed;
    top: 0px;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
 }
</style>
