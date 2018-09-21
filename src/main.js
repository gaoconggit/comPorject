// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueLazyload from "vue-lazyload";
/*各种页面的路由地址*/
import routes from './router/index';
import store from './store/';
import {APPID, DESC, routerMode, TITLE, URL} from "./config/config";
import {mapMutations, mapState} from "vuex";
import FastClick from 'fastClick';
import {LoadingPlugin, ToastPlugin, AlertPlugin, WechatPlugin} from 'vux';
import {delCookie, getCookie, getQueryString, removeStore, setCookie, setStore} from './common/util/ImUtils';
import api from "./api/BaseService";

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
  listenEvents: ['scroll'],
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
