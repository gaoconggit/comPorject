// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import routes from './router';
import store from './store';
import { routerMode } from "./config/config";
import FastClick from 'fastClick';
import VueLazyload from 'vue-lazyload';
import { LoadingPlugin, ToastPlugin, AlertPlugin } from 'vux';

Vue.use(LoadingPlugin);
Vue.use(ToastPlugin, { position: 'middle' });
Vue.use(AlertPlugin);
Vue.use(VueLazyload);

Vue.use(VueLazyload, {
  error: require('./assets/img/home/lazyload.png'),
  loading: require('./assets/img/home/lazyload.png'),
  try: 3 // default 1
})

Vue.config.productionTip = false;

FastClick.attach(document.body);

Vue.use(VueRouter);
const router = new VueRouter({
  routes,
  node: routerMode,
  strict: process.env.NODE_ENV !== 'production',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop;
      }
      return { x: 0, y: to.meta.savedPosition || 0 }
    }
  }
});

/* eslint-disable no-new */
new Vue({
  store,
  router,
  components: { App },
  template: '<App/>'
}).$mount('#app');
