// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueLazyload from "vue-lazyload";
import routes from './router/index';
import store from './store/';
import {routerMode} from "./config/config";
import {mapMutations, mapState} from "vuex";
import FastClick from 'fastClick';
import {LoadingPlugin, ToastPlugin, AlertPlugin} from 'vux';

Vue.use(VueLazyload);
Vue.use(LoadingPlugin);
Vue.use(ToastPlugin, {position: 'middle'});
Vue.use(AlertPlugin);

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
