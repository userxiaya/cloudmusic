<template>
    <swipe :auto="4000">
       <SwipeItem  v-for="(slide,index) in list" :key="index">
           <img :src="slide.image" width="100%" height="auto" ref="slideImage" />
       </SwipeItem>
    </swipe>
</template>

<script>
import { Swipe, SwipeItem } from 'mint-ui'
export default {
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  components: {
    Swipe,
    SwipeItem
  },
  mounted () {
    if (this.$refs.slideImage && this.$refs.slideImage[0]) {
      this.$emit('height', `${this.$refs.slideImage[0].clientHeight}px`)
    }
  },
  watch: {
    list (val) {
      if (this.$refs.slideImage && this.$refs.slideImage[0]) {
        this.$emit('height', `${this.$refs.slideImage[0].clientHeight}px`)
      }
    }
  }
}
</script>

<style scoped>

</style>
