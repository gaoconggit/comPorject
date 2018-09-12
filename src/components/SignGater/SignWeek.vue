<!--
** 周卡签到
-->

<template>
  <TransitionScale>
    <div class="sign-wrapper" style="z-index: 3;">
      <div class="box">
        <div class="header-title"><img :src="titleImg" alt=""></div>
        <div class="content">
          <p>{{descText}}</p>
          <p>剩余{{remainDay}}天</p>
          <div class="card-img"><img :src="cardImg" alt=""></div>
        </div>
        <div class="receive-btn" @click="receiveSign"><p>领取</p></div>
      </div>
    </div>
  </TransitionScale>
</template>

<script>
  import TransitionScale from "@/common/TransitionScale";
  import {showToast} from "../../common/util/Utils";
  import api from "../../api/BaseService";

  export default {
    name: "SignWeek",
    props: ['data'],
    data() {
      return {
        cardId: 0,           //卡的ID
        titleImg: '',        //卡的名称
        cardImg: '',         //卡的缩略图
        descText: 0,         //卡的领取介绍
        remainDay: 0,        //剩余天数
      };
    },
    mounted() {
      switch (this.data.name) {
        case "周卡":
          this.titleImg = require("img/sign/title_week.png");
          this.cardImg = require("img/sign/week_card.png");
          break;
        case "月卡":
          this.titleImg = require("img/sign/title_month.png");
          this.cardImg = require("img/sign/month_card.png");
          break;
      }
      this.cardId = this.data.id;
      this.descText = `本次签到可领取${this.data.coin}金币`;
      this.remainDay = this.data.remain_day;
      if (!this.cardId) {
        this.$emit('close-sign-card');
      }
    },
    methods: {
      async receiveSign() {
        let result = await api.postVipCardSign(this.cardId);
        if (result.code == 1) {
          this.remainDay = result.data.remain_day;
          showToast(result.data.name + "领取成功,领取金币" + result.data.coin, 'success');
          setTimeout(() => {
            this.$emit('close-sign-card');
          }, 1500);
        } else {
          showToast(result.msg, 'cancel');
        }
      },
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
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: -60px;
        width: 640px;
        height: 480px;
        .background-url("~img/sign/bg_floor.png");
        p {
          font-size: @subFontSize;
          font-weight: 500;
          line-height: 50px;
        }
        .card-img {
          width: 376px;
          height: 192px;
          .img-spread;
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
