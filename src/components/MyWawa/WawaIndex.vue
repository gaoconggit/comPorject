<template>
  <div class="wawa-wrapper">
    <title-bar title="我的娃娃" @get-title-height="titleHeight">
      <div class="history" slot="right" @click="gotoHistory">
        <img src="~/img/wawa/history_icon.png" alt="">
      </div>
    </title-bar>
    <div class="wawa-header" ref="wawaHeader">
      <div class="info">
        <div class="avatar"><img :src="userInfo.avatar" alt=""></div>
        <p class="userinfo">{{userInfo.user_nicename}}(id:{{userInfo.id}})</p>
        <p class="total">共抓中{{wawaData.total}}次</p>
      </div>
    </div>
    <div class="wawa-content">
      <tab class="wawa-tab" v-model="tabIndex" active-color="#000" ref="wawaTab">
        <tab-item @on-item-click="switchTabItem(0)">未发货</tab-item>
        <tab-item @on-item-click="switchTabItem(1)">我的订单</tab-item>
      </tab>
    </div>
    <div class="list-wrapper">
      <un-delivery v-show="tabIndex===0" :tabHeight="tabHeight"/>
      <al-delivery v-if="tabIndex===1" :tabHeight="tabHeight"/>
    </div>
    <div class="bottom-wrapper" ref="wawaBottom">
      <div class="btn deliver"><img src="~/img/wawa/button_deliver.png" alt=""></div>
      <div class="btn exchange">
        <img src="~/img/wawa/button_exchange.png" alt="">
        <p>(可兑换123456)</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import TitleBar from "@/common/TitleBar";
  import UnDelivery from "./UnDelivery";
  import AlDelivery from "./AlDelivery";
  import api from "../../api/BaseService";
  import {Tab, TabItem} from 'vux'

  export default {
    name: "WawaIndex",
    data() {
      return {
        wawaData: {},       //娃娃信息
        unList: [],         //未发货的列表
        orderList: [],      //我的订单列表
        tabIndex: 0,        //默认选择
        tabHeight: 0,       //列表高度
      }
    },
    mounted() {
      this._getWawaInfo();
    },
    methods: {
      async _getWawaInfo() {
        let result = await api.getWawaInfo();
        this.wawaData = result.data;
      },
      gotoHistory() {
        console.log("前往历史");
        this.$router.push({path: '/history'});
      },
      switchTabItem(index) {
        console.log(index);
      },
      titleHeight(height) {
        if (Number(height)) {
          this.tabHeight = -(height + this.$refs.wawaHeader.clientHeight + this.$refs.wawaTab.$el.clientHeight + this.$refs.wawaBottom.clientHeight);
        }
      },
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    components: {UnDelivery, TitleBar, Tab, TabItem, AlDelivery}
  }
</script>

<style lang="less">
  @import "~assets/style/index.less";

  @roomTabHeight: 80px;

  .wawa-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    .history {
      position: relative;
      right: 20px;
      width: 60px;
      height: 60px;
      .img-spread;
    }
    .wawa-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 750px;
      height: 260px;
      .background-url('~img/wawa/header_bg.png');
      .avatar {
        margin: 6px auto 10px;
        width: 120px;
        height: 120px;
        border: 10px solid @auxColor;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        overflow: hidden;
        .img-spread;
      }
      .userinfo, .total {
        font-size: @subFontSize;
        line-height: @mainFontSize;
        color: @whiteColor;
        text-align: center;
      }
    }
    .wawa-content {
      .vux-tab-wrap {
        padding: 0 !important;
        height: @roomTabHeight !important;
      }
      .vux-tab-container {
        height: @roomTabHeight !important;
      }
      .vux-tab {
        height: @roomTabHeight !important;
        border-top-right-radius: 30px;
        border-top-left-radius: 30px;
        overflow: hidden;
      }
      .vux-tab-item {
        height: @roomTabHeight !important;
        line-height: @roomTabHeight !important;
        font-size: @subFontSize;
      }
      .vux-tab-ink-bar {
        background-color: @grayColor !important;
      }
    }
    .list-wrapper {
      padding: 0 20px;
      flex: 1;
    }
    .bottom-wrapper {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 120px;
      .btn {
        width: 316px;
        height: 92px;
        .img-spread;
      }
      .exchange {
        position: relative;
        p {
          position: absolute;
          bottom: 18px;
          width: 100%;
          text-align: center;
          font-size: @subFontSize;
          color: @whiteColor;
        }
      }
    }
  }
</style>
