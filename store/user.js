export default {
	namespaced: true,
	state: {
		address: uni.getStorageSync('address') || null,
		userProfile: uni.getStorageSync('userProfile') || {},
	},
	getters: {
		userInfo(state) {
			return state.userProfile.userInfo
		}
	},
	mutations: {
		// 获取地址
		getAddress(state, address) {
			// 更新收获地址
			state.address = address
			uni.setStorageSync('address', address)
		},
		// 获取个人信息
		getProfile(state, userProfile) {
			state.userProfile = userProfile
			uni.setStorageSync('userProfile', userProfile)
		}
	}
}
