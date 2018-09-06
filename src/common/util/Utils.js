/*
*   常用函数
* */
import Vue from 'vue';
import store from "../../store";
import {ToastPlugin} from 'vux';
import api from "../../api/BaseService";

Vue.use(ToastPlugin);
let vm = new Vue();

/*不足两位补零*/
function Zerofill(num) {
  return num > 9 ? num : '0' + num;
}

/*封装toast*/
export const showToast = (text, type = 'text', time = 2000, width = '7.6em', position = 'middle') => {
  vm.$vux.toast.show({
    type,
    position,
    text,
    time,
    width,
    isShowMask: true,
  })
};

/*时间戳转日期*/
export function getTimeDate(val, isYear = false) {
  let nowTime = new Date(),
    nowYear = nowTime.getFullYear(),
    nowMonth = nowTime.getMonth(),
    nowDate = nowTime.getDate();
  
  let varTime = new Date(Number(val) * 1000),
    varYear = varTime.getFullYear(),
    varMonth = varTime.getMonth() + 1,
    varDate = varTime.getDate(),
    varHours = varTime.getHours(),
    varMinutes = varTime.getMinutes();
  
  if (isYear) {
    return `${Zerofill(varYear)}-${Zerofill(varMonth)}-${Zerofill(varDate)} ${Zerofill(varHours)}:${Zerofill(varMinutes)}`;
  }
  
  if (nowYear === varYear) {
    return `${Zerofill(varMonth)}-${Zerofill(varDate)} ${Zerofill(varHours)}:${Zerofill(varMinutes)}`;
  } else if (nowYear === varYear && nowMonth === varMonth) {
    return `${Zerofill(varMonth)}-${Zerofill(varDate)} ${Zerofill(varHours)}:${Zerofill(varMinutes)}`;
  } else if (nowYear === varYear && nowMonth === varMonth && nowDate === varDate) {
    return `${Zerofill(varHours)}:${Zerofill(varMinutes)}`;
  } else {
    return `${Zerofill(varYear)}-${Zerofill(varMonth)}-${Zerofill(varDate)} ${Zerofill(varHours)}:${Zerofill(varMinutes)}`;
  }
};

//更新个人信息
export function updateBaseInfo() {
  api.getBaseInfo().then((result) => {
    console.log(result);
    store.commit('SET_USER_INFO', result.data);
  });
}

//返回时分秒
export function formatSeconds(value) {
  let theTime = parseInt(value),// 需要转换的时间秒
    hour = 0,// 小时
    minute = 0,// 分
    day = 0;// 天
  if (theTime > 60) {
    minute = parseInt(theTime / 60);
    if (minute > 60) {
      hour = parseInt(minute / 60);
      minute = parseInt(minute % 60);
      if (hour > 24) {
        //大于24小时
        day = parseInt(hour / 24);
        hour = parseInt(hour % 24);
      }
    }
  }
  let result = '';
  
  if (day > 0) {
    result = "" + Zerofill(parseInt(hour)) + "时";
    result = "" + parseInt(day) + "天" + result;
    
    return result;
  } else {
    result = "" + Zerofill(parseInt(minute)) + "分";
    result = "" + Zerofill(parseInt(hour)) + "时" + result;
    
    return result;
  }
};
