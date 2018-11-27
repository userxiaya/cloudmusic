<template>
    <div class="container">
      <div class="header" v-immersed1>
          <div class="mine">
            <i class="iconfont icon-list"></i>
          </div>
          <div class="center">
            <div :class="$route.path==='/myMessage'?'item active':'item'" @click.stop="$router.replace('/myMessage')">
              <i class="iconfont icon-music"></i>
            </div>
          <div :class="$route.path.indexOf('/recommend')!=-1?'item active':'item'" @click.stop="gotoRecommend">
            <i class="iconfont icon-logo"></i>
          </div>
          <div class="item">
            <i class="iconfont icon-movie"></i>
          </div>
        </div>
        <div class="search"  @click.stop="$router.push('/search')"><i class="iconfont icon-search"></i></div>
      </div>
      <div class="content" v-immersed2>
        <div class="main">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </div>
      </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {}
  },
  mounted () {},
  computed: {
    ...mapGetters(['currentSong'])
  },
  methods: {
    gotoRecommend () {
      if (this.$route.path.indexOf('/recommend') === -1) {
        this.$router.replace('/recommend')
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/common/scss/icon.scss";
@import "@/common/scss/index.scss";
.container {
  height: 100%;
  position: relative;
}
.header {
  z-index: 100;
  box-sizing: border-box;
  margin: 0;
  width: 100%;
  height: 48px;
  // padding-top: 10px;
  box-sizing: border-box;
  background: $color-theme;
  position: relative;
  box-sizing: border-box;
  color: #f1f1f1;
  top: 0px;
  font-size: 22px;
  .mine {
    position: absolute;
    left: 0;
  }
  .search {
    position: absolute;
    right: 2px;
  }
  .center {
    display: flex;
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding-left: 90px;
    padding-right: 90px;
    .item {
      &.active {
        color: #ffffff;
      }
      flex: 1;
      text-align: center;
      color: #e4e4e4;
      i {
        display: block;
        padding: 8px;
        font-size: 30px;
      }
    }
  }
  .icon-list {
    color: #ffffff;
    display: block;
    padding: 11px;
    font-size: 26px;
    &:before {
      content: $icon-caidan;
    }
  }
  .icon-search {
    color: #ffffff;
    display: block;
    padding: 11px;
    font-size: 26px;
    &:before {
      content: $icon-search;
    }
  }

  .icon-music {
    &:before {
      content: $icon-music1;
    }
  }
  .icon-logo {
    &:before {
      content: $icon-music;
    }
  }
  .icon-movie {
    &:before {
      content: $icon-mv;
    }
  }
}
.content {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0px;
  left: 0px;
  padding-top:48px;
  box-sizing: border-box;
  .main {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }
}
</style>
