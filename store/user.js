export default {
	namespaced: true,
	state: {
		address: uni.getStorageSync('address') || null,
		userProfile: uni.getStorageSync('userProfile') || {
			avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
			nickName: '微信用户'
		},
	},
	// getters: {
	// 	userInfo(state) {
	// 		return state.userProfile.userInfo
	// 	}
	// },
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
