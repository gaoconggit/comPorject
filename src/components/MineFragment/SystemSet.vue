<!--
** 系统设置
-->

<template>
  <div class="system-wrapper">
    <title-bar class="title" title="设置"/>
    <group>
      <x-switch class="switch" title="背景音乐开关" :value="bgmusic" @on-change="setBgMusic"></x-switch>
      <x-switch class="switch" title="音效开关" :value="sound" @on-change="setSound"></x-switch>
    </group>
    <group>
      <cell class="switch" title="当前版本" value="2.2.0"></cell>
    </group>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {Group, XSwitch, Cell} from 'vux'
  import TitleBar from "@/common/TitleBar";
  import {showToast, updateBaseInfo} from "../../common/util/Utils";
  import api from "../../api/BaseService";

  export default {
    name: "SystemSet",
    data() {
      return {
        bgmusic: true,    //背景音
        sound: true,      //音效
      }
    },
    mounted() {
      if (this.userInfo.user_setting) {
        this.bgmusic = this.returnBool(this.userInfo.user_setting.bgmusic);
        this.sound = this.returnBool(this.userInfo.user_setting.yx);
      }
    },
    methods: {
      setBgMusic(newVal) {
        console.log(newVal)
        let type = newVal ? 1 : 2;
        api.fixBgmuisc(type)
          .then((result) => {
            this.$vux.loading.hide();
            if (result.code == 1) {
              updateBaseInfo();
              this.bgmusic = newVal;
              showToast(result.msg, 'success');
            } else {
              showToast("设置失败，请稍后重试", "cancel")
            }
          })
          .catch((err) => {
            console.log(err)
            this.$vux.loading.hide();
            showToast("设置失败，请稍后重试", "cancel")
          })
      },
      setSound(newVal) {
        console.log(newVal)
        let type = newVal ? 1 : 2;
        api.fixSound(type)
          .then((result) => {
            this.$vux.loading.hide();
            if (result.code == 1) {
              updateBaseInfo();
              this.sound = newVal;
              showToast(result.msg, 'success');
            } else {
              showToast("设置失败，请稍后重试", "cancel")
            }
          })
          .catch((err) => {
            console.log(err)
            this.$vux.loading.hide();
            showToast("设置失败，请稍后重试", "cancel")
          })
      },
      returnBool(num) {
        if (num == 1) {
          return true;
        }
        return false
      }
    },
    computed: {
      ...mapGetters(['userInfo']),
    },
    components: {TitleBar, Group, XSwitch, Cell}
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .system-wrapper {
    background-color: @lightGrayColor;
    .switch {
      height: 100px !important;
    }
  }
</style>
