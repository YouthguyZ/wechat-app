import {
  $http
} from "@escook/request-miniprogram";

// 配置请求根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net';

// 请求开始之前
$http.beforeRequest = function(options) {
  uni.showLoading({
    title: '数据加载中...',
	mask:true
  });
}

// 请求完成之后
$http.afterRequest = function(res) {
  uni.hideLoading();
}

// 将$http挂载到uni全局对象
uni.$http = $http;