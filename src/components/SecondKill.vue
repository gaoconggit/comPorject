<!--
** 秒杀
-->

<template>
  <div class="second-wrapper">
    <title-bar title="限时秒杀"/>
    <div class="second-center">
      <div class="now-second">
        <div class="time-count">
          <p>xx时xx分xx秒 后结束</p>
        </div>
        <div class="goods">
          <div class="goods-price">
            <div class="good"><img src="~/img/second/snatch.png" alt=""></div>
            <p class="coin">900金币</p>
          </div>
          <div class="goods-desc">
            <p class="price">秒杀价：<span class="num">9.90</span>元</p>
            <p class="now-price">原价：29.90元</p>
            <p class="quantum">限量 20个</p>
            <div class="goto-btn"><img src="~/img/second/go_now.png" alt=""></div>
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
          <p>00 时 00 分 00 秒 已枪完</p>
        </div>
        <div class="goods">
          <div class="goods-price">
            <div class="good"><img src="~/img/second/snatch.png" alt=""></div>
            <p class="coin">900金币</p>
          </div>
          <div class="goods-desc">
            <p class="price">秒杀价：<span class="num">9.90</span>元</p>
            <p class="now-price">原价：29.90元</p>
            <p class="quantum">限量 20个</p>
            <div class="goto-btn"><img src="~/img/second/go_out.png" alt=""></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TitleBar from "@/common/TitleBar";

  export default {
    name: "SecondKill",
    components: {TitleBar}
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
            padding-top: 12px;
            padding-bottom: 12px;
            color: @secondColor;
            text-align: center;
            background-color: #FFCC95;
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
