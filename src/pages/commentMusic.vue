<template>
  <div class="main">
    <div class="songDetail">
      <img
        class="image"
        src="http://p2.music.126.net/-I0jlrPXHaOb0JYEvRYLyw==/109951163746827642.webp?imageView&thumbnail=360y360&quality=75&tostatic=0&type=webp"
      />
      <div class="right">
        <div class="name">うまるん体操</div>
        <div class="singer">田中あいみ/白石晴香/影山灯/古川由利奈</div>
        <div class="iconfont icon-right">
          <div class="icon"></div>
        </div>
      </div>
    </div>
    <div class="hot_comment">
      <h1 class="title">精彩评论</h1>
      <ul>
        <li class="item">
          <div class="user">
            <div class="left">
              <img
                class="image"
                src="http://p2.music.126.net/-I0jlrPXHaOb0JYEvRYLyw==/109951163746827642.webp?imageView&thumbnail=360y360&quality=75&tostatic=0&type=webp"
              />
              <div class="text">
                <div class="userName">user</div>
                <div class="time">2015/01/02</div>
              </div>
            </div>
            <div class="right">
              123645&nbsp;&nbsp;
              <img src="@/assets/good.png" />
            </div>
          </div>
          <div class="comment">
            sandjk,bfkjsdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddb
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      image: '',
      name: '',
      singer: '',
      artistNew: []
    }
  },
  mounted () {}
}
</script>

<style scoped lang="scss">
@import "@/common/scss/icon.scss";
@import "@/common/scss/index.scss";
.main {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #ffffff;
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
}
</style>
