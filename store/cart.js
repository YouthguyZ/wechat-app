export default {
	namespaced: true,
	state: {
		// 有数据就获取
		carts: uni.getStorageSync('carts') || []
	},
	getters: {
		cartCount(state) {
			// 数量累加
			return state.carts.length
		},
		allChecked(state) {
			return state.carts.every(item => item.goods_state)
		},
		checkedCount(state) {
			return state.carts.reduce((count, item) => {
				// 如果商品状态未选中不参与统计
				if (!item.goods_state) return count;
				// 累加每个商品的购买数量
				return count += item.goods_count;
			}, 0)
		},
		// 金额
		amount(state) {
			return state.carts.reduce((amount, item) => {
				// 如果商品非选中的则不参与计算
				if (!item.goods_state) return amount;
				// 金额 = 单价 * 数量
				return amount += item.goods_count * item.goods_price;
			}, 0)
		}
	},
	mutations: {
		addToCart(state, goods) {
			// goods 就是即将添加到购物车中的商品
			console.log('获取到了商品数据', goods);
			// 查找是否已经存在相同商品
			const result = state.carts.find(item => item.goods_id === goods.goods_id);
			// 没有存在相同商品
			if (!result) {
				state.carts.push(goods);
			} else {
				// 存在相同商品时，将数量加 1
				result.goods_count += 1
			}
			// 存储
			this.commit('cart/saveStorage')
		},
		// 切换选中状态
		toggleState(state, index) {
			// 来回切换
			state.carts[index].goods_state = !state.carts[index].goods_state;
			// 本地存储也要更新
			this.commit('cart/saveStorage');
		},
		toggleAll(state, goods_state) {
			// 遍历数据改变每个商口的状态
			state.carts.forEach(item => {
				item.goods_state = !goods_state;
			})

			// 存入本地
			this.commit('cart/saveStorage');
		},
		addCount(state, index) {
			// 商品购买数量加 1
			state.carts[index].goods_count += 1,
				// 本地存储也要更新
				this.commit('cart/saveStorage');
		},
		subCount(state, index) {
			// 最少购买 1 件
			if (state.carts[index].goods_count <= 1) return;
			// 商品购买数量减 1
			state.carts[index].goods_count -= 1,
				// 本地存储也要更新
				this.commit('cart/saveStorage');
		},
		// 本地存储
		saveStorage(state) {
			uni.setStorageSync('carts', state.carts)
		}
	}
}
