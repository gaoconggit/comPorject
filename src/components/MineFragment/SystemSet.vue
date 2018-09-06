<!--
** 系统设置
-->

<template>
  <div class="system-wrapper">
    <title-bar class="title" title="设置"/>
    <group>
      <x-switch prevent-default class="switch" title="背景音乐开关" v-model="bgmusic" @on-click="bgmusicChange"></x-switch>
      <x-switch prevent-default class="switch" title="音效开关" v-model="sound" @on-click="yxChange"></x-switch>
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
    watch: {
      userInfo() {
        console.log(this.userInfo);
        this.bgmusic = this.returnBool(this.userInfo.user_setting.bgmusic);
        this.sound = this.returnBool(this.userInfo.user_setting.yx);
      }
    },
    methods: {
      bgmusicChange(newVal, oldVal) {
        console.log(newVal);
        this.$vux.loading.show({text: '设置中...'})
        let type = 0;
        if (newVal) {
          type = 1;
        } else {
          type = 2;
        }
        api.fixBgmuisc(type)
          .then((result) => {
            this.$vux.loading.hide();
            if (result.code == 1) {
              updateBaseInfo();
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
      yxChange(newVal, oldVal) {
        console.log(newVal);
        this.$vux.loading.show({text: '设置中...'})
        let type = 0;
        if (newVal) {
          type = 1;
        } else {
          type = 2;
        }
        api.fixSound(type)
          .then((result) => {
            this.$vux.loading.hide();
            if (result.code == 1) {
              updateBaseInfo();
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
