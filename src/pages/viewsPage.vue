<template>
  <div class="views">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    <minplayer :playerShow="playerShow"></minplayer>
  </div>
</template>

<script>
import minplayer from '@/components/minplayer'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      playerShow: false,
      slideName: ''
    }
  },
  components: {
    minplayer
  },
  computed: {
    ...mapGetters(['currentSong'])
  },
  methods: {
    setMinPlayer (flag) {
      this.playerShow = flag
    }
  },
  watch: {
    $route (to, from) {
    },
    'currentSong.id' (newVal, oldVal) {
      if (newVal && oldVal === '') {
        this.setMinPlayer(true)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.views {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
}
</style>
