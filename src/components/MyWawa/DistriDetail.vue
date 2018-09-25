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
        <p class="text">所需邮费：({{numFreeMail}}件以上包邮)</p>
        <p class="num">{{!isFree?`￥${postagePrice}`:"包邮"}}</p>
      </div>
    </div>
    <div v-if="!isFree" class="select-type">
      <div class="postage" @click="gotoPay(mailInfo.charge_rule[0].charge_id)">
        <p class="num">{{mailInfo.charge_rule[0].name}}</p>
      </div>
      <div class="free-postage" @click="gotoPay(mailInfo.charge_rule[1].charge_id)">
        <p class="num">免邮费福利</p>
        <p class="num coin">{{mailInfo.charge_rule[1].name}}</p>
      </div>
    </div>
    <div v-else class="select-type">
      <div class="postage" @click="confirmMail">
        <p class="num">提交</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from "vuex";
  import {Scroller} from "vux";
  import TitleBar from "@/common/TitleBar";
  import WawaListItem from "@/common/WawaListItem";
  import {selectAddress} from "../../store/getters";
  import {showToast, updateBaseInfo, WXPay} from "../../common/util/Utils";
  import api from "../../api/BaseService";

  export default {
    name: "distri-detail",
    data() {
      return {
        isFree: false,        //是否包邮
        postagePrice: 0,      //邮费多少
        numFreeMail: 3,       //几个包邮
      }
    },
    mounted() {
      console.log(this.selectAddress);
      console.log(this.isSelect);

      if (!this.isSelect.length) {
        this.$router.back();
      }
      console.log(this.mailInfo);
      this.isFree = !this.mailInfo.mail_fee;
      this.numFreeMail = this.mailInfo.mail_free_wawa_num;
      this.postagePrice = parseInt(this.mailInfo.mail_fee_price) / 100;
    },
    methods: {
      ...mapActions(['emptySelect']),
      gotoAddress() {
        this.$router.push({path: '/address'});
      },
      async confirmMail() {
        if (this.selectAddress.addr_id) {
          let arr = [];
          this.isSelect.forEach((item) => {
            arr.push(item.w_id);
          });
          let result = await api.getConfirmMail(this.selectAddress.addr_id, arr);
          console.log(result);
          if (result.code == 1) {
            this.emptySelect();
            updateBaseInfo();
            this.$router.back();
            showToast('邮寄成功，请前往我的订单中查看', 'success', 1000, '300px');
          } else {
            showToast(result.msg, 'cancel', 1000, '300px');
          }
        } else {
          showToast('请选择收货地址')
        }
      },
      async gotoPay(id) {      //支付
        if (this.selectAddress.addr_id) {
          let arr = [];
          this.isSelect.forEach((item) => {
            arr.push(item.w_id);
          });
          let result = await api.getConfirmMail(this.selectAddress.addr_id, arr, id, 1);
          console.log(result);
          if (result.code == 1) {
            WXPay(id, (code) => {
              if (code === 1) {
                api.postRechordPaySuccess(result.data.inner_oid)
                  .then((res) => {
                    console.log(res);
                    updateBaseInfo();
                    showToast('邮寄成功，请前往我的订单中查看', 'success', 1000, '300px');
                    this.$router.back();
                  })
                  .catch((err) => {
                    console.log(err)
                  })
              } else if (code === 3) {
                this.$router.back();
                showToast('邮寄失败，请重新选择邮寄', 'cancel', 1000, '300px');
              }
            });
          } else {
            showToast(result.msg, 'cancel', 1000, '300px');
          }
        } else {
          showToast('请选择收货地址')
        }
      },
    },
    computed: {
      ...mapGetters(['isSelect', 'selectAddress', 'mailInfo'])
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
