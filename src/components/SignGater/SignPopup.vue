<!--
** 签到弹窗
-->

<template>
  <transition-scale>
    <div class="sign-wrapper" style="z-index: 3;">
      <div class="box">
        <div class="header-title"><img src="~/img/sign/title_sign.png" alt=""></div>
        <div class="content">
          <div class="sign-item" v-for="item in signArray">
            <p class="add-coin">+{{item.add_gold}}</p>
            <div class="jb-icon"><img :src="item.img" alt=""></div>
            <div class="mask-icon" v-if="item.complete"><img src="~/img/sign/sign_complete.png" alt=""></div>
            <div class="vip-icon" v-if="vipLevel"><img src="~/img/sign/vip.png" alt=""></div>
            <p class="day">{{item.text}}</p>
          </div>
        </div>
        <div class="receive-btn" @click="receiveSign"><p>领取</p></div>
      </div>
    </div>
  </transition-scale>
</template>

<script>
  import TransitionScale from "@/common/TransitionScale";
  import {showToast} from "../../common/util/Utils";
  import api from "../../api/BaseService";

  export default {
    name: "sign-popup",
    props: ['data'],
    data() {
      return {
        signArray: [                //初始化签到信息
          {"text": "第一天", "img": require("img/sign/jb_1.png"), "complete": 1, "add_gold": 5},
          {"text": "第二天", "img": require("img/sign/jb_1.png"), "complete": 1, "add_gold": 5},
          {"text": "第三天", "img": require("img/sign/jb_2.png"), "complete": 1, "add_gold": 10},
          {"text": "第四天", "img": require("img/sign/jb_2.png"), "complete": 1, "add_gold": 10},
          {"text": "第五天", "img": require("img/sign/jb_3.png"), "complete": 0, "add_gold": 20},
          {"text": "第六天", "img": require("img/sign/jb_3.png"), "complete": 0, "add_gold": 20},
          {"text": "第七天", "img": require("img/sign/jb_4.png"), "complete": 1, "add_gold": 50}
        ],
        vipLevel: 0,
      }
    },
    mounted() {
      this.vipLevel = parseInt(this.data.vip_level);
      let list = this.data.reward_list;
      let arr = this.signArray;
      arr.forEach((v, i) => {
        if (i < this.data.cont_days - 1) {
          v.complete = 1;
        } else {
          v.complete = 0;
        }
        v.add_gold = list[i].coin;
      });
      this.signArray = arr;
    },
    methods: {
      //签到信息
      async _getSignInfo() {
        let result = await api.getSignInfo();
        console.log("getSignInfo", result);
        let arr = this.signArray;
        arr.forEach((v, i) => {
          if (result.data.has_sign_in) {
            if (i < this.data.cont_days) {
              v.complete = 1;
            } else {
              v.complete = 0;
            }
          }
        });
        this.signArray = arr;
      },
      async receiveSign() {
        console.log("领取签到");
        let result = await api.postSign();
        if (result.code == 1) {
          console.log(result);
          showToast(result.msg + '领取' + result.data.coin + '金币', 'success');
          this._getSignInfo();
        } else {
          showToast(result.msg, 'cancel');
        }
        setTimeout(() => {
          this.$emit('sign-complete');
        }, 2000);
      }
    },
    components: {TransitionScale}
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .sign-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: @bgOpacity;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .box {
      position: relative;
      .header-title {
        margin: 0 auto;
        width: 533px;
        height: 251px;
        .img-spread;
      }
      .content {
        box-sizing: border-box;
        padding: 40px 10px 80px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        margin-top: -60px;
        width: 640px;
        height: 480px;
        .background-url("~img/sign/bg_floor.png");
        .sign-item {
          position: relative;
          width: 130px;
          height: 130px;
        }
        .add-coin {
          position: absolute;
          top: -10px;
          left: -20px;
          right: 0;
          text-align: center;
          color: #F0D63A;
          font-weight: 500;
          font-size: @mainColor;
          text-shadow: 1px 1px 3px @grayColor;
          z-index: 3;
        }
        .jb-icon {
          position: absolute;
          top: 0;
          left: 0;
          width: 116px;
          height: 116px;
          .img-spread;
        }
        .mask-icon {
          position: absolute;
          top: 0;
          left: 0;
          width: 116px;
          height: 118px;
          z-index: 4;
          .img-spread;
        }
        .vip-icon {
          position: absolute;
          bottom: 10px;
          left: 0;
          right: 0;
          width: 92px;
          height: 32px;
          .img-spread;
        }
        .day {
          position: absolute;
          bottom: -20px;
          left: -10px;
          right: 0;
          text-align: center;
          font-size: @minFontSize;
        }
      }
      .receive-btn {
        margin: -54px auto 0;
        width: 324px;
        height: 128px;
        line-height: 90px;
        font-size: @mainFontSize;
        font-weight: 500;
        text-align: center;
        color: @whiteColor;
        .background-url("~img/sign/button.png");
      }
    }
  }
</style>
