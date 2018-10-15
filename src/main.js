// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueLazyload from "vue-lazyload";
/*各种页面的路由地址*/
import routes from './router/index';
import store from './store/';
import {ACCOUNT_TYPE, APPID, DESC, routerMode, SDK_APPID, TITLE, URL} from "./config/config";
import {mapMutations, mapState} from "vuex";
import FastClick from 'fastClick';
import {LoadingPlugin, ToastPlugin, AlertPlugin, WechatPlugin} from 'vux';
import {
  delCookie,
  escape2Html,
  getCookie,
  getQueryString,
  getStore,
  removeStore,
  setCookie,
  setStore
} from './common/util/ImUtils';
import api from "./api/BaseService";
import {updateBaseInfo} from "./common/util/Utils";

const webim = newWebIm();

Vue.use(VueLazyload);
Vue.use(LoadingPlugin);
Vue.use(ToastPlugin, {position: 'middle'});
Vue.use(AlertPlugin);
Vue.use(WechatPlugin);

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: './assets/img/lazyload.png',
  loading: './assets/img/lazyload.png',
  attempt: 1,
  listenEvents: ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove'],
});

Vue.config.productionTip = false;

FastClick.attach(document.body);

Vue.use(VueRouter);
const router = new VueRouter({
  routes,
  mode: routerMode,
  strict: process.env.NODE_ENV !== 'production',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop;
      }
      return {x: 0, y: to.meta.savedPosition || 0}
    }
  }
});

if (process.env.NODE_ENV === "production") {
  router.beforeEach((to, form, next) => {
    if (getQueryString('code') || getQueryString('token')) {
      if (!getCookie('wawaji_token')) {
        setCookie('wawaji_code', getQueryString('code'));
        setCookie('wawaji_token', getQueryString('token'));
      }
    }
    if (!getCookie('wawaji_code') && !getCookie('wawaji_token')) {
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${encodeURIComponent(URL)}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`;
    } else {
      if (getCookie('wawaji_token') === "null" || !getCookie('wawaji_token')) {
        api.loginWeChat(getCookie('wawaji_code'))
          .then((res) => {
            console.log(res);
            if (res.code == 1) {
              store.commit('SET_TOKEN', res.data.token);
              store.commit('SET_UID', res.data.id);
              store.commit('SET_USER_INFO', res.data);
              setStore('wawaji_tim_uid', res.data.tim_uid);
              setStore('wawaji_tim_sig', res.data.user_sig);
              next();
            } else {
              delCookie('wawaji_code');
              delCookie('wawaji_token');
              removeStore('wawaji_userInfo')
            }
          })
          .catch((err) => {
            console.log(err);
          })
      } else {
        console.log('已登录');
        next();
      }
    }
  })
}

//初始化微信分享
const wx = Vue.wechat;
Vue.prototype.wxShare = function (title = TITLE, desc = DESC, link = URL) {
  const url = encodeURIComponent(location.href.split('#')[0]);
  api.getSignature(url)
    .then((res) => {
      wx.config(res.data);
      wx.ready(() => {
        //分享朋友
        wx.onMenuShareAppMessage({
          title,
          desc,
          link,
          imgUrl: URL + 'static/img/logo.png',
          success: function () {
            store.commit('SET_SHOW_HIDE_DIALOG', false);
          },
          cancel: (() => {
            store.commit('SET_SHOW_HIDE_DIALOG', false);
          })
        })
        //朋友圈
        wx.onMenuShareTimeline({
          title,
          link,
          imgUrl: URL + 'static/img/logo.png',
          success: function () {
            store.commit('SET_SHOW_HIDE_DIALOG', false);
          },
          cancel: (() => {
            store.commit('SET_SHOW_HIDE_DIALOG', false);
          })
        })
        //分享QQ
        wx.onMenuShareQQ({
          title,
          desc,
          link,
          imgUrl: URL + 'static/img/logo.png',
          success: function () {
            store.commit('SET_SHOW_HIDE_DIALOG', false);
          },
          cancel: (() => {
            store.commit('SET_SHOW_HIDE_DIALOG', false);
          })
        })
        //分享到QQ空间
        wx.onMenuShareQZone({
          title,
          desc,
          link,
          imgUrl: URL + 'static/img/logo.png',
          success: function () {
            store.commit('SET_SHOW_HIDE_DIALOG', false);
          },
          cancel: (() => {
            store.commit('SET_SHOW_HIDE_DIALOG', false);
          })
        })
      })
    })
    .catch((err) => {
      console.log(err);
    })
};

//初始化IM消息
Vue.prototype._initIM = function () {
  let _this = this;
  let loginInfo = {
    'sdkAppID': SDK_APPID, //用户所属应用id,必填
    'appIDAt3rd': SDK_APPID, //用户所属应用id，必填
    'accountType': ACCOUNT_TYPE, //用户所属应用帐号类型，必填
    'identifier': "admin", //当前用户ID,必须是否字符串类型，选填
    'identifierNick': "null", //当前用户昵称，选填
    'userSig': getStore("wawaji_tim_sig"), //当前用户身份凭证，必须是字符串类型，选填
  };
  
  //监听事件
  const listeners = {
    "jsonpCallback": () => {
    }, //IE9(含)以下浏览器用到的jsonp回调函数,移动端可不填，pc端必填
    "onBigGroupMsgNotify": onBigGroupMsgNotify, //监听新消息(大群)事件，必填
    "onMsgNotify": () => {
    },//监听新消息(私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息)事件，必填
    "onGroupSystemNotifys": () => {
    }, //监听（多终端同步）群系统消息事件，必填
  };
  
  webim.login(loginInfo, listeners, {'isLogOn': false},
    function (identifierNick) {
      console.log('登录成功');
      webim.Log.info('webim登录成功');
      applyJoinBigGroup('0');
    },
    function (err) {
      console.log("error:", err.ErrorInfo);
    }
  );
  
  function applyJoinBigGroup(groupId) {
    let options = {
      'GroupId': groupId//群id
    };
    webim.applyJoinBigGroup(options, (resp) => {
        webim.Log.info('进群成功');
        console.log("进群成功:", groupId, resp);
      }, (err) => {
        alert(err.ErrorInfo);
      }
    );
  }
  
  function onBigGroupMsgNotify(msgList) {
    for (let i = msgList.length - 1; i >= 0; i--) { //遍历消息，按照时间从后往前
      const msg = msgList[i];
      //console.warn(msg);
      // this.msgList.push();
      webTimMsgNotify(msg);
      webim.Log.warn('receive a new avchatroom group msg: ' + msg.getFromAccountNick());
      //显示收到的消息
      // showMsg(msg);
    }
  }
  
  function webTimMsgNotify(msg) {
    try {
      if (msg) {
        console.log(msg);
        const bigMsg = msg;
        let _msg = msg.elems[0].content.text ? msg.elems[0].content.text : '';
        if (_msg.indexOf('{') == 0) {
          _msg = JSON.parse(escape2Html(_msg));
          switch (_msg.type) {
            case 12://滚动公告推送
              if (_msg.user_id != 0) {
                listenToNotice(_msg.new_notice);
              }
              break;
            case 19://滚动公告推送
              //_msg
              _this.$store.commit('SET_ROOM_LIST_STATUS', _msg);
              break;
            case 20://监听支付成功
              updateBaseInfo();
              break;
          }
        } else if (bigMsg.elems[0].type == 'TIMTextElem') {//聊天的
          alert('liaotian');
          this.msgList.push(bigMsg.elems[0].content.text);
        } else {
          console.log(bigMsg.elems[0]);
        }
      }
    } catch (e) {
      console.log("消息处理失败", e)
    }
  }
  
  function listenToNotice(data) {
    console.log(data);
    _this.$store.commit('SET_NOTICE_CENTER', {
      show: true,
      title: data.title,
      avatar: data.avatar_thumb
    })
    
    setTimeout(() => {
      _this.$store.commit('SET_NOTICE_CENTER', {
        show: false,
        title: '',
        avatar: ''
      });
    }, 3000)
  }
};

/* eslint-disable no-new */
new Vue({
  router,
  store,
  created() {
  },
  method: {
    ...mapMutations(['SET_USERINFO'])
  },
  compute: {
    ...mapState(['userInfo'])
  },
}).$mount('#app');
