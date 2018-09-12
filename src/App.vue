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
  import {mapMutations} from "vuex";
  import api from "api/BaseService";
  import {getCookie, getStore, setStore} from "./common/util/ImUtils";

  export default {
    name: "App",
    created() {
      this._getToken();
    },
    methods: {
      ...mapMutations({
        set_token: "SET_TOKEN",
        set_uid: "SET_UID",
        set_userInfo: "SET_USER_INFO"
      }),
      _getToken() {
        let token = getCookie('wawaji_token') || "a1960558963cdef71fefb224614d868d";
        let uid = getStore("wawaji_uid") || "100180";
        this.set_uid(uid);
        this.set_token(token);
        this._getBaseInfo();
        setInterval(() => {
          this._postOnline();
        }, 60000)
      },
      async _getBaseInfo() {
        let result = await api.getBaseInfo();
        window.localStorage.setItem("wawaji_userInfo", JSON.stringify(result.data));
        this.set_userInfo(result.data);
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
