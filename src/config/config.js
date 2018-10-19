/*
*  配置编译环境和线上环境之间的切换
*
*  baseUrl: 域名地址
*  routerMode: 路由模式
*  imageBaseUrl: 图片所在的域名地址
*
* */

let baseUrl = '';//请求地址
let routerMode = 'hash';//路由类型
let imageUrl = '';//图片地址

if (process.env.NODE_ENV === 'development') {
  // baseUrl = "http://wawaji.whxyzx.cn/wawaji/";
  /*开发地址*/
  baseUrl = "https://wwjapi.whxyzx.cn/wawaji/";
} else if (process.env.NODE_ENV === 'production') {
  /*请求线上地址*/
  baseUrl = "https://wwjapi.whxyzx.cn/wawaji/";
}

/*测试服使用的*/
// const SDK_APPID = 1400058881;     //腾讯IM的appid
// const ACCOUNT_TYPE = 20972;       //腾讯IM的account_type
// const URL = 'http://wawaji.whxyzx.cn/h5_login/';//微信公众号地址

/*正式服使用的*/
const SDK_APPID = 1400072244;     //腾讯IM的appid
const ACCOUNT_TYPE = 23370;       //腾讯IM的account_type
const URL = 'https://wwj.whxyzx.cn/wawaji/h5/';//微信公众号地址

/*当前版本号*/
const VERSION = '2.3.0';

const APPID = 'wx51c749f31ff97876';//微信公众号唯一标识
// const APPID = 'wx54c4e3c9a78ae9ff';//APP

const TITLE = '掌上抓娃娃';//标题
const DESC = '新手免费抓！百分之百前爪场，强抓爪不送爪！手残党那就来保送场！还有无挡板房间等你来捡漏！邀请好友送金币';//描述

export {
  baseUrl,
  routerMode,
  imageUrl,
  SDK_APPID,
  ACCOUNT_TYPE,
  APPID,
  URL,
  TITLE,
  DESC,
  VERSION,
}
