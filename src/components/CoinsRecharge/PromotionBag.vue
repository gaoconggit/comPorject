<template>
  <div class="promotion" v-if="showBog">
    <transition-scale>
      <div class="box">
        <div class="close" @click="closePromotion"><img src="~/img/special/close.png" alt=""></div>
        <p class="odd-day">{{formatSeconds(giftBagData.remain_time)}}</p>
        <div class="coin"><img :src="coinImage(parseInt(showGiftBag.coin))" alt=""></div>
        <div class="give-coin">
          <img :src="coinImage(showGiftBag.coin_per_day*showGiftBag.day)" alt="">
        </div>
        <div class="origin_price">
          <img :src="originPriceImg(parseInt(showGiftBag.origin_price)/100)" alt="">
        </div>
        <div class="money">
          <img :src="moneyImg(parseInt(showGiftBag.money)/100)" alt="">
        </div>
      </div>
    </transition-scale>
  </div>
</template>

<script>
  import TransitionScale from "@/common/TransitionScale";
  import {formatSeconds} from "../../common/util/Utils";
  import api from "../../api/BaseService";

  export default {
    name: "PromotionBag",
    data() {
      return {
        giftIndex: 0,         //默认访问第0个礼包
        giftBagData: [],      //新手礼包
        showGiftBag: [],      //展示的礼包
        showBog: false,
      }
    },
    mounted() {
      this._getGiftBagInfo();
    },
    methods: {
      async _getGiftBagInfo() {
        let result = await api.getGiftBagInfo();
        if (result.data.vip_card.length) {
          this.giftBagData = result.data;
          this.showGiftBag = result.data.vip_card[0];
          this.showBog = true;
        } else {
          this.$emit('close-promotion');
        }
      },
      closePromotion() {
        this.showBog = false;
        this.giftIndex += 1;
        if (this.giftBagData.vip_card[this.giftIndex]) {
          this.showGiftBag = this.giftBagData.vip_card[this.giftIndex];
          setTimeout(() => {
            this.showBog = true;
          }, 500)
        } else {
          this.$emit('close-promotion');
        }
      },
      formatSeconds(num) {
        return formatSeconds(num)
      },
      coinImage(num) {
        let img = "";
        switch (num) {
          case 30:
            img = require("img/special/coin_30.png");
            break;
          case 45:
            img = require("img/special/coin_45.png");
            break;
          case 60:
            img = require("img/special/coin_60.png");
            break;
          case 75:
            img = require("img/special/coin_75.png");
            break;
          case 90:
            img = require("img/special/coin_90.png");
            break;
          case 135:
            img = require("img/special/coin_135.png");
            break;
          case 180:
            img = require("img/special/coin_180.png");
            break;
          case 225:
            img = require("img/special/coin_225.png");
            break;
          case 270:
            img = require("img/special/coin_270.png");
            break;
          default:
            img = "";
        }
        return img;
      },
      originPriceImg(num) {
        let img = "";
        switch (num) {
          case 12:
            img = require("img/special/price_12.png");
            break;
          case 18:
            img = require("img/special/price_18.png");
            break;
          case 24:
            img = require("img/special/price_24.png");
            break;
          case 30:
            img = require("img/special/price_30.png");
            break;
          case 36:
            img = require("img/special/price_36.png");
            break;
          default:
            img = "";
        }
        return img;
      },
      moneyImg(num) {
        let img = "";
        switch (num) {
          case 6:
            img = require("img/special/now_price_6.png");
            break;
          case 9:
            img = require("img/special/now_price_9.png");
            break;
          case 12:
            img = require("img/special/now_price_12.png");
            break;
          case 15:
            img = require("img/special/now_price_15.png");
            break;
          case 18:
            img = require("img/special/now_price_18.png");
            break;
          default:
            img = "";
        }
        return img;
      }
    },
    components: {TransitionScale}
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .promotion {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: @bgOpacity;
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
      position: relative;
      width: 573px;
      height: 803px;
      .background-url("~img/special/special_bg.png");
      .close {
        position: absolute;
        top: 16px;
        right: 22px;
        width: 50px;
        height: 50px;
        .img-spread;
      }
      .odd-day {
        position: absolute;
        top: 104px;
        left: 210px;
        color: @whiteColor;
        font-size: @subFontSize;
        font-weight: 600;
      }
      .coin, .give-coin {
        position: absolute;
        width: 118px;
        height: 30px;
        .img-spread;
      }
      .coin {
        top: 472px;
        left: 60px;
        transform: rotate(5deg);
      }
      .give-coin {
        top: 484px;
        left: 230px;
      }
      .origin_price {
        position: absolute;
        top: 560px;
        left: 50px;
        width: 189px;
        height: 45px;
        .img-spread;
      }
      .money {
        position: absolute;
        top: 540px;
        right: 40px;
        width: 160px;
        height: 70px;
        .img-spread;
      }
    }
  }
</style>
