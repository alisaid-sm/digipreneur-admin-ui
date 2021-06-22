import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
import jwt from 'jsonwebtoken'
import config from './config'
import axios from 'axios'
// import Mock from './mock'
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

//NProgress.configure({ showSpinner: false });

axios.defaults.headers = {
  token: localStorage.getItem('token')
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const isLogin = (token) => {
  if (token !== null && token !== 'undefined') {
    let verify
    jwt.verify(token, config.JWT_KEY, (err, result) => {
      if (err || result.role !== 'admin') {
        verify = false
      } else {
        verify = true
      }
    })
    return verify
  } else {
    return false
  }
}

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (isLogin(localStorage.getItem('token'))) {
      next()
    } else {
      next({
        path: '/login'
      })
    }
  } else {
    if (!isLogin(localStorage.getItem('token'))) {
      next()
    } else {
      next({
        path: '/'
      })
    }
  }
})

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

