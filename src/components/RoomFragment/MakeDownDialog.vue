<!--
** 轮到自己弹窗
-->

<template>
  <transition-scale>
    <div class="mask-down-dialog">
      <div class="box">
        <div class="center">
          <p>到你抓娃娃了~</p>
          <p><span class="num">{{makeCountDown}}</span>s</p>
        </div>
        <div class="btn-wrapper">
          <p class="btn cancel" @click="cancel">取消</p>
          <p class="btn confirm" @click="confirm">立即开始</p>
        </div>
      </div>
    </div>
  </transition-scale>
</template>

<script>
  import TransitionScale from "@/common/TransitionScale";

  export default {
    name: "MakeDownDialog",
    props: ['makeCountDown'],
    methods:{
      cancel(){
        this.$emit('mask-cancel')
      },
      confirm(){
        this.$emit('mask-confirm')
      }
    },
    components: {TransitionScale}
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  @bottomHeight: 100px;

  .mask-down-dialog {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 10;
    background-color: @bgOpacity;
    display: flex;
    align-items: center;
    justify-content: center;
    .box {
      position: relative;
      width: 600px;
      height: 400px;
      border-top-right-radius: 20px;
      border-top-left-radius: 20px;
      background-color: @whiteColor;
      .center {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 400-@bottomHeight;
        p {
          font-size: @maxFontSize;
          line-height: 50px;
          .num{
            font-size: 50px;
            line-height: 60px;
          }
        }
      }
      .btn-wrapper {
        position: absolute;
        bottom: 0;
        display: flex;
        width: 100%;
        height: @bottomHeight;
        line-height: @bottomHeight;
        .btn {
          flex: 1;
          text-align: center;
          color: @whiteColor;
          &.cancel {
            background-color: @grayColor;
          }
          &.confirm {
            background-color: #86D8FE;
          }
        }
      }
    }
  }
</style>
