<!--
** 秒杀
-->

<template>
  <div class="second-wrapper">
    <title-bar title="限时秒杀"/>
    <div class="second-center" v-if="skillList.length">
      <div class="now-second">
        <div class="time-count">
          <p class="time-box">
            <span class="time">{{countDown1.d}}</span>天
            <span class="time">{{countDown1.h}}</span>时
            <span class="time">{{countDown1.m}}</span>分
            <span class="time">{{countDown1.s}}</span>秒
            后结束</p>
        </div>
        <div class="goods">
          <div class="goods-price">
            <div class="good"><img :src="skillList[0].icon" alt=""></div>
            <p class="coin">{{skillList[0].name}}</p>
          </div>
          <div class="goods-desc">
            <p class="price">秒杀价：<span class="num">{{skillList[0].money}}</span>元</p>
            <p class="now-price">原价：{{skillList[0].old_money}}元</p>
            <p class="quantum">限量 {{skillList[0].seckill_stock}}个</p>
            <div class="goto-btn" @click="startSecond(1,!!countDown1.t,skillList[0].id)">
              <img :src="countDown1.t>0?require('img/second/go_now.png'):require('img/second/go_out.png')" alt="">
            </div>
          </div>
        </div>
      </div>
      <div class="line">
        <!--下面两个标签是两个竖线请勿删除-->
        <p></p>
        <p></p>
      </div>
      <div class="now-second out-second">
        <div class="time-count">
          <p class="time-box">
            <span class="time">{{countDown2.d}}</span>天
            <span class="time">{{countDown2.h}}</span>时
            <span class="time">{{countDown2.m}}</span>分
            <span class="time">{{countDown2.s}}</span>秒
            后结束</p>
        </div>
        <div class="goods">
          <div class="goods-price">
            <div class="good"><img :src="skillList[1].icon" alt=""></div>
            <p class="coin">{{skillList[1].name}}</p>
          </div>
          <div class="goods-desc">
            <p class="price">秒杀价：<span class="num">{{skillList[1].money}}</span>元</p>
            <p class="now-price">原价：{{skillList[1].old_money}}元</p>
            <p class="quantum">限量 {{skillList[1].seckill_stock}}个</p>
            <div class="goto-btn" @click="startSecond(1,!!countDown1.t,skillList[1].id)">
              <img :src="countDown2.t>0?require('img/second/go_now.png'):require('img/second/go_out.png')" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TitleBar from "@/common/TitleBar";
  import api from "../api/BaseService";
  import {secondTime, showToast, WXPay} from "../common/util/Utils";

  export default {
    name: "SecondKill",
    data() {
      return {
        skillList: [],      //秒杀列表
        second: 0,
        countDown1: {t: 0},
        countDown2: {t: 0},
        timer1: null,
        timer2: null,
      }
    },
    mounted() {
      this._getSeckillList();
    },
    methods: {
      async _getSeckillList() {
        let result = await api.getSeckillList();
        this.skillList = result.data;

        let endTime1 = new Date(result.data[0].end_time).getTime() || 0;
        let endTime12 = new Date(result.data[1].end_time).getTime() || 0;
        if (endTime1 > 0) {
          this.countDown1 = secondTime(endTime1);
          this.timer1 = setInterval(() => {
            let remainTime = secondTime(endTime1);
            if (remainTime.t > 0) {
              console.log('timer1:', remainTime);
              this.countDown1 = remainTime;
            } else {
              clearInterval(this.timer1);
            }
          }, 1000)
        }
        if (endTime12 > 0) {
          this.countDown2 = secondTime(endTime12);
          this.timer2 = setInterval(() => {
            let remainTime = secondTime(endTime12);
            if (remainTime.t > 0) {
              console.log('timer2:', remainTime);
              this.countDown2 = remainTime;
            } else {
              clearInterval(this.timer2);
            }
          }, 1000)
        }
      },
      async _postSeckillStart(goods_id) {
        let result = await api.postSeckillStart(goods_id);
        console.log(result);
        if (result.code == 1) {
          if (result.data.hasOwnProperty('appId')) {
            let {data} = result.data;
            this.$wechat.chooseWXPay({
              timestamp: data.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
              nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
              package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
              signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              paySign: data.paySign, // 支付签名
              success: function (res) {
                // 支付成功后的回调函数
                console.log("支付成功的回调", res)
                api.postReportPayResult(data.oid, 3);
                showToast('支付成功', 'text', 500);
              },
              cancel: function (res) {
                console.log("支付取消的回调", res)
                api.postReportPayResult(data.oid, 4);
                showToast('支付取消', 'text', 500);
              },
              error: function (err) {
                console.log("支付失败的回调", err)
                api.postReportPayResult(data.oid, 5);
                showToast('支付失败', 'text', 500);
              }
            })
          }
        } else {
          showToast(result.msg);
        }
      },
      startSecond(type, bool, goodId) {
        if (bool) {
          this._postSeckillStart(goodId);
        } else {
          showToast('不好意思，已经抢完了哟~')
        }
      }
    },
    components: {
      TitleBar
    },
    destroyed() {
      console.log(this.timer1);
      clearInterval(this.timer1);
      clearInterval(this.timer2);
    }
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  @borderColor: #FFE682;

  .second-wrapper {
    overflow-y: auto;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .background-url('~img/second/second_bg.png');
    .second-center {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      .now-second {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        width: 670px;
        height: 593px;
        .background-url('~img/second/current_good.png');
        &.out-second {
          .time-count {
            margin-top: 50px;
            background-color: @lightGrayColor;
          }
        }
        .time-count {
          margin: 260px auto 0;
          padding: 6px 20px;
          display: inline-block;
          background-color: @mainColor;
          -webkit-border-radius: 20px;
          -moz-border-radius: 20px;
          border-radius: 20px;
          text-align: center;
          .time-box {
            padding: 6px;
          }
          .time {
            font-weight: 600;
            background-color: @auxColor;
          }
        }
        .goods {
          margin-top: 20px;
          padding: 0 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
        }
        .goods-price {
          margin: 0 40px;
          .good, .coin {
            border: 4px solid @borderColor;
          }
          .good {
            padding: 16px 30px;
            border-bottom: none;
            img {
              width: 115px;
              height: 115px;
            }
          }
          .coin {
            width: 115+30+40px;
            padding-top: 12px;
            padding-bottom: 12px;
            color: @secondColor;
            text-align: center;
            background-color: #FFCC95;
            .over-ellip;
          }
        }
        .goods-desc {
          flex: 1;
          .price {
            font-size: @maxFontSize;
            line-height: @maxFontSize+20;
            .num {
              font-size: @maxFontSize+20;
              color: @secondColor;
            }
          }
          .now-price, .quantum {
            color: @grayColor;
            font-size: @minFontSize;
            line-height: @maxFontSize;
          }
          .now-price {
            text-decoration: line-through;
            text-decoration-color: @secondColor;
          }
          .goto-btn {
            margin: 20px auto 0;
            width: 253px;
            height: 63px;
            .img-spread;
          }
        }
      }
      .line {
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        p {
          width: 40px;
          height: 48px;
          background-color: #FFAB3E;
        }
      }
      .out-second {
        position: relative;
        width: 670px;
        height: 405px;
        .background-url('~img/second/out_good.png');
      }
    }
  }
</style>
