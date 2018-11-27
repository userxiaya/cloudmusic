// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'lib-flexible'
import VueLazyLoad from 'vue-lazyload'
import store from '@/store'
import VueBus from 'vue-bus'
import 'mint-ui/lib/style.css'
import { Toast } from 'mint-ui'
import FastClick from 'fastclick'
import { loginRefresh } from '@/base/api'
Vue.use(VueBus)
Vue.config.productionTip = false
Vue.use(VueLazyLoad, {
  error: './static/default.png',
  loading: './static/default.png'
})
var mixin = {
  methods: {
    toast (message) {
      Toast(message)
    }
  },
  filters: {
    playCount (count) {
      count = `${parseInt(count)}`
      if (count > 100000) {
        return `${count.substring(0, count.length - 4)}万`
      } else {
        return count
      }
    }
  }
}
Vue.mixin(mixin)
Vue.directive('immersed1', {
  inserted (el) {
    if (window.plus) {
      const top = window.plus.navigator.getStatusbarHeight()
      const height = el.clientHeight
      el.style['padding-top'] = `${top}PX`
      el.style['height'] = `${(height + top)}px`
    } else {
      document.addEventListener('plusready', function () {
        const top = window.plus.navigator.getStatusbarHeight()
        const height = el.clientHeight
        el.style['padding-top'] = `${top}PX`
        el.style['height'] = `${(height + top)}px`
      }, false)
    }
  }
})
Vue.directive('immersed2', {
  inserted (el) {
    if (window.plus) {
      const top = window.plus.navigator.getStatusbarHeight()
      el.style['top'] = `${(top)}px`
    } else {
      document.addEventListener('plusready', function () {
        const top = window.plus.navigator.getStatusbarHeight()
        el.style['top'] = `${(top)}px`
      })
    }
  }
})
Vue.directive('immersed', {
  inserted (el) {
    if (window.plus) {
      const height = window.plus.navigator.getStatusbarHeight()
      el.style['padding-top'] = `${height}PX`
    } else {
      document.addEventListener('plusready', function () {
        const height = window.plus.navigator.getStatusbarHeight()
        el.style['padding-top'] = `${height}PX`
      }, false)
    }
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>',
  mounted () {
    FastClick.attach(document.body)
    const musicList = window.localStorage.getItem('musicList') || '[]'
    const currentIndex = window.localStorage.getItem('currentIndex') || ''
    const searchHistory = window.localStorage.getItem('searchHistory') || '[]'
    const historyList = window.localStorage.getItem('historyList') || '[]'
    const playMode = window.localStorage.getItem('playMode') || ''
    if (playMode) {
      store.state.playMode = parseInt(playMode)
    }
    store.commit('SETHISTORY', JSON.parse(historyList))
    loginRefresh().then(res => {
      if (res.data && (res.data.code + '' === '200' || res.data.code + '' === '400')) {
        store.state.loginState = true
        store.state.checkLogin = true
      } else {
        store.state.checkLogin = true
      }
    }).catch(e => {
      store.state.loginState = false
      store.state.checkLogin = true
    })
    setTimeout(() => {
      store.commit('SET_MUSICLIST', JSON.parse(musicList))
      store.commit('SET_CURRENTINDEX', parseInt(currentIndex))
      store.commit('SET_SEARCHHISTORY', JSON.parse(searchHistory))
    }, 200)
  }
})
