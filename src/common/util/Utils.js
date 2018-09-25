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
export const showToast = (text, type = 'text', time = 2000, width = '200px', position = 'middle') => {
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

//点击banner
export function clickBannerItem(_this, item) {
  let changeTab = null;
  if (item.slide_url !== "" || item.slide_content !== "") {
    //window.location.href = slide_url;
    _this.$router.push({path: '/details', query: {url: item.slide_url}})
  } else {
    switch (item.jump_target) {
      case "store":
        //充值中心
        _this.$router.push({path: "/recharge"});
        break;
      case "share":
        //我的邀请码
        // _this.$router.push({path: "/recharge"});
        break;
      case "vip":
        //vip中心
        // _this.$router.push({path: "/recharge"});
        break;
      case "faq":
        //常见问题
        // _this.$router.push({path: "/recharge"});
        break;
      case "niudan":
        //扭蛋
        changeTab = 2;
        break;
      case "score_store":
        //积分商城
        changeTab = 3;
        break;
      case "xzww":
        //旋转抓娃娃
        changeTab = 1;
        break;
      case "game_content":
        //游戏中心
        changeTab = 4;
        break;
    }
  }
  if (changeTab != null) {
    return changeTab;
  }
}

/*公众号支付*/
export async function WXPay(id, callback = null) {
  let result = await api.getRecharge(id);
  console.log(result);
  if (result.code == 1) {
    vm.$wechat.chooseWXPay({
      timestamp: result.data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      nonceStr: result.data.nonceStr, // 支付签名随机串，不长于 32 位
      package: result.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
      signType: result.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      paySign: result.data.paySign, // 支付签名
      success: function (res) {
        // 支付成功后的回调函数
        console.log("支付成功的回调", res)
        api.postReportPayResult(result.data.inner_oid, 3);
        showToast('支付成功', 'text', 500);
        if (callback) {
          callback(1)
        }
      },
      cancel: function (res) {
        console.log("支付取消的回调", res)
        api.postReportPayResult(result.data.inner_oid, 4);
        showToast('支付取消', 'text', 500);
        if (callback) {
          callback(2)
        }
      },
      error: function (err) {
        console.log("支付失败的回调", err)
        api.postReportPayResult(result.data.inner_oid, result.code);
        showToast('支付失败', 'text', 500);
        if (callback) {
          callback(3)
        }
      }
    });
  } else {
    showToast('支付获取失败', 'cancel');
  }
}
