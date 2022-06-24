// 导入vue
import Vue from 'vue'
import vuex from 'vuex'

import cartModule from './cart.js'
import userModule from './user'
// 注册使用
Vue.use(vuex)

// 创建 store
const store = new vuex.Store({
	state: {
		msg: '嘎嘎好用'
	},
	modules: {
		'cart': cartModule,
		'user': userModule
	}
})
export default store
