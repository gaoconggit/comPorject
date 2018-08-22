<!--
**  公用TiTleBar
**  headerStyle   Object   header背景样式
**  isWhiteBack   Boolean  返回按钮为白色还是灰色
**  title         String   标题文字
**  preventGoBack Boolean  点击返回是否生效
##  example
    <title-bar
      title="我是标题"
      :is-white-back="false"
      :header-style="{backgroundColor:'#FFF'}"
      :preventGoBack="true"
      @on-click-back="onClickBack"/>
##
-->
<template>
  <div class="header" :style="headerStyle">
    <div class="header-left">
      <a class="header-back" :class="isWhiteBack?'white':'black'" @click.preventDefault @click="onClickBack"></a>
    </div>
    <h1 class="header-title" :style="isWhiteBack?'color:#FFF':'color:#000'" @click="$emit('on-click-title')">
      <span>{{title}}</span>
    </h1>
  </div>
</template>

<script>
  export default {
    name: "VHeader",
    props: {
      title: {
        type: String,
        default: "掌上抓娃娃"
      },
      preventGoBack: {
        type: Boolean,
        default: false
      },
      headerStyle: Object,
      isWhiteBack: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {}
    },
    methods: {
      onClickBack() {
        if (this.preventGoBack) {
          console.log(1);
          this.$emit('on-click-back')
        } else {
          this.$router ? this.$router.back() : window.history.back()
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../assets/style/index.less";

  .header {
    position: relative;
    padding: 3px 0;
    box-sizing: border-box;
    background-color: @mainColor;

    .header-title {
      line-height: 40px;
      text-align: center;
      font-size: 18px;
      font-weight: 400;
      color: #FFF;
      margin: 0 88px;
      height: 40px;
      width: auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      span {
        display: inline-block;
      }
    }

    .header-left {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      font-size: 14px;
      line-height: 21px;
    }

    .header-left {
      .header-back {
        position: absolute;
        top: 0;
        width: 40px;
        height: 40px;
        background-image: url("../assets/img/com_img/icon_bakc.png");
        background-size: auto 100%;
        background-repeat: no-repeat;
        &.black {
          background-image: url("../assets/img/com_img/icon_bakc_black.png");
        }
        &.white {
          background-image: url("../assets/img/com_img/icon_bakc.png");
        }
      }
    }
  }
</style>
