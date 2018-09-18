<template>
  <div>
    <transition name="router-fade" mode="out-in">
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
  import VConsole from "vconsole";
  import {mapMutations} from "vuex";
  import api from "api/BaseService";
  import {delCookie, getCookie, getStore, removeStore, setStore} from "./common/util/ImUtils";

  export default {
    name: "App",
    created() {
      this._getToken();
      this.wxShare();
    },
    mounted() {
      //new VConsole();
    },
    methods: {
      ...mapMutations({
        set_token: "SET_TOKEN",
        set_uid: "SET_UID",
        set_userInfo: "SET_USER_INFO"
      }),
      _getToken() {
        let token = getCookie('wawaji_token') || "9bdd822e03292069171cd3f36ad84361";
        let uid = getStore("wawaji_uid") || "100185";
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
      }
    }
  };
</script>

<style lang="less">
  .router-fade-enter-active,
  .router-fade-leave-active {
    transition: all 0.3s;
  }

  .router-fade-enter,
  .router-fade-leave-active {
    opacity: 0;
  }
</style>
