<template>
    <div class="mine-wrapper">
        <title-bar class="title" title="我的" />
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
                <p class="item-icon max"><img src="~/img/mine/icon_coin.png" alt=""></p>
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
                <p class="item-title">我的积分 <span class="num">{{userInfo.coin}}</span></p>
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
import { mapGetters } from "vuex";
import TitleBar from "@/common/TitleBar";
export default {
  name: "MindIndex",
  data() {
    return {};
  },
  mounted() {},
  methods: {
    mineItem(item) {
      console.log("点击每个item:" + item);
      switch (item) {
        case 1:
          this.$router.push({ path: "/email" });
          break;
        case 2:
          this.$router.push({ path: "/recharge" });
          break;
        case 3:
          this.$router.push({ path: "/recharge" });
          break;
        case 4:
          this.$router.push({ path: "/recharge" });
          break;
        case 5:
          this.$router.push({ path: "/recharge" });
          break;
        case 6:
          this.$router.push({ path: "/recharge" });
          break;
        case 7:
          this.$router.push({ path: "/recharge" });
          break;
        case 8:
          this.$router.push({ path: "/recharge" });
          break;
        case 9:
          this.$router.push({ path: "/recharge" });
          break;
        case 10:
          this.$router.push({ path: "/vip" });
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
    // height: 468/2px;
    .mine-header {
      position: relative;
      top: 0;
      z-index: 2;
      width: 750/2px;
      height: 284/2px;
      .background-url("~img/mine/me_bg_1.png");
      .avatar {
        position: absolute;
        left: 142px;
        top: 44px;
        width: 72px;
        height: 72px;
        border-radius: 50%;
        border: 6px solid @auxColor;
        overflow: hidden;
        .img-spread;
      }
      .mail-icon {
        position: absolute;
        bottom: 4px;
        right: 40px;
        width: 100/2px;
        height: 100/2px;
        .img-spread;
      }
      .mail-icon-not {
        position: absolute;
        bottom: 40px;
        right: 40px;
        width: 32/2px;
        height: 43/2px;
        .img-spread;
      }
    }
    .mine-floor {
      position: relative;
      top: -110px;
      left: (750-710)/4px;
      z-index: 1;
      width: 710/2px;
      height: 320/2px;
      background-color: @whiteColor;
      border-radius: 20px;
      .mine {
        position: absolute;
        top: 109px;
        left: 138px;
        text-align: center;
        p {
          font-size: 14px;
          line-height: 20px;
          font-family: "微软雅黑";
        }
      }
    }
    .vip-card {
      position: relative;
      top: -156px;
      left: (750-710)/4px;
      width: 710/2px;
      height: 196/2px;
      .img-spread;
    }
  }
  .mine-item {
    position: relative;
    z-index: 1;
    margin: -104px 10px 0;
    .item {
      &:first-child {
        margin: 0;
        padding: 0;
      }
      margin: 8px 0;
      padding: 8px 0;
      display: flex;
      align-items: center;
      font-size: 16px;
      .item-icon {
        margin-right: 10px;
        width: 46/2px;
        height: 46/2px;
        &.max {
          width: 62/2px;
          height: 62/2px;
        }
        .img-spread;
      }
      .item-title {
        flex: 1;
        .over-ellip;
        .num {
          color: @mainColor;
          font-size: 14px;
          font-weight: 700;
        }
      }
      .item-text {
        padding: 6px 10px;
        background-color: @mainColor;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        color: @whiteColor;
      }
      .item-go {
        width: 40/2px;
        height: 40/2px;
        transform: rotate(180deg);
        .img-spread;
      }
    }
  }
}
</style>
