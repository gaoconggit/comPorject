<template>
  <div class="mine-wrapper">
    <title-bar class="title" title="我的"/>
    <div class="mine-content" ref="mineContent">
      <header class="mine-header" ref="mineHeader">
        <div class="avatar">
          <img :src="userInfo.avatar" alt="">
        </div>
        <div class="mail-icon" @click="mineItem(1)">
          <img src="~/img/mine/message.png" alt="">
        </div>
        <div v-if="Number(userInfo.noread)" class="mail-icon-not" @click.stop="mineItem(1)">
          <img src="~/img/mine/message_unread.png" alt="">
        </div>
      </header>
      <div class="mine-floor" ref="mineFloor">
        <div class="mine">
          <p class="name">{{userInfo.user_nicename}}</p>
          <p class="id">ID：{{userInfo.id}}</p>
        </div>
      </div>
      <div class="vip-card" @click="mineItem(10)">
        <img src="~/img/mine/me_bg_3.png" alt="">
      </div>
    </div>
    <div class="mine-item">
      <div class="item" @click="mineItem(2)">
        <p class="item-icon max"><img src="~/img/com_img/icon_coin.png" alt=""></p>
        <p class="item-title">我的金币 <span class="num">{{userInfo.coin}}</span></p>
        <p class="item-text">充值</p>
      </div>
      <div class="item" @click="mineItem(3)">
        <p class="item-icon max"><img src="~/img/mine/icon_detailed.png" alt=""></p>
        <p class="item-title">金币明细</p>
        <p class="item-go"><img src="~/img/com_img/icon_bakc_black.png" alt=""></p>
      </div>
      <div class="item" @click="mineItem(4)">
        <p class="item-icon max"><img src="~/img/mine/icon_mine.png" alt=""></p>
        <p class="item-title">我的娃娃</p>
        <p class="item-go"><img src="~/img/com_img/icon_bakc_black.png" alt=""></p>
      </div>
      <div class="item" @click="mineItem(5)">
        <p class="item-icon max"><img src="~/img/mine/icon_integral.png" alt=""></p>
        <p class="item-title">我的积分 <span class="num">{{userInfo.score}}</span></p>
        <p class="item-go"><img src="~/img/com_img/icon_bakc_black.png" alt=""></p>
      </div>
      <div class="item" @click="mineItem(6)">
        <p class="item-icon max"><img src="~/img/mine/icon_problem.png" alt=""></p>
        <p class="item-title">常见问题</p>
        <p class="item-go"><img src="~/img/com_img/icon_bakc_black.png" alt=""></p>
      </div>
      <div class="item" @click="mineItem(7)">
        <p class="item-icon max"><img src="~/img/mine/icon_invitation.png" alt=""></p>
        <p class="item-title">我的邀请码</p>
        <p class="item-go"><img src="~/img/com_img/icon_bakc_black.png" alt=""></p>
      </div>
      <div class="item" @click="mineItem(8)">
        <p class="item-icon max"><img src="~/img/mine/icon_input.png" alt=""></p>
        <p class="item-title">输入邀请码</p>
        <p class="item-go"><img src="~/img/com_img/icon_bakc_black.png" alt=""></p>
      </div>
      <div class="item" @click="mineItem(9)">
        <p class="item-icon max"><img src="~/img/mine/icon_set.png" alt=""></p>
        <p class="item-title">设置</p>
        <p class="item-go"><img src="~/img/com_img/icon_bakc_black.png" alt=""></p>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import TitleBar from "@/common/TitleBar";

  export default {
    name: "MindIndex",
    data() {
      return {};
    },
    mounted() {
    },
    methods: {
      mineItem(item) {
        console.log("点击每个item:" + item);
        switch (item) {
          case 1://我的信息
            this.$router.push({path: "/email"});
            break;
          case 2://我的金币
            this.$router.push({path: "/recharge"});
            break;
          case 3://金币明细
            this.$router.push({path: "/coin"});
            break;
          case 4://我的娃娃
            this.$router.push({path: "/mywawa"});
            break;
          case 5://积分明细
            this.$router.push({path: "/score"});
            break;
          case 6://常见问题
            this.$router.push({path: "/faq"});
            break;
          case 7://我的邀请码
            this.$router.push({path: "/invitation"});
            break;
          case 8://输入邀请码
            this.$router.push({path: "/invitationinput"});
            break;
          case 9://设置
            this.$router.push({path: "/system"});
            break;
          case 10://vip
            this.$router.push({path: "/vip"});
            break;
        }
      }
    },
    computed: {
      ...mapGetters(["userInfo"])
    },
    components: {
      TitleBar
    }
  };
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .mine-wrapper {
    background: linear-gradient(to bottom, @mainColor 5%, #fff 50%);
    .title {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 10;
    }
    .mine-content {
      position: relative;
      top: @titleBarHeight;
      // height: 468px;
      .mine-header {
        position: relative;
        top: 0;
        z-index: 2;
        width: 750px;
        height: 284px;
        .background-url("~img/mine/me_bg_1.png");
        .avatar {
          position: absolute;
          left: 284px;
          top: 88px;
          width: 144px;
          height: 144px;
          border-radius: 50%;
          border: 12px solid @auxColor;
          overflow: hidden;
          .img-spread;
        }
        .mail-icon {
          position: absolute;
          bottom: 12px;
          right: 80px;
          width: 100px;
          height: 100px;
          .img-spread;
        }
        .mail-icon-not {
          position: absolute;
          bottom: 80px;
          right: 80px;
          width: 32px;
          height: 43px;
          .img-spread;
        }
      }
      .mine-floor {
        position: relative;
        top: -220px;
        left: (750-710)/2px;
        z-index: 1;
        width: 710px;
        height: 320px;
        background-color: @whiteColor;
        border-radius: 40px;
        .mine {
          position: absolute;
          top: 218px;
          left: 276px;
          text-align: center;
          p {
            font-size: @subFontSize;
            line-height: 40px;
          }
        }
      }
      .vip-card {
        position: relative;
        top: -312px;
        left: (750-710)/2px;
        width: 710px;
        height: 196px;
        .img-spread;
      }
    }
    .mine-item {
      position: relative;
      z-index: 1;
      margin: -208px 20px 0;
      .item {
        &:first-child {
          margin: 0;
          padding: 0;
        }
        margin: 16px 0;
        padding: 16px 0;
        display: flex;
        align-items: center;
        font-size: @subFontSize;
        .item-icon {
          margin-right: 20px;
          width: 46px;
          height: 46px;
          &.max {
            width: 62px;
            height: 62px;
          }
          .img-spread;
        }
        .item-title {
          flex: 1;
          .over-ellip;
          .num {
            color: @mainColor;
            font-size: @subFontSize;
            font-weight: 700;
          }
        }
        .item-text {
          padding: 12px 20px;
          background-color: @mainColor;
          border-radius: 20px;
          font-size: @subFontSize;
          font-weight: 600;
          color: @whiteColor;
        }
        .item-go {
          width: 40px;
          height: 40px;
          transform: rotate(180deg);
          .img-spread;
        }
      }
    }
  }
</style>
