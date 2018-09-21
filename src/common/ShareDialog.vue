<!--
** 分享展示灰色背景
-->

<template>
  <transition name="vux-mask">
    <div class="dialog-mask" @click="onHide">
      <div class="img"><img src="~/img/share/wxshare.png" alt=""></div>
    </div>
  </transition>
</template>

<script>
  import {XDialog} from "vux";

  export default {
    name: "ShareDialog",
    props: ['showHideDialog'],
    methods: {
      onHide() {
        this.isShow = false;
        this.$emit('on-hide');
      }
    },
    components: {XDialog}
  }
</script>

<style scoped lang="less">
  .dialog-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .5);
    z-index: 10;
    .img {
      position: absolute;
      top: 0;
      right: 0;
      width: 250px;
      height: 250px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
