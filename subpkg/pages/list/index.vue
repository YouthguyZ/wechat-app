<template>
	<view>
		<!-- 筛选 -->
		<view class="filter">
			<text class="active">综合</text>
			<text>销量</text>
			<text>价格</text>
		</view>
		<!-- 商品列表 -->
		<scroll-view class="goods" scroll-y @scrolltolower="getMore">
			<view class="item" v-for="item in goodsList" :key="item.goods_id" @click="goDetail(item.goods_id)">
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
				</view>
			</view>
			<!-- 没有数据 -->
			<view class="tips" v-if="!goodsList.length">{{ msg }}</view>
			<!-- 加载更多 -->
			<view class="getMore" v-if="haveMore">正在加载...</view>
		</scroll-view>
	</view>
</template>

<script>
// 导入防抖处理
import { debounce } from 'lodash';
export default {
	data() {
		return {
			// ...s
			query: '',
			goodsList: [],
			msg: '',
			nextPage: 1,
			haveMore: true
		};
	},
	// 在生命周期 onLoad 中获取地址中的参数
	onLoad(params) {
		this.query = params.query;
		// 获取商品列表
		this.getGoodsList();
	},
	methods: {
		goDetail(goods_id) {
			uni.navigateTo({
				url: `/subpkg/pages/goods/index?id=` + goods_id
			});
		},
		// 获取列表
		async getGoodsList() {
			if (!this.haveMore) return;
			if (!this.query) return;
			const { data: res } = await uni.$http.get('/api/public/v1/goods/search', {
				query: this.query,
				pagenum: this.nextPage++,
				pagesize: 5
			});
			console.log(res);
			// 列表渲染
			// this.goodsList = res.message.goods;
			// 追加数组
			this.goodsList = this.goodsList.concat(res.message.goods);

			// 如果还有数据就显示
			this.haveMore = this.goodsList < res.message.total;

			// 判断如果没有数据
			if (this.goodsList.length === 0) this.msg = '空空如也~';
		},
		// 防抖处理 下拉
		getMore: debounce(function() {
			console.log('滚动到底部');
			// 刷新列表
			this.getGoodsList();
		}, 500)
	}
};
</script>

<style scoped lang="scss">
.filter {
	display: flex;
	height: 96rpx;
	line-height: 96rpx;
	border-bottom: 1rpx solid #ddd;

	/* #ifdef H5 */
	position: relative;
	z-index: 99;
	/* #endif */

	text {
		flex: 1;
		text-align: center;
		font-size: 30rpx;
		color: #333;

		&.active {
			color: #ea4451;
		}
	}
}

.goods {
	position: absolute;
	width: 100%;
	top: 97rpx;
	bottom: 0;
}

.item {
	display: flex;
	padding: 30rpx 20rpx 30rpx 0;
	margin-left: 20rpx;
	border-bottom: 1rpx solid #eee;

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
}
</style>
