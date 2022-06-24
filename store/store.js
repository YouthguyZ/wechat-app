// 导入vue
import Vue from 'vue'
import vuex from 'vuex'

import cartModule from './cart.js'
// 注册使用
Vue.use(vuex)

// 创建 store
const store = new vuex.Store({
	state: {
		msg: '嘎嘎好用'
	},
	modules: {
		'cart': cartModule
	}
})
export default store
