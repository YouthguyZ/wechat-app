<template>
	<view class="wrapper">
		<!-- 商品图片 -->
		<swiper class="pics" indicator-dots indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#fff">
			<swiper-item v-for="item in goodsDetail.pics"><image :src="item.pics_sma_url"></image></swiper-item>
		</swiper>
		<!-- 基本信息 -->
		<view class="meta">
			<view class="price">￥{{ goodsDetail.goods_price }}</view>
			<view class="name">{{ goodsDetail.goods_name }}</view>
			<view class="shipment">快递: 免运费</view>
			<text class="collect icon-star">收藏</text>
		</view>
		<van-button type="primary">{{ carts.goods_count }}</van-button>
		<!-- 商品详情 -->
		<view class="detail">
			<!-- 富文本 -->
			<!-- <rich-text>iiii</rich-text> -->
			<!-- 用V-html 渲染进来 -->
			<view v-html="goodsDetail.goods_introduce"></view>
		</view>
		<!-- 操作 -->
		<view class="action">
			<button open-type="contact" class="icon-handset">联系客服</button>
			<text class="cart icon-cart" @click="goCart">购物车{{ cartCount }}</text>
			<text class="add" @click="addToCart">加入购物车</text>
			<text class="buy" @click="createOrder">立即购买</text>
		</view>
	</view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
	computed: {
		...mapState('cart', ['carts']),
		...mapGetters('cart', ['cartCount'])
	},
	data() {
		return {
			goods_id: null,
			goodsDetail: []
		};
	},
	// 加载时
	onLoad(params) {
		this.goods_id = params.id;
		// 调用
		this.getGoodsDetail();
	},
	methods: {
		goCart() {
			uni.switchTab({
				url: '/pages/cart/index'
			});
		},
		createOrder() {
			uni.navigateTo({
				url: '/subpkg/pages/order/index'
			});
		},
		// 获取商品详情列表
		async getGoodsDetail() {
			const { data: res } = await uni.$http.get('/api/public/v1/goods/detail', {
				// 传递参数
				goods_id: this.goods_id
			});
			console.log(res);
			if (res.meta.status !== 200)
				uni.showToast({
					title: '获取失败',
					icon: 'none'
				});
			this.goodsDetail = res.message;
		},

		// 添加购物车
		addToCart() {
			console.log('准备添加购物车...');
			// 购物车中商口所要展示的信息
			const goods = {
				goods_id: this.goodsDetail.goods_id, // 商品id
				goods_name: this.goodsDetail.goods_name, // 商品名称
				goods_price: this.goodsDetail.goods_price, // 商品价格
				goods_small_logo: this.goodsDetail.goods_small_logo, // 商品图片
				goods_count: 1, // 购买数量
				goods_state: true // 商品选中状态
			};
			// 将数据传给 mutations
			this.$store.commit('cart/addToCart', goods);
		}
	}
};
</script>

<style scoped lang="scss">
.wrapper {
	margin-bottom: 100rpx;
	background-color: #f4f4f4;
}

.pics {
	height: 640rpx;
}

.meta {
	height: 250rpx;
	line-height: 1;
	padding: 30rpx 180rpx 30rpx 20rpx;
	box-sizing: border-box;
	background-color: #fff;
	position: relative;

	.price {
		font-size: 36rpx;
		color: #ea4451;
		margin-bottom: 20rpx;
	}

	.name {
		color: #333;
		line-height: 1.4;
		font-size: 33rpx;

		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.shipment {
		font-size: 27rpx;
		color: #999;
		position: absolute;
		bottom: 30rpx;
	}

	.collect {
		width: 140rpx;
		height: 88rpx;
		text-align: center;
		box-sizing: border-box;
		border-left: 1rpx solid #ddd;
		font-size: 24rpx;
		color: #999;

		position: absolute;
		right: 10rpx;
		top: 91rpx;
	}

	[class*='icon-']::before {
		display: block;
		font-size: 45rpx;
		margin-bottom: 10rpx;
	}
}

.detail image {
	width: 100%;
	height: 480rpx;
	margin-top: 20rpx;
}

.action {
	width: 100%;
	height: 98rpx;
	background-color: #fff;

	position: fixed;
	left: 0;
	bottom: 0;

	display: flex;
	align-items: center;

	text {
		display: block;
	}

	.add,
	.buy {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 210rpx;
		text-align: center;
		font-size: 27rpx;
		color: #fff;
	}

	.add {
		background-color: #f4b73f;
	}

	.buy {
		background-color: #ea4451;
	}

	button {
		padding: 0;
		border-radius: 0;
		background-color: #fff;

		&::after {
			border: none;
		}
	}

	button,
	.cart {
		flex: 1;
		text-align: center;
		color: #989898;
		font-size: 24rpx;
		box-sizing: border-box;
	}

	[class*='icon']::before {
		display: block;
		font-size: 45rpx;
		margin-bottom: 2rpx;
	}
}
</style>
