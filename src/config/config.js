/*
*  配置编译环境和线上环境之间的切换
*
*  baseUrl: 域名地址
*  routerMode: 路由模式
*  imageBaseUrl: 图片所在的域名地址
*
* */

let baseUrl = '';
let routerMode = 'hash';
let imageUrl = '';

if (process.env.NODE_ENV === 'development') {
  baseUrl = "http://wawaji.whxyzx.cn/wawaji/";
} else if (process.env.NODE_ENV === 'production') {
  baseUrl = "http://wawaji.whxyzx.cn/wawaji/";
}

export {
  baseUrl,
  routerMode,
  imageUrl
}
