<!--
**  邮寄娃娃订单详情
-->

<template>
  <div class="mail-details">
    <title-bar title="订单详情"/>
    <header class="distri-header">
      <div class="location"><img src="~/img/wawa/location.png" alt=""></div>
      <div class="center">
        <div class="user">
          <p>收货人:{{mailDetails.uname}}</p>
          <p>联系电话:{{mailDetails.phone}}</p>
        </div>
        <p class="addr">地址:{{mailDetails.addr}}<br>{{mailDetails.addr_info}}</p>
      </div>
    </header>
    <div class="wawa-list">
      <h3>已邮寄的娃娃</h3>
      <scroller lock-x scrollbarY :bounce="false" height="300px">
        <wawa-list-item :data="mailDetails.goods"/>
      </scroller>
    </div>
    <div class="mail-status">
      <div class="info">
        <p>订单编号：{{mailDetails.waybillno}}</p>
        <p class="red">快递状态：{{mailStatus(parseInt(mailDetails.status))}}</p>
        <p>快递公司：{{mailDetails.kdname}}</p>
        <p>快递单号：{{mailDetails.kdno}}</p>
      </div>
      <div class="look"><img src="~/img/wawa/btn_look_logistics.png" alt=""></div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {Scroller} from "vux";
  import TitleBar from "@/common/TitleBar";
  import WawaListItem from "@/common/WawaListItem";

  export default {
    name: "MailDetails",
    mounted() {
      if (!this.mailDetails.waybillno) {
        this.$router.back();
      }
    },
    methods: {
      mailStatus(num) {
        let text = '';
        switch (num) {
          case 1:
            text = '待邮寄';
            break;
          case 2:
            text = '已发货';
            break;
          case 3:
            text = '已确认';
            break;
          default:
            text = '待邮寄';
        }
        return text;
      }
    },
    computed: {
      ...mapGetters(['mailDetails'])
    },
    components: {TitleBar, Scroller, WawaListItem}
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .mail-details {
    background-color: @lightGrayColor;
    .distri-header {
      padding: 0 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
      background-color: @whiteColor;
      .location {
        padding: 0 20px;
        width: 60px;
        height: 60px;
        .img-spread;
      }
      .center {
        flex: 1;
        display: flex;
        flex-direction: column;
        font-size: @subFontSize;
        line-height: 50px;
        width: 100%;
        overflow: hidden;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        .user {
          display: flex;
          .over-ellip;
          p {
            flex: 1;
            .over-ellip;
          }
        }
        .addr {
          word-break: break-all;
        }
      }
      .go-icon {
        width: 40px;
        height: 40px;
        padding: 0 20px;
        transform: rotate(180deg);
        .img-spread;
      }
    }
    .wawa-list {
      padding: 0 10px;
      margin-top: 20px;
      margin-bottom: 40px;
      background-color: @whiteColor;
      h3 {
        padding: 10px 0;
      }
    }
    .mail-status {
      padding: 40px 20px;
      background-color: @whiteColor;
      display: flex;
      align-items: center;
      .info {
        flex: 1;
        font-size: @subFontSize;
        line-height: 46px;
        .red {
          color: @warnColor;
        }
      }
      .look {
        width: 200px;
        height: 76px;
        .img-spread;
      }
    }
  }
</style>
