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
        let _this = this;
        this.set_token("175b73bc11eac4334ea693fde7e9cad2");
        this.set_uid("100177");
        setTimeout(() => {
          _this._getBaseInfo();
        }, 0);
      },
      async _getBaseInfo() {
        // if (!window.localStorage.getItem("wawaji_userInfo")) {
        let result = await api.getBaseInfo();
        console.log(result);
        window.localStorage.setItem("wawaji_userInfo", JSON.stringify(result.data));
        this.set_userInfo(result.data);
        //}
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
