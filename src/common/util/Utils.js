/*
*   常用函数
* */
import Vue from 'vue';
import {ToastPlugin} from 'vux';

Vue.use(ToastPlugin);
let vm = new Vue();
/*封装toast*/
export const showToast = (text, type = 'text', time = 2000, width = '7.6em', position = 'middle') => {
  vm.$vux.toast.show({
    type,
    position,
    text,
    time,
    width,
  })
};

export const clickSwriperItem = () => {

};
