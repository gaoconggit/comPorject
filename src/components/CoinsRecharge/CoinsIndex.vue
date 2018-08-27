<template>
  <div class="coin-wrapper">
    <title-bar title="充值中心"/>
    <div class="coin-content">
      <header>
        <p class="my-coin">我的金币：<span>{{userInfo.coin}}</span></p>
      </header>
      <div class="card-box">
        <div class="card" v-for="item in vipCard" @click="listItem(item.charge_id)">
          <img
            :src="item.vip_card_name === '周卡'?require('img/myCoin/recharge_week_bg.png'):require('img/myCoin/recharge_month_bg.png')"
            alt="">
          <span class="extra-rate">{{item.extra_rate}}</span>
          <span class="actual-coin">{{item.coin}}</span>
          <span class="return-coin">返{{Number(item.coin)-Number(item.coin_per_day)*Number(item.day)}}</span>
          <span class="money">￥{{Number(item.money)/100}}</span>
          <p class="desc-text">分<span>{{item.day}}</span>七天返还|每天返还<span>{{item.coin_per_day}}</span>个币</p>
          <div v-if="item.charge_id === selectIndex" class="is-select"><img src="~/img/myCoin/recharge_select.png"
                                                                            alt=""></div>
        </div>
      </div>
      <div class="goto-vip" @click="gotoVip">
        <img src="~/img/myCoin/vip.png" alt="">
      </div>
      <scroller class="coin-list" lock-x scrollbar-y :bounce="false">
        <grid :cols="2" :show-lr-borders="false" :show-vertical-dividers="false" class="item-wrapper">
          <grid-item v-for="(item, index) in charges" class="item-box" :key="item.charge_id"
                     @on-item-click="listItem(item.charge_id)">
            <div class="item" :class="item.charge_id == selectIndex?'active':''">
              <div class="icon">
                <img
                  :src="index<6?require(`img/myCoin/recharge_coin${index+1}.png`):require('img/myCoin/recharge_coin6.png')"
                  alt="">
              </div>
              <p class="center">
                <span class="origin">{{item.bodycoin}}</span>
                <span class="give" v-if="Number(item.give_coin)">送{{item.give_coin}}币</span>
              </p>
              <p class="price">￥{{Number(item.money)/100}}</p>
            </div>
          </grid-item>
        </grid>
      </scroller>
      <div class="recharge-wrapper">
        <div class="recharges-btn" @click="rechargeCharge">
          <img src="~/img/myCoin/recharge_wecat.png" alt="">
        </div>
        <div class="recharges-btn" @click="rechargeCharge">
          <img src="~/img/myCoin/recharge_alipay.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {Scroller, Grid, GridItem} from "vux";
  import TitleBar from "@/common/TitleBar";
  import api from "../../api/BaseService";
  import {showToast} from "../../common/util/Utils";

  export default {
    name: "CoinsIndex",
    data() {
      return {
        vipCard: [],          //充值卡的规则
        charges: [],   //充值列表规则
        selectIndex: 0,       //默认选中
      }
    },
    mounted() {
      this._getRechargeRuleList();
    },
    methods: {
      async _getRechargeRuleList() {
        let result = await api.getRechargeRuleList();
        result = result.data;
        this.selectIndex = result.default_charge_id;
        this.vipCard = result.vip_card;
        this.charges = result.charge;
      },
      listItem(id) {
        if (id != this.selectIndex) {
          this.selectIndex = id;
        }
      },
      rechargeCharge() {
        console.log(this.selectIndex);
        showToast(`支付的商品ID：${this.selectIndex}`);
      },
      gotoVip() {
        this.$router.push({path: '/vip'});
      }
    },
    computed: {
      ...mapGetters(['userInfo']),
    },
    components: {
      TitleBar, Scroller, Grid, GridItem
    }
  };
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .coin-wrapper {
    background-color: @whiteColor;
    .coin-content {
      display: flex;
      flex-direction: column;
      position: fixed;
      top: @titleBarHeight;
      bottom: 0;
      width: 100%;
      header {
        width: 750/2px;
        height: 220/2px;
        .background-url('~img/myCoin/header_bg.png');
        overflow: hidden;
        .my-coin {
          margin: 40/2px auto 0;
          text-align: center;
          font-weight: 600;
          color: @whiteColor;
        }
      }
      .card-box {
        display: flex;
        justify-content: space-around;
        margin: 4px 0;
        .card {
          position: relative;
          width: 376/2px;
          height: 192/2px;
          font-weight: 600;
          .img-spread;
          & > span {
            position: absolute;
          }
          .extra-rate {
            top: 10px;
            left: 98px;
            padding: 0 6px;
            height: 16px;
            line-height: 16px;
            color: @whiteColor;
            font-size: 14px;
            font-weight: 600;
            background-color: @warnColor;
            &::before {
              position: absolute;
              left: -8px;
              content: '';
              border-width: 8px 8px 8px 0;
              border-style: solid;
              border-color: transparent @warnColor transparent transparent;
              /*background-color: @warnColor;*/
            }
          }
          .actual-coin {
            top: 36px;
            left: 18px;
            font-size: 18px;
            color: @whiteColor;
          }
          .return-coin {
            top: 38px;
            left: 64px;
            font-size: 16px;
            color: @warnColor;
          }
          .money {
            top: 63px;
            left: 14px;
            color: @whiteColor;
          }
          .desc-text {
            position: absolute;
            top: 176/2px;
            left: 16px;
            font-size: 12px;
            font-weight: normal;
            color: @grayColor;
          }
          .is-select {
            position: absolute;
            bottom: 14px;
            right: 9px;
            width: 56/2px;
            height: 72/2px;
            .img-spread;
          }
        }
      }
      .goto-vip {
        margin: 10px auto 6px;
        width: 736/2px;
        height: 110/2px;
        .img-spread;
      }
      .coin-list {
        flex: 1;
        .item-wrapper {
          &::before {
            border: none;
          }
        }
        .item-box {
          margin: 4px 0;
          border: none;
          font-size: 14px;
          font-weight: 600;
          &::after {
            border: none;
          }
          .item {
            margin: 0 auto;
            display: flex;
            align-items: center;
            width: 350/2px;
            height: 110/2px;
            color: @mainColor;
            .background-url('~img/myCoin/price_bg_no.png');
            &.active {
              .background-url('~img/myCoin/price_bg_yes.png');
              color: @whiteColor;
            }
          }
          .icon {
            margin: 0 16/2px;
            width: 70/2px;
            height: 70/2px;
            .img-spread;
          }
          .center {
            flex: 1;
            display: flex;
            flex-direction: column;
            line-height: 18px;
            .give {
              color: @warnColor;
              font-weight: normal;
            }
          }
          .price {
            padding-right: 10/2px;
            min-width: 120/2px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            text-align: center;
          }
        }
        .weui-grid {
          padding: 0;
          //color: #FFF;
          //border: none;
          &::after {
            //border: none;
          }
        }
      }
      .recharge-wrapper {
        height: 68px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .recharges-btn {
          width: 300/2px;
          height: 92/2px;
          .img-spread;
        }
      }
    }
  }
</style>
