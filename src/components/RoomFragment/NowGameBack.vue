<template>
  <transition-scale>
    <div class="back-room">
      <div class="box">
        <p class="desc">游戏中，你去定要退出吗！！！</p>
        <div class="btn-wrapper">
          <p class="left" @click="backCancel">取消</p>
          <p class="right" @click="backConfirm">确定</p>
        </div>
      </div>
    </div>
  </transition-scale>
</template>

<script>
  import TransitionScale from "@/common/TransitionScale";

  export default {
    name: "NowGameBack",
    methods: {
      backCancel() {
        this.$emit('back-cancel')
      },
      backConfirm() {
        this.$emit('back-confirm')
      }
    },
    components: {TransitionScale}
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .back-room {
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
      display: flex;
      flex-direction: column;
      width: 600px;
      height: 300px;
      -webkit-border-radius: 20px;
      -moz-border-radius: 20px;
      border-radius: 20px;
      background-color: @whiteColor;
      .desc {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        color: red;
        font-size: 34px;
      }
      .btn-wrapper {
        display: flex;
        height: 80px;
        text-align: center;
        p {
          flex: 1;
          height: 100%;
          line-height: 80px;
          border: 1px solid @grayColor;
          &.left {
            border-bottom-left-radius: 20px;
          }
          &.right {
            border-bottom-right-radius: 20px;
          }
        }
      }
    }
  }
</style>
