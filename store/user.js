export default {
	namespaced: true,
	state: {
		address: uni.getStorageSync('address') || null,
		userProfile: uni.getStorageSync('userProfile') || {
			avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
			nickName: '微信用户'
		},
		token: uni.getStorageSync('token') || ''
	},
	getters: {
		// userInfo(state) {
		// 	return state.userProfile.userInfo
		// }
		// 看这里是新增加的
		fullAddress(state) {
			if (!state.address) return '';
			const {
				provinceName,
				cityName,
				countyName,
				detailInfo
			} = state.address;
			// 拼凑完整的地址
			return provinceName + cityName + countyName + detailInfo;
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
		},
		// 记录获取到的 token
		saveToken(state, token) {
			state.token = token;
			// 存入本地
			uni.setStorageSync('token', token);
		}
	},
	actions: {
		async getToken() {
			// console.log('App Launch')
			// 获取用户登录code
			const [err, {
				code
			}] = await uni.login();
			console.log(code);
			// 获取用户信息
			const [err1, {
				encryptedData,
				rawData,
				iv,
				signature
			}] = await uni.getUserInfo();
			console.log(userInfo);

			// 登陆换取 token
			const {
				data: res
			} = await uni.$http.post('/api/public/v1/users/wxlogin', {
				code,
				rawData,
				signature,
				iv,
				encryptedData
			})
			console.log(res);

			// 存储 token
			if (res.message.token) this.commit('user/saveToken', res.message.token);
		}
	},
}
