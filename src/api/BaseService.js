/*
*   封装axios请求
*   author: 王小白
* */

import axios from "axios";
import {baseUrl} from "../config/config";
import {showToast} from "../common/util/Utils";
import store from '../store';

let {state} = store;

let cancel, promiseArr = {};
const CancelToken = axios.CancelToken;
//请求拦截器
axios.interceptors.request.use(config => {
  /*if (promiseArr[config.url]) {
    promiseArr[config.url]('操作取消');
    promiseArr[config.url] = cancel;
  } else {
    promiseArr[config.url] = cancel;
  }*/
  return config;
}, error => {
  showToast('请求超时');
  return Promise.resolve(error);
});

//响应拦截器即异常处理
axios.interceptors.response.use(response => {
  if (response.status && response.status == 200 && response.data.code != '1') {
    showToast(response.data.msg, 'text', 2000, '300px');
  }
  return response;
}, error => {
  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        error.message = "错误请求";
        break;
      case 401:
        error.message = "未授权，请重新登陆";
        break;
      case 403:
        error.message = "拒绝访问";
        break;
      case 404:
        error.message = "请求错误，未找到该资源";
        break;
      case 405:
        error.message = "请求方法未允许";
        break;
      case 408:
        error.message = "请求超时";
        break;
      case 500:
        error.message = "服务器错误";
        break;
      case 501:
        error.message = "网络未实现";
        break;
      case 502:
        error.message = "网络错误";
        break;
      case 503:
        error.message = "服务器不可用";
        break;
      case 504:
        error.message = "网络超时";
        break;
      case 505:
        error.message = "http版本不支持该请求";
        break;
      default:
        error.message = `连接错误${error.response.status}`;
        break;
    }
  } else {
    error.message = "连接服务器失败";
  }
  showToast(error.message, 'cancel');
  return Promise.resolve(error.response);
});

//设置默认请求地址
// axios.defaults.baseURL = "/api/";
//设置默认请求头
// axios.defaults.headers = {
//   'X-Requested-With': 'XMLHttpRequest'
// };
//设置默认超时毫秒
axios.defaults.timeout = 10000;

//常用请求地址
const apiData = {
  public: "api/public/?service=",
  mywawa: "api/mywawa/api",
  room: "api/room/api",
  usercode: "api/usercode/api",
  notice: "api/notice/api",
  set: "api/set/api",
  record: "api/record/api",
  addr: "api/addr/api"
};

export default {
  //get请求
  getAxiosAction(url, params, isShowError = false) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: baseUrl + url,
        params,
        cancelToken: new CancelToken(c => {
          cancel = c;
        })
      }).then((res) => {
        if (res != null) {
          res = res.data;
          if (isShowError) {
            resolve(res)
          } else {
            if (res.code != 1) {
              reject(res.msg);
            } else {
              resolve(res);
            }
          }
        }
      })
    })
  },
  //post请求
  postAxiosAction(url, params, isShowError = false) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: baseUrl + url,
        data: params,
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        if (res != null) {
          res = res.data;
          if (isShowError) {
            resolve(res)
          } else {
            if (res.code != 1) {
              reject(res.msg);
            } else {
              resolve(res);
            }
          }
        }
      })
    })
  },
  
  //微信公众号分享获取签名
  getSignature(sendUrl) {
    let url = `${apiData.public}Order.getSignature`;
    let formData = new FormData()
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('url', sendUrl);
    return this.postAxiosAction(url, formData);
  },
  //微信登录
  loginWeChat(code) {
    let url = `${apiData.public}Login.weixinLogin`;
    let formData = new FormData();
    formData.append('code', code);
    formData.append('usercode', 0);
    return this.postAxiosAction(url, formData, true);
  },
  //发送心跳
  postOnline() {
    let url = `${apiData.usercode}`;
    let formData = new FormData();
    formData.append("api_name", "online");
    formData.append("token", state.token);
    formData.append("uid", state.uid);
    return this.postAxiosAction(url, formData);
  },
  //获取个人信息
  getBaseInfo(isShowError = false) {
    let url = `${apiData.public}User.getBaseInfo`;
    let formData = new FormData();
    formData.append("token", state.token);
    formData.append("uid", state.uid);
    return this.postAxiosAction(url, formData, isShowError);
  },
  //获取签到信息
  getSignInfo() {
    let url = `${apiData.public}Home.getSignIn`;
    let formData = new FormData();
    formData.append("token", state.token);
    formData.append("uid", state.uid);
    return this.postAxiosAction(url, formData);
  },
  //签到
  postSign() {
    let url = `${apiData.public}Home.signIn`;
    let formData = new FormData();
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    return this.postAxiosAction(url, formData, true);
  },
  //获取vip卡签到
  getVipCard() {
    let url = apiData.mywawa;
    let formData = new FormData();
    formData.append('api_name', 'get_vip_sign_in');
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    return this.postAxiosAction(url, formData);
  },
  //VIP卡签到
  postVipCardSign(id) {
    let url = apiData.mywawa;
    let formData = new FormData();
    formData.append('api_name', 'vip_sign_in');
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('vip_card_id', id);
    return this.postAxiosAction(url, formData, true);
  },
  //获取公告信息
  getPublicNotice() {
    let url = `${apiData.public}Home.publicNotice`;
    let formData = new FormData();
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    return this.postAxiosAction(url, formData);
  },
  //获取新手场房间信息
  getNewBeeRoomInfo() {
    let url = `${apiData.public}Home.newbeeRoomInfo`;
    let formData = new FormData();
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    return this.postAxiosAction(url, formData, true);
  },
  //获取banner
  getBanner() {
    let url = `${apiData.public}Home.getHot`;
    return this.postAxiosAction(url);
  },
  //获取娃娃分类
  getCategory() {
    let url = `${apiData.public}Home.wawaCategory`;
    let formData = new FormData();
    formData.append("token", state.token);
    formData.append("uid", state.uid);
    return this.postAxiosAction(url, formData);
  },
  //获取娃娃列表
  getWawaList(type, page = 1) {
    let url = `${apiData.public}Home.wawaList`;
    let formData = new FormData();
    formData.append("token", state.token);
    formData.append("uid", state.uid);
    formData.append("category", type);
    formData.append("page", page);
    formData.append("size", 10);
    return this.postAxiosAction(url, formData);
  },
  //获取排行榜-日榜
  getDayRankList() {
    let url = `${apiData.public}Chart.darenDailyChart`;
    let formData = new FormData();
    formData.append("token", state.token);
    formData.append("uid", state.uid);
    return this.postAxiosAction(url, formData);
  },
  //获取排行榜-周榜榜
  getWeekRankList() {
    let url = `${apiData.public}Chart.darenWeeklyChart`;
    let formData = new FormData();
    formData.append("token", state.token);
    formData.append("uid", state.uid);
    return this.postAxiosAction(url, formData);
  },
  //获取充值规则
  getRechargeRuleList() {
    let url = `${apiData.public}Record.rechargeRuleList`;
    let formData = new FormData();
    formData.append("token", state.token);
    formData.append("uid", state.uid);
    return this.postAxiosAction(url, formData);
  },
  //获取特惠礼包信息
  getGiftBagInfo() {
    let url = `${apiData.public}Record.storePromotionInfo`;
    let formData = new FormData();
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    return this.postAxiosAction(url, formData);
  },
  //获取进入房间信息
  getJoinRoom(wawaId, roomId = null) {
    let url = `${apiData.public}Room.joinRoom`;
    let formData = new FormData();
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('room_id', roomId);
    formData.append('wawa_id', wawaId);
    return this.postAxiosAction(url, formData, true);
  },
  //开始抓娃娃
  getGameStart(roomId, multiple) {
    let url = `${apiData.public}Room.roomGameStart`;
    let formData = new FormData();
    formData.append("token", state.token);
    formData.append("uid", state.uid);
    formData.append("room_id", roomId);
    formData.append("multiple", multiple);
    return this.postAxiosAction(url, formData, true)
  },
  //预约/取消抓娃娃
  getRoomWait(roomId) {
    let url = `${apiData.public}Room.roomWaitEdit`;
    let formData = new FormData();
    formData.append("token", state.token);
    formData.append("uid", state.uid);
    formData.append("room_id", roomId);
    return this.postAxiosAction(url, formData);
  },
  getRoomGameCancel(roomId) {
    let url = `${apiData.public}Room.roomGameCancel`;
    let formData = new FormData();
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('room_id', roomId);
    return this.postAxiosAction(url, formData);
  },
  //退出房间
  getRoomExit(roomId) {
    let url = `${apiData.public}Room.exitRoom`;
    let formData = new FormData();
    formData.append("token", state.token);
    formData.append("uid", state.uid);
    formData.append("room_id", roomId);
    return this.postAxiosAction(url, formData, true);
  },
  //获取当前房间人数信息
  getRoomAudience(roomId) {
    let url = `${apiData.mywawa}`;
    let formData = new FormData();
    formData.append("api_name", "game_audience");
    formData.append("token", state.token);
    formData.append("uid", state.uid);
    formData.append("room_id", roomId);
    formData.append("page", 1);
    formData.append("size", 6);
    return this.postAxiosAction(url, formData);
  },
  //获取当前房间历史记录
  getRoomHistory(roomId) {
    let url = `${apiData.public}Room.roomHistory`;
    let formData = new FormData();
    formData.append("token", state.token);
    formData.append("uid", state.uid);
    formData.append("room_id", roomId);
    formData.append("page", 1);
    formData.append("size", 10);
    return this.postAxiosAction(url, formData);
  },
  //获取上报房间错误列表
  getRoomServiceList() {
    let url = `${apiData.room}`;
    let formData = new FormData();
    formData.append("api_name", "room_service_text");
    formData.append("token", state.token);
    formData.append("uid", state.uid);
    return this.postAxiosAction(url, formData);
  },
  //获取上报房间错误列表
  getRoomFixReport(roomId, service_text_id) {
    let url = `${apiData.room}`;
    let formData = new FormData();
    formData.append("api_name", "room_game_service");
    formData.append("token", state.token);
    formData.append("uid", state.uid);
    formData.append("room_id", roomId);
    formData.append("service_text_id", service_text_id);
    return this.postAxiosAction(url, formData);
  },
  //获取快捷聊天语句
  getQuickMessage() {
    let url = `${apiData.public}Room.quickMessage`;
    let formData = new FormData();
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    return this.postAxiosAction(url, formData);
  },
  //获取屏蔽关键字
  getKeyWord() {
    let url = `${apiData.room}`;
    let formData = new FormData();
    formData.append("api_name", "get_keyword");
    formData.append("token", state.token);
    formData.append("uid", state.uid);
    return this.postAxiosAction(url, formData);
  },
  //获取扭蛋列表
  getNiudanList(page = 1) {
    let url = `${apiData.public}Niudan.roomList`;
    let formData = new FormData();
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('page', page);
    formData.append('size', 10);
    return this.postAxiosAction(url, formData);
  },
  getNiudanRoomInfo(roomId) {
    let url = `${apiData.public}Niudan.RoomInfo`;
    let formData = new FormData();
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('room_id', roomId);
    return this.postAxiosAction(url, formData);
  },
  //获取扭蛋历史记录
  getNiuDanHistory(roomId) {
    let url = `${apiData.public}Niudan.roomHistory`;
    let formData = new FormData();
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('room_id', roomId);
    formData.append('page', 1);
    formData.append('size', 10);
    return this.postAxiosAction(url, formData);
  },
  //获取游戏中心列表
  getGameCenterList(page = 1) {
    let url = `${apiData.public}GameCenter.getList`;
    let formData = new FormData();
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('p', page);
    formData.append('size', 10);
    return this.postAxiosAction(url, formData);
  },
  //获取积分商城地址
  getScoreUrl() {
    let url = `${apiData.public}Home.getScoreUrl`;
    let formData = new FormData();
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    return this.postAxiosAction(url, formData);
  },
  MAXSIZE: 31,
  //获取个人消息列表
  getNoticeList() {
    let url = `${apiData.notice}`;
    let formData = new FormData();
    formData.append('api_name', 'user_notice_list');
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('size', this.MAXSIZE);
    return this.postAxiosAction(url, formData);
  },
  //获取个人消息详情
  getNoticeInfo(id) {
    let url = `${apiData.notice}`;
    let formData = new FormData();
    formData.append('api_name', 'user_notice_info');
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('id', id);
    return this.postAxiosAction(url, formData);
  },
  //领取个人消息中的物品
  getUserNoticeGoods(id) {
    let url = `${apiData.notice}`;
    let formData = new FormData();
    formData.append('api_name', 'accept_user_notice_goods');
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('id', id);
    return this.postAxiosAction(url, formData, true);
  },
  //删除个人消息
  deleteUserNotice(id) {
    let url = `${apiData.notice}`;
    let formData = new FormData();
    formData.append('api_name', 'remove_user_notice');
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('id', id);
    return this.postAxiosAction(url, formData);
  },
  //获取系统消息列表
  getSysNoticeList(channel = null) {
    let url = `${apiData.notice}`;
    let formData = new FormData();
    formData.append('api_name', 'sys_notice_list');
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('channel', channel);
    return this.postAxiosAction(url, formData);
  },
  //获取系统消息详情
  getSysNoticeInfo(id) {
    let url = `${apiData.notice}`;
    let formData = new FormData();
    formData.append('api_name', 'sys_notice_info');
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('id', id);
    return this.postAxiosAction(url, formData);
  },
  //设置背景音开关
  fixBgmuisc(type) {
    let url = apiData.set;
    let formData = new FormData();
    formData.append('api_name', 'bgmusic');
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('type', type);//1开 2关
    return this.postAxiosAction(url, formData);
  },
  //设置音效开关
  fixSound(type) {
    let url = apiData.set;
    let formData = new FormData();
    formData.append('api_name', 'yx');
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('type', type);//1开 2关
    return this.postAxiosAction(url, formData);
  },
  //获取常见问题
  getSettingFaq() {
    let url = `${apiData.public}setting.faq`;
    return this.postAxiosAction(url);
  },
  //获取金币明细
  getCoinDetailed(page) {
    let url = apiData.record;
    let formData = new FormData();
    formData.append('api_name', 'body_bill');
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('page', page);
    formData.append('size', 10);
    return this.postAxiosAction(url, formData);
  },
  //获取积分明细
  getScoreDetailed(page) {
    let url = `${apiData.public}Score.info`;
    let formData = new FormData();
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('page', page);
    formData.append('size', 10);
    return this.postAxiosAction(url, formData);
  },
  //我的娃娃个人信息接口
  getWawaInfo() {
    let url = `${apiData.public}Wawa.info`;
    let formData = new FormData();
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    return this.postAxiosAction(url, formData);
  },
  //获取娃娃列表
  getMyWawaList(page = 1, type = 0) {
    let url = `${apiData.public}wawa.wawaList`;
    let formData = new FormData();
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('status', type);
    formData.append('page', page);
    formData.append('size', 10);
    return this.postAxiosAction(url, formData);
  },
  //获取运单列表
  getWaybillList(page) {
    let url = 'api/waybill/api';
    let formData = new FormData();
    formData.append('api_name', 'waybill_list');
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('page', page);
    formData.append('size', 10);
    return this.postAxiosAction(url, formData);
  },
  //兑换娃娃
  getWawaConvertCoin(list) {
    let url = `${apiData.public}Wawa.convertCoin`;
    let formData = new FormData();
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('w_list', list);
    return this.postAxiosAction(url, formData, true);
  },
  //邮寄娃娃
  getWawaMail(list) {
    let url = `${apiData.public}Wawa.mail`;
    let formData = new FormData();
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('w_list', list);
    return this.postAxiosAction(url, formData, true);
  },
  //确认邮寄娃娃
  getConfirmMail(addrId, list, chargeId = null, payType = null, remark = "邮寄备注") {
    let url = `${apiData.public}Wawa.confirmMail`;
    let formData = new FormData();
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('addr_id', addrId);
    formData.append('remark', remark);
    formData.append('w_list', list);
    formData.append('charge_id', chargeId);
    formData.append('pay_type', payType);
    return this.postAxiosAction(url, formData, true);
  },
  //获取游戏历史记录
  getHistoryList(page = 1) {
    let url = apiData.mywawa;
    let formData = new FormData();
    formData.append('api_name', 'game_history');
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('page', page);
    formData.append('size', 10);
    return this.postAxiosAction(url, formData);
  },
  //游戏申诉列表
  getAppealList(roomId) {
    let url = apiData.mywawa;
    let formData = new FormData();
    formData.append('api_name', 'appeal_list');
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('room_id', roomId);
    return this.postAxiosAction(url, formData);
  },
  //提交游戏申诉
  getConfirmAppeal(hid, type) {
    let url = apiData.mywawa;
    let formData = new FormData();
    formData.append('api_name', 'add_appeal');
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('hid', hid);
    formData.append('appeal_type', type);
    return this.postAxiosAction(url, formData, true);
  },
  //获取地址列表
  getAddressList() {
    let url = apiData.addr;
    let formData = new FormData();
    formData.append('api_name', 'addr_list');
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    return this.postAxiosAction(url, formData);
  },
  //删除地址
  deleteAddress(id) {
    let url = apiData.addr;
    let formData = new FormData();
    formData.append('api_name', 'addr_del');
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('addr_id', id);
    return this.postAxiosAction(url, formData);
  },
  //添加地址
  addAddAddress(name, mobile, addr, addr_info) {
    let url = apiData.addr;
    let formData = new FormData();
    formData.append('api_name', 'addr_add');
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('username', name);
    formData.append('mobile', mobile);
    formData.append('addr', addr);
    formData.append('addr_info', addr_info);
    return this.postAxiosAction(url, formData);
  },
  //修改地址
  fixAddress(id, name, mobile, addr, addr_info) {
    let url = apiData.addr;
    let formData = new FormData();
    formData.append('api_name', 'addr_update');
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('addr_id', id);
    formData.append('username', name);
    formData.append('mobile', mobile);
    formData.append('addr', addr);
    formData.append('addr_info', addr_info);
    return this.postAxiosAction(url, formData);
  },
  //获取我的邀请码
  getMyCode() {
    let url = apiData.usercode;
    let formData = new FormData();
    formData.append('api_name', 'get_code');
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('sys', 3);
    return this.postAxiosAction(url, formData);
  },
  //获取邀请码规则
  getCodeRule() {
    let url = apiData.usercode;
    let formData = new FormData();
    formData.append('api_name', 'get_code_config');
    return this.postAxiosAction(url, formData);
  },
  //兑换邀请码
  postConvertCode(code) {
    let url = apiData.usercode;
    let formData = new FormData();
    formData.append('api_name', 'convert_code');
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('code', code);
    return this.postAxiosAction(url, formData, true);
  },
}
