<template>
  <div class="Red-data">
    <title-bar title="我的红包" class="title"/>
    <div class="Red-content">
      <header class="Red-header">
        <img src="../../assets/img/envelopes/header_bg.png" class="img-style" alt="">
        <p class="p_left">红包兑换</p>
        <p class="p_right">红包明细</p>
        <div class="redNumber">188.8<span>元</span></div>
      </header>
      <div class="red_anniu">
        <img src="../../assets/img/envelopes/yaoqhy.png" class="img-style" alt="">
      </div>
      <div class="red_list">
        <dl>
          <dt><div class="list_img">1</div>签到奖励</dt>
          <dd>坚持每日签到，就有机会获得<span>2-10</span>元随机红包奖励。</dd>
          <dt><div class="list_img">2</div>邀请好友奖励</dt>
          <dd>邀请好友即可获得0.5元红包，一个ID累计最多可以获得5元红包。</dd>
          <dt><div class="list_img">3</div>好友充值奖励</dt>
          <dd>邀请好友充值成功，获得好友充值金额的10%的红包奖励。</dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
  import TitleBar from "../../common/TitleBar";
    export default {
      components: {TitleBar},
        name: "RedEnvelopes"
    }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";
  .Red-data{
    .img-style {
      width: 100%;
      height: 100%;
    }
    .Red-content{
      width:100%;
      .Red-header{
        width:100%;
        height: 220px;
        position: relative;
        p{
          color:#fff;
          font-size:30px;
          height:40px;
          line-height: 40px;
          border-bottom: 1px solid #fff;
        }
        .p_left{
            position: absolute;
            top:30px;
            left:20px;
        }
        .p_right{
            position: absolute;
            top:30px;
            right:20px;
        }
        .redNumber{
          color:#fff;
          font-size:60px;
          text-align: center;
          line-height: 60px;
          position: absolute;
          top:30%;
          left:50%;
          transform: translateX(-50%);
          span{
            font-size:45px;
          }
        }
      }
    }
    .red_anniu{
      margin:50px auto;
      width: 460px;
      height: 91px;
    }
    .red_list{
      width: 600px;
      margin:auto;
      dl{
        width: 100%;
        color: #656565;
        font-weight: bold;

        dt{
          font-size: 30px;
          height:50px;
          line-height: 50px;
          margin: 10px 0px;
          .list_img{
            width:50px;
            height:50px;
            border-radius:50%;
            background-color: #ffb482;
            color:#fff;
            text-align: center;
            line-height: 50px;
            display:inline-block;
            margin-right: 10px;
          }
        }
        dd{
          font-size:24px;
          height:35px;
          line-height: 35px;
          display:inline-block;
          word-wrap: break-word;
          span{
            color: #fc8eab;
          }
        }
      }
    }
  }
</style>
