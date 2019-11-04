// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'
import Requests from './api/index.js'
import { ACCESS_TOKEN, LB_LOGIN_USERINFO } from '@/store/mutation-types'

Vue.prototype.$api = Requests
Vue.prototype.$utils = {
  uuid() {
    const S4 = () => ((((1+Math.random())*0x10000)|0).toString(16).substring(1))
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }
}

// mock
import './mock'

import bootstrap from './core/bootstrap'
import './core/use'
import './permission' // permission control
import './utils/filter' // global filter

Vue.config.productionTip = false

// mount axios Vue.$http and this.$http
Vue.use(VueAxios)

new Vue({
  router,
  store,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')