<template>
    <div style="width:100%; height:100%">
        <scroll class="scroll" :data="topList">
            <div class="topList" :style="currentSong.id?{height:'auto','padding-bottom':'60px'}:{height:'auto','padding-bottom':'0px'}">
              <li class="item" v-for="item in topList" :key="item.id" @click.stop="goToDetail(item)">
                <div class="icon">
                  <img width="100" height="100" v-lazy="item.image">
                  <div class="update-text">{{item.updateFrequency}}</div>
                </div>
                <ul class="songlist">
                  <li class="song" v-for="(str, index) in item.detail" :key="index+'_'+item.id">
                    <span>{{index+1}}.</span>
                    <span>{{str}}</span>
                  </li>
                </ul>
              </li>
            </div>
        </scroll>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import scroll from '@/components/scroll'
import {toplistDetail} from '@/base/api'
import {createSongDetail} from '@/base/songTop'
export default {
  data () {
    return {
      topList: [],
      bottom: 60
    }
  },
  components: {
    scroll
  },
  activated () {
    this.$parent.history = 'rank'
  },
  methods: {
    getTopList () {
      toplistDetail().then((res) => {
        const data = (res.status + '' === '200' && res.data && res.data.code + '' === '200') ? res.data : null
        let list = data ? data.list || [] : []
        let list1 = list.filter(function (e) {
          const type = typeof (e.ToplistType)
          return type === 'string'
        })
        list1 = list1.map(item => {
          return createSongDetail(item)
        })
        this.topList = list1
      })
    },
    goToDetail (li) {
      this.$router.push({name: 'songDetail', params: {id: li.id, image: li.image, title: li.name, playCount: li.playCount, trackCount: li.trackCount}})
    }
  },
  computed: {
    ...mapGetters(['currentSong'])
  },
  mounted () {
    this.getTopList()
  }
}
</script>

<style scoped lang="scss">
ul {
  margin: 0;
  border: 0;
  font-size: 100%;
  font-weight: 400;
  vertical-align: baseline;
}
li {
  list-style: none;
}
.scroll {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.topList {
  width:100%;
  height:auto;
  padding-top: 8px;
  .item {
    display: flex;
    margin: 0 10px;/*no*/
    padding: 3px 0;/*no*/
    height: 100px;/*no*/
    border-bottom: 1px solid #e4e4e4;/*no*/
    .icon {
      position: relative;
      .update-text {
        position: absolute;
        width: 100%;
        height: 20px;
        bottom: 5px;
        left: 0px;
        line-height: 20px;
        font-size: 14px;
        padding-left: 10px;
        color: #ffffff;
      }
    }
    img {
      border-radius: 3px;
    }
    .songlist {
      flex: 1;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-direction: column;
      flex-direction: column;
      -ms-flex-pack: center;
      justify-content: center;
      padding: 0 24px;
      height: 100%;
      overflow: hidden;
      color: #2e3030;
      font-size: 16px;
      .song {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        line-height: 30px;
      }
    }
  }
}
</style>
