import Vue from 'vue'
import App from './App'

// 封装的网络请求
import 'utils/http.js'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
