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
  showToast(error.message);
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
  
  //获取个人信息
  getBaseInfo() {
    let url = `${apiData.public}User.getBaseInfo`;
    let formData = new FormData();
    formData.append("token", state.token);
    formData.append("uid", state.uid);
    return this.postAxiosAction(url, formData);
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
  //获取当前房间信息
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
  //进入扭蛋房间
  getJoinNiudan(roomId) {
    let url = `${apiData.public}Niudan.roomInfo`;
    let formData = new FormData();
    formData.append('token', state.token);
    formData.append('uid', state.uid);
    formData.append('room_id', roomId);
    return this.postAxiosAction(url, formData, true);
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
}
