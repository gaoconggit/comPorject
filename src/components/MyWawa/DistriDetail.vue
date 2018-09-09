<!--
** 配送详情
-->

<template>
  <div class="distri-wrapper">
    <title-bar title="配送详情" :isWhiteBack="false"></title-bar>
    <header class="distri-header" @click="gotoAddress">
      <div class="location"><img src="~/img/wawa/location.png" alt=""></div>
      <div class="center">
        <div class="user">
          <p>收货人:{{selectAddress?selectAddress.username:''}}</p>
          <p>联系电话:{{selectAddress?selectAddress.mobile:''}}</p>
        </div>
        <p class="addr">地址:{{selectAddress?selectAddress.addr:''}}<br>
          {{selectAddress?selectAddress.addr_info:''}}</p>
      </div>
      <div class="go-icon"><img src="~/img/com_img/icon_bakc_black.png" alt=""></div>
    </header>
    <div class="wawa-list">
      <h3>已选择的娃娃</h3>
      <scroller lock-x scrollbarY :bounce="false" height="300px">
        <wawa-list-item :data="isSelect"/>
      </scroller>
    </div>
    <div class="introduce">
      <div class="price">
        <p class="text">所需邮费：(3件以上包邮)</p>
        <p class="num">{{postagePrice?`￥${postagePrice}`:"包邮"}}</p>
      </div>
    </div>
    <div v-if="!isFree" class="select-type">
      <div class="postage">
        <p class="num">付邮费12元</p>
      </div>
      <div class="free-postage">
        <p class="num">免邮费福利</p>
        <p class="num coin">买150金币即可包邮</p>
      </div>
    </div>
    <div v-else class="select-type">
      <div class="postage">
        <p class="num">提交</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {Scroller} from "vux";
  import TitleBar from "@/common/TitleBar";
  import WawaListItem from "@/common/WawaListItem";

  export default {
    name: "distri-detail",
    data() {
      return {
        isFree: true,        //是否包邮
        postagePrice: 0,      //邮费多少
      }
    },
    mounted() {
      console.log(this.selectAddress);
      console.log(this.isSelect);

      if (!this.isSelect.length) {
        this.$router.back();
      }
    },
    methods: {
      gotoAddress() {
        this.$router.push({path: '/address'});
      }
    },
    computed: {
      ...mapGetters(['isSelect', 'selectAddress'])
    },
    components: {TitleBar, WawaListItem, Scroller}
  };
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .distri-wrapper {
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
    .introduce {
      padding: 20px 10px;
      background-color: @whiteColor;
      .price {
        display: flex;
        .over-ellip;
        .text {
          flex: 1;
          .over-ellip;
        }
        .num {

        }
      }
    }
    .select-type {
      margin: 20px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      color: @whiteColor;
      text-align: center;
      .postage {
        width: 316px;
        height: 102px;
        .background-url('~img/wawa/postage_btn.png');
        .num {
          line-height: 90px;
        }
      }
      .free-postage {
        width: 362px;
        height: 117px;
        .background-url('~img/wawa/postage_free_btn.png');
        .num {
          margin-top: 20px;
          margin-left: 86px;
          font-size: @subFontSize;
          &.coin {
            font-size: @minFontSize;
          }
        }
      }
    }
  }
</style>
