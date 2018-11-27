import Vue from 'vue'
import Router from 'vue-router'
// const playBox = () => import('@/pages/playBox')
const phoneLogin = () => import('@/pages/phoneLogin')
const views = () => import('@/pages/viewsPage')
const viewIndex = () => import('@/pages/views/index')
const recommend = () => import('@/pages/views/recommend')
const myMessage = () => import('@/pages/views/myMessage')
const search = () => import('@/pages/views/search')
const songDetail = () => import('@/pages/songDetail')
const singerDetail = () => import('@/pages/singerDetail')
Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/recommend' },
    {
      path: '/phoneLogin',
      name: 'phoneLogin',
      component: phoneLogin
    },
    // {
    //   path: '/playBox',
    //   name: 'playBox',
    //   component: playBox
    // },
    {
      path: '/views',
      name: 'views',
      component: views,
      children: [
        {
          path: '/songDetail',
          name: 'songDetail',
          component: songDetail,
          meta: {
            index: 3
          }
        },
        {
          path: '/singerDetail',
          name: 'singerDetail',
          component: singerDetail,
          meta: {
            index: 3
          }
        },
        {
          path: '/view/index',
          name: 'viewIndex',
          component: viewIndex,
          meta: {
            index: 1
          },
          children: [
            {
              path: '/recommend',
              name: 'recommend',
              component: recommend,
              meta: {
                parentIndex: 1
              }
            },
            {
              path: '/myMessage',
              component: myMessage,
              name: 'myMessage',
              meta: {
                parentIndex: 1
              }
            }
          ]
        },
        {
          path: '/search',
          name: 'search',
          component: search,
          meta: {
            index: 2
          }
        }
      ]
    }
  ]
})
