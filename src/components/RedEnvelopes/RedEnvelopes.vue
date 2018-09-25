<template>
  <div class="Red-data">
    <title-bar title="我的红包" class="title"/>
    <div class="Red-content">
      <header class="Red-header">
        <img src="../../assets/img/envelopes/header_bg.png" alt="">
      </header>
    </div>
  </div>
</template>

<script>
  import TitleBar from "../../common/TitleBar";
    export default {
      components: {TitleBar},
        name: "RedEnvelopes"
    }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";
  .Red-data{
    .img-style {
      width: 100%;
      height: 100%;
    }
    .Red-content{
      width:100%;
      .Red-header{
        width:100%;
        height: 220px;
        background:#888888;
      }
    }
  }
</style>
