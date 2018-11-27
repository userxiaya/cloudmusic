<template>
    <div style="width:100%; height:100%">
        <scroll class="scroll">
            <div style="width:100%; height:auto;">
                rank
            </div>
        </scroll>
    </div>
</template>

<script>
import scroll from '@/components/scroll'
export default {
  components: {
    scroll
  },
  activated () {
    this.$parent.history = 'rank'
  }
}
</script>

<style scoped lang="scss">
.scroll {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
