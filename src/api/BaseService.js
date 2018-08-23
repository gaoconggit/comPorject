/*
*   封装axios请求
*   author: 王小白
* */

import axios from "axios";
import {baseUrl} from "../config/config";
import Vue from "vue";
import {ToastPlugin} from 'vux';
import store from '../store';

Vue.use(ToastPlugin);
let {state} = store;

let vm = new Vue();

let cancel, promiseArr = {};
const CancelToken = axios.CancelToken;
//请求拦截器
axios.interceptors.request.use(config => {
  
  if (promiseArr[config.url]) {
    promiseArr[config.url]('操作取消');
    promiseArr[config.url] = cancel;
  } else {
    promiseArr[config.url] = cancel;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

//响应拦截器即异常处理
axios.interceptors.response.use(response => {
  return response;
}, error => {
  if (error && error.response) {
    switch (error) {
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
  vm.$vux.toast.show({
    type: 'text',
    position: 'middle',
    text: error.message,
  })
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
};

export default {
  //get请求
  getAxiosAction(url, params) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: baseUrl + url,
        params,
        cancelToken: new CancelToken(c => {
          cancel = c;
        })
      }).then((res) => {
        resolve(res.data);
      })
    })
  },
  //post请求
  postAxiosAction(url, params) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: baseUrl + url,
        data: params,
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        if (res.data != null) {
          res = res.data;
          if (res.code != 1) {
            reject(res.msg);
          } else {
            resolve(res.data);
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
  }
}
