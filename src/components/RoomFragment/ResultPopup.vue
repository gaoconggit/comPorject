<template>
  <transition-scale>
    <div class="result-popup">
      <div class="box-fail" v-if="!resultType">
        <div class="close" @click="closeResultPopup">
          <img src="~img/com_img/close.png" alt="">
        </div>
        <div class="less-coin-text">
          <p>再玩{{isBaosong}}局即可保送</p>
          <p>（{{expireTime}}）</p>
        </div>
        <div class="btn-wrapper">
          <div class="cancel" @click="againGame"><p>在玩一局（{{countDownResult}}）</p></div>
        </div>
      </div>
      <div class="box-success" v-if="resultType">
        <div class="close" @click="closeResultPopup">
          <img src="~img/com_img/close.png" alt="">
        </div>
        <div class="less-coin-text">
          <div class="gift-bg" v-if="!isNewRoom">
            <img class="gift-coin" :src="getGiftIcon" alt="">
          </div>
          <div class="new-room" v-if="isNewRoom"><p>太厉害了，晋级成功！新手场，白白！</p></div>
          <div class="btn-wrapper success" v-if="!isNewRoom">
            <div class="cancel" @click="againGame"><p>在玩一局（{{countDownResult}}）</p></div>
            <div class="cancel" @click="showShare"><p>炫耀一下</p></div>
          </div>
          <div class="btn-wrapper success" v-if="isNewRoom">
            <div class="cancel" @click="newRoomSure"><p>确定</p></div>
          </div>
        </div>
      </div>
    </div>
  </transition-scale>
</template>

<script>
  import TransitionScale from "@/common/TransitionScale";

  export default {
    name: "resultPopup",
    props: ['isNewRoom', 'isBaosong', 'resultType', 'expireTime', 'countDownResult', 'getGiftIcon'],
    methods: {
      closeResultPopup() {
        this.$emit("close-result-popup");
      },
      againGame() {
        console.log("再来一局");
      },
      showShare() {
        console.log("炫耀一下");
      },
      newRoomSure(){
        console.log("新手房间退出");
      }
    },
    components: {TransitionScale}
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .result-popup {
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
    .box-success {
      position: relative;
      width: 540px;
      height: 648px;
      .background-url('~img/room/game_catch_success.png');
      .gift-bg {
        margin: 38px auto 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 300px;
        height: 300px;
        .background-url('~img/room/game_success_wawa_bg.png');
        .gift-coin {
          width: 216px;
          height: 276px;
        }
      }
      .new-room{
        margin-top: 100px;
        color: #000;
        font-size: @maxFontSize;
        font-weight: 700;
      }
    }
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
      &.success {
        bottom: -80px;
      }
      .cancel {
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
