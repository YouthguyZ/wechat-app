<template>
	<view class="prifile">
		<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
			<image class="avatar" :src="userProfile.avatarUrl"></image>
		</button>
		<view class="nickname-wrapper">
			<label for="">昵称：</label>
			<input type="nickName" :value="userProfile.nickName" @blur="getNickname" />
		</view>
		<button type="primary" block @click="getProfile">确认</button>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	// data() {
	// 	return {
	// 		userProfile: {
	// 			avatarUrl: '',
	// 			nickName: ''
	// 		}
	// 	};
	// },
	computed: {
		...mapState('user', ['userProfile'])
	},
	methods: {
		onChooseAvatar(e) {
			console.log(e);
			this.userProfile.avatarUrl = e.detail.avatarUrl;
		},
		getNickname(e) {
			console.log(e);
			this.userProfile.nickName = e.detail.value;
		},
		getProfile() {
			// 信息存入 vuex 状态
			this.$store.commit('user/getProfile', this.userProfile);
			// 跳转回上一页
			uni.navigateBack();
		}
	}
};
</script>

<style lang="scss" scoped>
.profile {
	padding: 0 40rpx;
}

.avatar-wrapper {
	padding: 0;
	width: 112rpx;
	border-radius: 16rpx;
	margin-top: 80rpx;
	margin-bottom: 120rpx;

	&::after {
		content: '';
		border: none;
	}

	.avatar {
		display: block;
		width: 112rpx;
		height: 112rpx;
	}
}

.nickname-wrapper {
	display: flex;
	align-items: center;
	height: 80rpx;
	border-bottom: 1rpx solid #eee;
	margin-bottom: 40rpx;

	label {
		// width: 100rpx;
		color: #333;
		font-size: 34rpx;
	}

	input {
		color: #666;
		font-size: 34rpx;
	}
}
</style>
