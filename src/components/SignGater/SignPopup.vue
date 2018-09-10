<!--
** 签到弹窗
-->

<template>
  <transition-scale>
    <div class="sign-wrapper" style="z-index: 20;"></div>
  </transition-scale>
</template>

<script>
  import TransitionScale from "@/common/TransitionScale";

  export default {
    name: "sign-popup",
    components: {TransitionScale}
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .sign-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: @bgOpacity;
  }
</style>
