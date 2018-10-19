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
      <div class="look" @click="logistics">
        <img src="~/img/wawa/btn_look_logistics.png" alt="">
      </div>
      <div class="promotion" v-if="showD">
          <div class="box">
            <p class="box-title">物流信息</p>
              <div class="box-content">
                <div class="flow-content" v-for="item in inFormation">
                  <div class="list">
                    <div class="list-one"></div>
                    <div class="list-shu"></div>
                  </div>
                  <div class="list-content">
                    <p class="slot-time">{{item.time}}</p>
                    <div class="slot-context1">{{item.context}}</div>
                  </div>
                </div>
              </div>
            <p class="btn" @click="btnClick">好的</p>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {Scroller} from "vux";
  import TitleBar from "@/common/TitleBar";
  import WawaListItem from "@/common/WawaListItem";
  import BaseService from "../../api/BaseService";
  import TransitionScale from  '../../common/TransitionScale';
  import {showToast} from "../../common/util/Utils";
  export default {
    name: "MailDetails",
    data(){
      return{
        showD:false,
        inFormation:{}
      }
    },
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
      },
      LogisticsInformation :function (waybillno,kdname,kdno) {
        BaseService.LogisticsInformation(waybillno,kdname,kdno)
          .then( (result)=> {
            console.log(result.data);
            this.inFormation = result.data;
            this.$nextTick(() => {
              this.$refs.promotionRef.reset()
            })
          }).catch( (err)=> {
          console.log(err);
        })
      },
      logistics(){
        if(parseInt(this.mailDetails.status)===1){
          showToast('暂无邮寄');
        }else if(parseInt(this.mailDetails.status)!==1){
          this.showD = true;
          this.LogisticsInformation(this.mailDetails.waybillno,this.mailDetails.kdname,this.mailDetails.kdno);
        }
      },
      btnClick(){
        this.showD = false;
      }
    },
    computed: {
      ...mapGetters(['mailDetails'])
    },
    components: {TitleBar, Scroller, WawaListItem,TransitionScale}
  }
</script>

<style  lang="less">
  @import "~assets/style/index.less";
  .box-content{
    width: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    height: 640px;
  }
  .promotion{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: @bgOpacity;
    display: flex;
    justify-content: center;
    align-items: center;
    .box{
      position: relative;
      width: 573px;
      height: 800px;
      background: #fff;
      .box-title{
        height: 80px;
        text-align: center;
        line-height: 80px;
      }
      .scroller{
        padding: 10px 0 0 10px;
      }
      .btn{
        width: 100%;
        height: 80px;
        text-align: center;
        line-height: 80px;
        color: #2693D4;
        position: absolute;
        bottom: 0;
        left: 0;
      }
      .flow-content{
        width: 100%;
        display: flex;
        flex-direction: row;
      }
      .list{
        width: 30px;
        padding-left:10px;
        display: flex;
        flex-direction: column;
        .list-one{
          width: 30px;
          height: 30px;
          background: #2693D4;
          border-radius: 50%;
        }
        .list-shu{
          width: 4px;
          background: #2693D4;
          margin-left: 12px;
          flex: 1;
        }
      }
      .list-content{
        margin-left: 10px;
      }
      .slot-time{
        font-size: @mainFontSize;
        font-weight: bold;
        height: 45px;
        line-height: 45px;
        text-align: left;
      }
      .slot-context1{
        width:480px !important;
        font-size: @minFontSize;
        word-wrap:break-word;
        word-break:break-all;
        padding-bottom: 20px;
      }
    }
  }

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
