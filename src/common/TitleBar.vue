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
  <div class="header" :class="{'white':!isWhiteBack}" :style="headerStyle" ref="titleHeader">
    <div class="header-left">
      <a class="header-back" :class="isWhiteBack?'white':'black'" @click.preventDefault @click="onClickBack"></a>
    </div>
    <h1 class="header-title" :class="{'left':left === 'left'}" :style="isWhiteBack?'color:#FFF':'color:#000'"
        @click="$emit('on-click-title')">
      <span>{{title}}</span>
    </h1>
    <slot name="right"></slot>
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
      left: {
        type: String,
        default: 'center'
      },
      headerStyle: String,
      isWhiteBack: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {};
    },
    mounted() {
      this.$nextTick(() => {
        this.getTitleHeight();
      });
    },
    methods: {
      onClickBack() {
        if (this.preventGoBack) {
          console.log(1);
          this.$emit("on-click-back");
        } else {
          this.$router ? this.$router.back() : window.history.back();
        }
      },
      getTitleHeight() {
        this.$emit('get-title-height', this.$refs.titleHeader.clientHeight);
      }
    }
  };
</script>

<style scoped lang="less">
  @import "../assets/style/index.less";

  .header {
    display: flex;
    align-items: center;
    padding: 6px 0;
    box-sizing: border-box;
    background-color: @mainColor;
    &.white {
      background-color: @whiteColor;
    }

    .header-title {
      flex: 1;
      line-height: 80px;
      text-align: center;
      font-size: 32px;
      font-weight: 400;
      color: #fff;
      height: 80px;
      width: auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &.left {
        padding-left: 20px;
        text-align: left;
      }
      span {
        margin-right: 60px;
      }
    }

    .header-left {
      width: 60px;
      height: 60px;
      .header-back {
        width: 100%;
        height: 100%;
        display: block;
        &.black {
          .background-url("~img/com_img/icon_bakc_black.png");
        }
        &.white {
          .background-url("~img/com_img/icon_bakc.png");
        }
      }
    }
  }
</style>
