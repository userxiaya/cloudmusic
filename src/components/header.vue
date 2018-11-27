<template>
    <div class="head" v-immersed1>
        <div style="height:100%; width:100%; position: relative; display: flex; align-items: center;">
            <div class="back iconfont" @click.stop="$router.go(-1)"></div>
            <div class="text">
              {{message}}
            </div>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default () {
        return ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/common/scss/icon.scss";
@import "@/common/scss/index.scss";
.head {
  width: 100%;
  height: 50px;
  background: $color-theme;
  position: absolute;
  box-sizing: border-box;
  color: #fff;
  top:0px;
  .back {
    &:before {
      content: $icon-back;
    }
    position: absolute;
    height: 34px;
    font-size: 34px;
    left: 6px;
  }
  .text {
    position: absolute;
    height:50px;
    line-height: 50px;
    font-size: 18px;
    left: 48px;
  }
}
</style>
