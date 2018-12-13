<!--
** 转盘
-->

<template>
  <div class="earn-details">
    <div class="close" @click="$router.back()"><img src="~/img/com_img/close_back.png" alt=""></div>
    <iframe width="100%" height="100%" v-if="production"
            :src="'../../../../static/web/wheel/index.html' + $route.query.url"></iframe>
    <iframe width="100%" height="100%" v-else :src="'./static/web/wheel/index.html' + $route.query.url"></iframe>
  </div>
</template>

<script>
  import {showToast, updateBaseInfo} from "../../../common/util/Utils";

  export default {
    name: "WheelSurf",
    data() {
      return {
        production: process.env.NODE === 'production' ? true : false
      }
    },
    mounted() {
      window.postMessage = (e) => {
        console.log(e);
        if (e === "Zhuanpan") {
          updateBaseInfo();
        } else if (e === "ZhuanpanError") {
          showToast('转盘信息获取失败', 'cancel');
        } else if (e == "-100") {
          showToast('金币不足', 'cancel');
        }
      };
    }
  }
</script>

<style scoped lang="less">
  .earn-details {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    .close {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
