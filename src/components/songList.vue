<template>
  <div class="song-list">
   <ul>
     <li v-for="(song, index) in songs" :key="song.id" class="item" @click.stop="selectItem(song, index)">
       <p class="count">{{index + 1}}</p>
       <div class="content">
         <h2 class="name">{{song.name}}</h2>
         <p class="desc">{{getDesc(song)}}</p>
       </div>
     </li>
   </ul>
  </div>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array
    }
  },
  computed: {},
  methods: {
    selectItem (item, index) {
      this.$emit('select', item, index)
    },
    getDesc (song) {
      if (song.aliaName) {
        return `${song.singer} - ${song.aliaName}`
      } else {
        return `${song.singer}`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/common/scss/index.scss";
h2,
p,
ul {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font-weight: 400;
  vertical-align: baseline;
}
.song-list {
  ul {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font-weight: 400;
    vertical-align: baseline;
  }
  .item {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 70px;
    border-bottom: 1px solid rgb(228, 228, 228);
    .count {
      flex: 0 0 50px;
      width: 50px;
      text-align: center;
      color: $color-text-g;
    }
    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        margin-top: 4px;
        width: 80%;
        @include no-wrap();
        color: $color-text;
        font-size: 18px;
      }
      .desc {
        @include no-wrap();
        margin-top: 4px;
        width: 80%;
        color: $color-text-g;
        font-size: 12px;
      }
    }
  }
}
</style>
