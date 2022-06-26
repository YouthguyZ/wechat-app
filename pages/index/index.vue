<template>
	<view :style="{ height: pageHeight, overflow: 'hidden' }">
		<search @search="disableScroll" />
		<!-- 焦点图 -->
		<swiper class="banner" indicator-dots indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#fff">
			<swiper-item v-for="item in swiperList" :key="item.goods_id">
				<navigator :url="`/subpkg/pages/goods/index?id=${item.goods_id}`">
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>
		<!-- 导航条 -->
		<view class="navs">
			<navigator
				v-for="item in CategoryList"
				:key="item.name"
				:open-type="item.open_type || 'navigate'"
				:url="item.open_type ? `/pages/category/index` : `/subpkg/pages/list/index?query=${item.name}`"
			>
				<image :src="item.image_src"></image>
			</navigator>
		</view>
		<!-- 楼层 -->
		<view class="floors">
			<view v-for="item in floorList" :key="item.floor_title.name" class="floor">
				<view class="title"><image :src="item.floor_title.image_src"></image></view>
				<view class="items">
					<navigator
						v-for="product in item.product_list"
						:key="product.name"
						:url="`/subpkg/pages/list/index?query=${product.name}`"
					>
						<image :src="product.image_src"></image>
					</navigator>
				</view>
			</view>
		</view>
		<!-- 回到顶部 -->
		<view @click="goTop" class="goTop icon-top"></view>
	</view>
</template>

<script>
import search from '@/components/search';

export default {
	data() {
		return {
			pageHeight: 'auto',
			swiperList: [],
			CategoryList: [],
			floorList: []
		};
	},

	components: {
		search
	},
	// 加载
	onLoad() {
		// 获取轮播图
		this.getSwiperList(),
			// 获取导航栏目
			this.getCategoryList();
		// 获取楼层列表
		this.getfloorList();
	},
	// 下拉刷新
	async onPullDownRefresh() {
		// 获取轮播图
		await this.getSwiperList(),
			// 获取导航栏目
			await this.getCategoryList();
		// 获取楼层列表
		await this.getfloorList();

		// 停止下拉刷新
		uni.stopPullDownRefresh();
	},

	methods: {
		disableScroll(ev) {
			this.pageHeight = ev.pageHeight;
		},
		// 返回顶部
		goTop() {
			uni.pageScrollTo({
				scrollTop: 0
			});
		},
		async getSwiperList() {
			// 结构数组
			const { data: res } = await uni.$http.get('/api/public/v1/home/swiperdata');
			// console.log(res);
			if (res.meta.status !== 200)
				uni.showToast({
					title: '获取失败',
					duration: 1500,
					icon: 'none'
				});
			this.swiperList = res.message;
		},
		async getCategoryList() {
			const { data: res } = await uni.$http.get('/api/public/v1/home/catitems');
			// console.log(res);
			if (res.meta.status !== 200)
				uni.showToast({
					title: '获取失败',
					duration: 1500,
					icon: 'none'
				});
			this.CategoryList = res.message;
		},
		async getfloorList() {
			const { data: res } = await uni.$http.get('/api/public/v1/home/floordata');
			console.log(res);
			if (res.meta.status !== 200)
				uni.showToast({
					title: '获取失败',
					duration: 1500,
					icon: 'none'
				});
			this.floorList = res.message;
		}
	}
};
</script>

<style scoped lang="scss">
.banner {
	width: 100%;
	height: 340rpx;

	image {
		width: 100%;
		height: 340rpx;
	}
}

.navs {
	display: flex;
	justify-content: space-between;
	padding: 30rpx 44rpx;

	image {
		width: 128rpx;
		height: 140rpx;
	}
}

.floor {
	.title {
		width: 750rpx;
		height: 60rpx;
		padding: 20rpx 0 0 8rpx;
		background-color: #f4f4f4;
	}

	.items {
		padding: 20rpx 16rpx;
		overflow: hidden;

		navigator {
			width: 193rpx;
			height: 188rpx;
			margin-left: 10rpx;
			margin-bottom: 10rpx;
			float: left;
		}

		navigator:first-child {
			width: 232rpx;
			height: 386rpx;
			margin-left: 0rpx;
		}

		navigator:nth-child(2),
		navigator:nth-child(5) {
			width: 273rpx;
		}
	}

	&:first-child {
		.items {
			navigator {
				width: 233rpx;
			}
		}
	}
}

.goTop {
	position: fixed;
	bottom: 30rpx;
	/* #ifdef H5 */
	bottom: 65px;
	/* #endif */
	right: 30rpx;

	display: flex;
	justify-content: center;
	align-items: center;
	width: 100rpx;
	height: 100rpx;
	font-size: 48rpx;
	color: #666;
	border-radius: 50%;
	background-color: rgba(255, 255, 255, 0.8);
}
</style>
