<!--template是声明模板元素，可以使html标签在js中使用，可以在任意位置上使用。
childNodes无效性如果非得获取“伪子元素”，要使用content属性
-->
<template>
  <div>
    <div class="root-notice" v-if="isNotice" style="z-index: 10000">
      <div class="avatar"><img :src="noticeCenter.avatar" alt=""></div>
      <p class="text">{{noticeCenter.title}}</p>
    </div>
    <!--使用transition完成任何元素进入/离开的过渡组件-->
    <transition name="router-fade" mode="out-in">
      <!--vue实例 组件-->
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition :name="$route.meta.anima?'':'router-fade'" mode="out-in">
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from "vuex";
  import api from "api/BaseService";
  import {delCookie, escape2Html, getCookie, getStore, removeStore, setStore} from "./common/util/ImUtils";
  import {SDK_APPID, ACCOUNT_TYPE} from "./config/config";
  import {updateBaseInfo} from "./common/util/Utils";

  const webim = newWebIm();

  export default {
    name: "App",
    data() {
      return {
        roomId: '',
        gameId: '',
        tim_sig: getStore('wawaji_tim_sig'),
        tim_uid: getStore('wawaji_tim_sig'),
        msgType: '',
        isBeginSendMsg: false,
        isNotice: false,
        isAgainLogin: false,
        timer: null,        //延迟登录IM
      }
    },
    created() {
      this._getToken();
      this.wxShare();
    },
    mounted() {
      //this.isBeginSendMsg = new Date().getTime();//IM需要监听发生变化
      console.log('APP Page');
      this.roomId = 0;
      if (this.$route.path !== '/room') {
        this.$nextTick(() => {
          this._initIM();
        })
      }
    },
    watch: {
      noticeCenter() {
        this.isNotice = this.noticeCenter.show;
      },
      $route(to, from) {
        console.log(to, from);
        if (from.path === '/room') {
          console.log("从房间中退出来");
          this.timer = setTimeout(() => {
            //this._initIM();
          }, 1000);
        }
        if (to.path === '/room') {
          clearInterval(this.timer);
          this.timer = null;
        }
      }
    },
    methods: {
      ...mapMutations({
        set_token: "SET_TOKEN",
        set_uid: "SET_UID",
        set_userInfo: "SET_USER_INFO",
        set_noticeCenter: "SET_NOTICE_CENTER",
      }),
      _getToken() {
        let token = getCookie('wawaji_token') || "05045c4b1cc059fcdd284a0eec5acafe";
        let uid = getStore("wawaji_uid") || "100196";
        this.set_uid(uid);
        this.set_token(token);
        this._getBaseInfo();
        setInterval(() => {
          this._postOnline();
        }, 60000)
      },
      async _getBaseInfo() {
        let result = await api.getBaseInfo(true);
        if (result.code == 1) {
          this.set_userInfo(result.data);
        } else {
          console.log("获取个人信息", result);
          delCookie('wawaji_code');
          delCookie('wawaji_token');
          removeStore('wawaji_userInfo')
        }
      },

      //发送心跳
      _postOnline() {
        api.postOnline();
      },
    },
    computed: {...mapGetters(['noticeCenter'])},
    destroyed() {

    }
  };
</script>

<style lang="less">
  .root-notice {
    padding: 10px 20px;
    position: absolute;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, .4);
    border-radius: 50px;
    z-index: 10000;
    .avatar {
      float: left;
      width: 70px;
      height: 70px;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
      overflow: hidden;
      vertical-align: middle;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .text {
      margin-left: 10px;
      color: #FFF;
      font-size: 30px;
      font-weight: 600;
    }
  }

  .router-fade-enter-active,
  .router-fade-leave-active {
    transition: all 0.3s;
  }

  .router-fade-enter,
  .router-fade-leave-active {
    opacity: 0;
  }
</style>
