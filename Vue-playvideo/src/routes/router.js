import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/playvideo.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'playvideo',
      component: Login
    },
    
  ]
})