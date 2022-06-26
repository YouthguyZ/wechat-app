import {
	$http
} from "@escook/request-miniprogram";

// 导入vuex
import store from '@/store/store';

// 配置请求根路径
// $http.baseUrl = 'https://api-hmugo-web.itheima.net';
$http.baseUrl = 'https://uinav.com'

// 请求开始之前
$http.beforeRequest = function(options) {
	uni.showLoading({
		title: '数据加载中...',
		mask: true
	})

	// 只有路径中包含了 /my/ 的才需要发送 token
	if (options.url.includes('/my/')) {
		options.header = {
			Authorization: store.state.user.token
		}
	}
}

// 请求完成之后
$http.afterRequest = function(res) {
	uni.hideLoading();
}

// 将$http挂载到uni全局对象
uni.$http = $http;
