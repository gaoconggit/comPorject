/*
* 金币不足
*
*/

<template>
  <transition-scale>
    <div class="less-coin">
      <div class="box">
        <div class="close" @click="closeLessCoin">
          <img src="~img/com_img/close.png" alt="">
        </div>
        <div class="less-coin-text">
          <p>金币不足了哟，快去充值吧~</p>
        </div>
        <div class="btn-wrapper">
          <div class="cancel" @click="invitationCodeGo"><p>邀请好友</p></div>
          <div class="recharge" @click="rechargeGo"><p>立即充值</p></div>
        </div>
      </div>
    </div>
  </transition-scale>
</template>

<script>
  import TransitionScale from "@/common/TransitionScale";

  export default {
    name: "LessCoin",
    methods: {
      closeLessCoin() {
        this.$emit('close-less-coin');
      },
      invitationCodeGo() {
        this.$emit('close-less-coin');
        // this.$router.push({path:''})
        console.log('我的邀请码路由');
      },
      rechargeGo() {
        this.$emit('close-less-coin');
        this.$router.push({path: '/recharge'})
      }
    },
    components: {TransitionScale}
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .less-coin {
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
      width: 540px;
      height: 485px;
      .background-url('~img/room/less_coin_bg.png');
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
        height: 200px;
      }
      .btn-wrapper {
        position: absolute;
        bottom: -50px;
        left: 30px;
        display: flex;
        justify-content: space-around;
        .cancel, .recharge {
          width: 240px;
          height: 96px;
          .background-url("~img/room/game_button_bg.png");
          text-align: center;
          line-height: 76px;
          font-size: @mainFontSize;
          color: @whiteColor;
        }
      }
    }
  }
</style>
