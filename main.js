import Vue from 'vue'
import App from './App'

// 封装的网络请求
import 'utils/http.js'

// 导入 store
import store from 'store/store.js'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	// 注入
	store,
	...App
})
app.$mount()
