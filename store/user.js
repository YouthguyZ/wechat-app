export default {
	namespaced: true,
	state: {
		address: uni.getStorageSync('address') || null
	},
	mutations: {
		// 获取地址
		getAddress(state, address) {
			// 更新收获地址
			state.address = address
			uni.setStorageSync('address', address)
		}
	}
}
