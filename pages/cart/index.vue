<template>
	<view class="wrapper">
		<!-- 判断是否有购物车数据 -->
		<template v-if="carts.length">
			<!-- 收货信息 -->
			<view class="shipment">
				<template v-if="address">
					<view class="dt">收货人:</view>
					<view class="dd meta">
						<text class="name">{{ address.userName }}</text>
						<text class="phone">{{ address.telNumber }}</text>
					</view>
					<view class="dt">收货地址:</view>
					<view class="dd">
						{{ address.provinceName }} {{ address.cityName }} {{ address.countyName }}
						{{ address.detailInfo }}
					</view>
				</template>
				<button v-else type="primary" @click="getAddress">获取用户地址</button>
			</view>
			<!-- 购物车 -->
			<view class="carts">
				<view class="item">
					<!-- 店铺名称 -->
					<view class="shopname">优购生活馆</view>
					<view class="goods" v-for="(item, index) in carts" :key="item.goods_id">
						<!-- 商品图片 -->
						<image class="pic" :src="item.goods_small_logo"></image>
						<!-- 商品信息 -->
						<view class="meta">
							<view class="name">{{ item.goods_name }}</view>
							<view class="price">
								<text>￥</text>
								{{ item.goods_price }}
								<text>.00</text>
							</view>
							<!-- 加减 -->
							<view class="amount">
								<text class="reduce" @click="subCount(index)">-</text>
								<input type="number" :value="item.goods_number" class="number" />
								<text class="plus" @click="addCount(index)">+</text>
							</view>
						</view>
						<!-- 选框 -->
						<view class="checkbox" @click="toggleState(index)">
							<icon type="success" size="20" :color="item.goods_state ? '#ea4451' : '#ccc'"></icon>
						</view>
					</view>
				</view>
			</view>
			<!-- 其它 -->
			<view class="extra">
				<label class="checkall" @click="toggleAll">
					<icon type="success" :color="allChecked ? '#ea4451' : '#ccc'" size="20"></icon>
					全选
				</label>
				<view class="total">
					合计:
					<text>￥</text>
					<label>{{ amount }}</label>
					<text>.00</text>
				</view>
				<view class="pay" @click="goPaymen">结算({{ checkedCount }})</view>
			</view>
		</template>
		<view v-else class="tips">
			这里空空如也~
			<button style="margin-top: 10px;width: 150px;" type="primary" @click="shopping">去买点啥吧~</button>
		</view>
	</view>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
export default {
	data() {
		return {
			order_number: ''
		};
	},
	computed: {
		...mapState('user', ['address']),
		...mapState('cart', ['carts']),
		...mapGetters('cart', ['allChecked', 'checkedCount', 'amount']),
		...mapGetters('user', ['fullAddress']),
		goods() {
			return this.carts.filter(item => item.goods_state);
		}
	},
	methods: {
		// 跳转去购物
		shopping() {
			uni.switchTab({
				url: '/pages/category/index'
			});
		},
		// 切换选中状态
		toggleState(index) {
			// 调用 mutations 修改状态
			this.$store.commit('cart/toggleState', index);
		},
		toggleAll() {
			// 调用 mutations 变更商品选中状态
			this.$store.commit('cart/toggleAll', this.allChecked);
		},
		// 减少数量
		subCount(index) {
			this.$store.commit('cart/subCount', index);
		},
		// 增加数量
		addCount(index) {
			this.$store.commit('cart/addCount', index);
		},
		// 获取用户地址
		async getAddress() {
			// 用条件编译方法 ifndef 为判断 不在这个微信环境运行时 结束时加一个 endif
			// #ifndef MP-WEIXIN
			uni.showToast({
				title: '仅在小程序有效!'
			});
			// #endif

			// #ifdef MP-WEIXIN
			// 获取用户的收货地址
			const [err, { errMsg, ...address }] = await uni.chooseAddress();
			console.log(address);
			// 调用 mutations 将地址存到 vuex 和 本地存储
			this.$store.commit('user/getAddress', address);
			// #endif
		},
		// 支付
		async goPaymen() {
			await this.createOrder();
			// 检测订单是否创建成功
			if (!this.order_number) {
				return uni.showToast({
					title: '订单创建失败!',
					icon: 'none'
				});
			}

			const { data: res } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {
				order_number: this.order_number
			});
			console.log(res);
			// 打开支付窗口 小程序支付 api
			uni.requestPayment({
				...res.message.pay,
				complete() {
					uni.navigateTo({
						url: '/subpkg/pages/order/index'
					});
				}
			});
		},
		// 创建订单
		async createOrder() {
			// 校验本地是否有商品
			if (this.goods.length === 0) {
				return uni.showToast({
					title: '没有多余商品',
					icon: 'none'
				});
			}
			// 校验地址是否有
			if (!this.fullAddress)
				uni.showToast({
					title: '无地址',
					icon: 'none'
				});
			// 调用接口生成新订单
			const { data: res } = await uni.$http.post('/api/public/v1/my/orders/create', {
				order_price: this.amount,
				consignee_addr: this.fullAddress,
				goods: this.goods
			});
			// 验证是否创建订单成功
			if (res.meta.status === 200) this.order_number = res.message.order_number;
		}
	}
};
</script>

<style scoped lang="scss">
.shipment {
	height: 100rpx;
	line-height: 2;
	padding: 30rpx 30rpx 40rpx 30rpx;
	font-size: 27rpx;
	color: #333;
	background-color: #fff;
	background-image: url(http://static.botue.com/ugo/images/cart_border%402x.png);
	background-size: contain;
	background-repeat: no-repeat;
	background-position: bottom;

	.dt {
		width: 140rpx;
		float: left;
		clear: both;
	}

	.dd {
		padding-left: 160rpx;
	}

	.meta {
		padding-right: 50rpx;
	}

	text.phone {
		float: right;
	}
}

.carts {
	background-color: #f4f4f4;
	padding-bottom: 110rpx;
	overflow: hidden;

	.shopname {
		padding: 30rpx;
		margin-top: 20rpx;
		font-size: 30rpx;
		color: #333;
		background-color: #fff;
		border-top: 1rpx solid #eee;
		border-bottom: 1rpx solid #eee;
	}

	.goods {
		display: flex;
		padding: 30rpx 20rpx 30rpx 0;
		margin-left: 105rpx;
		border-bottom: 1rpx solid #eee;
		background-color: #fff;

		position: relative;

		.checkbox {
			width: 101rpx;
			height: 100%;
			background-color: #fff;

			display: flex;
			justify-content: center;
			align-items: center;

			position: absolute;
			left: -100rpx;
			top: 0;
		}

		&:last-child {
			border-bottom: none;
		}

		.pic {
			width: 200rpx;
			height: 200rpx;
			margin-right: 30rpx;
		}

		.meta {
			flex: 1;
			font-size: 27rpx;
			color: #333;
			position: relative;
		}

		.name {
			width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}

		.price {
			position: absolute;
			bottom: 0;

			color: #ea4451;
			font-size: 33rpx;

			text {
				font-size: 22rpx;
			}
		}

		.amount {
			position: absolute;
			bottom: 0;
			right: 20rpx;

			height: 48rpx;
			text-align: center;
			border: 1rpx solid #ddd;
			border-radius: 8rpx;

			display: flex;
			align-items: center;

			text {
				display: block;
				width: 60rpx;
				line-height: 48rpx;
				font-size: 36rpx;
				color: #ddd;
				text-align: center;
			}

			input {
				width: 60rpx;
				height: 48rpx;
				min-height: 48rpx;
				font-size: 27rpx;
				border-left: 1rpx solid #ddd;
				border-right: 1rpx solid #ddd;
			}
		}
	}
}

.extra {
	position: fixed;
	bottom: 0;
	/* #ifdef H5 */
	bottom: 50px;
	/* #endif */
	left: 0;
	z-index: 9;

	width: 750rpx;
	height: 96rpx;
	text-align: center;
	line-height: 96rpx;
	font-size: 36rpx;
	border-top: 1rpx solid #eee;
	background-color: #fff;
	color: #333;
	display: flex;

	.checkall {
		width: 140rpx;
		line-height: 1;
		margin-left: 25rpx;
		display: flex;
		align-items: center;

		icon {
			margin-right: 20rpx;
		}
	}

	.total {
		display: flex;
		justify-content: center;
		flex: 1;

		label,
		text {
			color: #ea4451;
			vertical-align: bottom;
			position: relative;
			bottom: -2rpx;
		}

		text {
			position: relative;
			bottom: -3rpx;
			font-size: 24rpx;

			&:first-child {
				margin-left: 10rpx;
			}
		}
	}

	.pay {
		width: 200rpx;
		background-color: #ea4451;
		color: #fff;
	}
}
</style>
