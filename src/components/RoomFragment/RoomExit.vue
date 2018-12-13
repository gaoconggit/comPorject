<template>
  <transition-scale>
    <div class="exit-popup">
      <div class="box-fail">
        <div class="close" @click="closeExitPopup">
          <img src="~img/com_img/close.png" alt="">
        </div>
        <div class="less-coin-text">
          <p>此房间再玩{{data.baosong_remain_count}}局，</p>
          <p>系统免费赠送{{name}}</p>
          <p>(到期时间:{{data.baosong_expire_time_str}})</p>
        </div>
        <div class="btn-wrapper">
          <div class="btn confirm" @click="closeExitPopup"><p>继续游戏</p></div>
          <div class="btn cancel" @click="exitRoom" v-if="!isNewRoom"><p>离开房间</p></div>
        </div>
      </div>
    </div>
  </transition-scale>
</template>

<script>
  import TransitionScale from "@/common/TransitionScale"

  export default {
    name: "RoomExit",
    props: ['data', 'name', 'isNewRoom'],
    methods: {
      exitRoom() {
        this.$emit('exit-room');
      },
      closeExitPopup() {
        this.$emit('close-exit-popup');
      }
    },
    components: {TransitionScale}
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .exit-popup {
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
    .box-fail {
      position: relative;
      width: 540px;
      height: 486px;
      .background-url('~img/room/game_catch_fail.png');
    }
    .close {
      position: absolute;
      right: -12px;
      top: 120px;
      width: 60px;
      height: 60px;
      .img-spread;
    }
    .less-coin-text {
      padding: 0 50px;
      position: absolute;
      top: 220px;
      left: 0;
      right: 0;
      height: 400px;
      line-height: 46px;
      text-align: center;
    }
    .btn-wrapper {
      position: absolute;
      bottom: -50px;
      left: 30px;
      right: 30px;
      display: flex;
      justify-content: space-around;
      .btn {
        width: 240px;
        height: 96px;
        .background-url("~img/room/game_button_bg.png");
        text-align: center;
        line-height: 76px;
        font-size: @subFontSize;
        color: @whiteColor;
      }
    }
  }
</style>
