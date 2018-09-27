<!--
** 红包提现
-->

<template>
  <div class="put-wrapper" :class="{'active':isShowRob||isShowCode}">
    <title-bar title="提现"/>
    <header class="put-header" :class="{'active':isShowRob||isShowCode}">
      <p class="put-money"><span class="price">{{parseInt(userInfo.redpacket)/100}}</span> <span class="unit">元</span>
      </p>
    </header>
    <div class="center">
      <h2 class="sub-title">请选择提现金额</h2>
      <ul class="box">
        <li class="item-money" v-for="item in list" :key="item.id" @click="selectItem(item)">
          <div class="select-icon"><img
            :src="item.total_convert?item.is_select?require('img/envelopes/item_yes_bg.png'):require('img/envelopes/item_bg.png'):require('img/envelopes/item_no_bg.png')"
            alt="">
          </div>
          <p class="wrap">{{item.money/100}}元</p>
          <p class="text">限时提现</p>
        </li>
      </ul>
      <div class="submit-btn" @click="submitClick">
        <img src="~/img/envelopes/submit_btn.png" alt="">
      </div>
      <p class="desc-test">兑换码成功生成后，请关注微信公众号“德趣通科技”输入获取的兑换码，领取微信红包</p>
    </div>
    <transition-scale v-if="isShowRob">
      <div class="rob-wrapper">
        <div class="center">
          <div class="close" @click="()=>{isShowRob = false}"><img src="~/img/com_img/close.png" alt=""></div>
          <h3 class="title">限时提现 <span class="money">{{selected.money/100}}元</span></h3>
          <div class="qiang-btn" @click="gotoEbvelop"><img src="~/img/envelopes/qiang.png" alt=""></div>
          <p class="limit">今日份额：<span class="orange">{{selected.allow_convert}}/{{selected.total_convert}}</span></p>
          <div class="rule-box">
            <p>规则说明</p>
            <br>
            <p v-html="descContent(selected.description)"></p>
          </div>
        </div>
      </div>
    </transition-scale>
    <transition-scale v-if="isShowCode">
      <div class="code-wrapper">
        <div class="center">
          <div class="close" @click="()=>{isShowCode = false}"><img src="~/img/com_img/close.png" alt=""></div>
          <p class="text code">您的兑换码：<span class="orange">{{formData.conv_code}}</span></p>
          <p class="text desc">请关注微信公众号“德趣通科技”领取。</p>
          <p class="text desc">兑换明细可以在红包明细中查看。</p>
        </div>
      </div>
    </transition-scale>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import TitleBar from "@/common/TitleBar";
  import TransitionScale from "@/common/TransitionScale";
  import api from "../../api/BaseService";
  import {showToast, updateBaseInfo} from "../../common/util/Utils";

  export default {
    name: "PutForward",
    data() {
      return {
        list: [],         //提现列表
        selected: {},     //选中的数据
        formData: [],     //抢到后的数据
        isShowRob: false, //是否展示抢红包弹窗
        isShowCode: false,//是否展示抢到红包结果弹窗
      }
    },
    mounted() {
      this._getRedPacketRules();
    },
    methods: {
      async _getRedPacketRules() {
        let result = await api.getRedPacketRules();
        result.data.forEach((v) => {
          v.is_select = false;
        });
        this.list = result.data;
      },
      selectItem(item) {
        if (!item.allow_convert) {
          return;
        }
        if (!item.is_select) {
          let arr = this.list;
          arr.forEach((v) => {
            v.is_select = false;
            if (v.id === item.id) {
              v.is_select = true;
            }
          })
        }
      },
      //提交提现金额
      submitClick() {
        this.list.forEach((v) => {
          if (v.is_select) {
            this.selected = v;
          }
        });
        if (this.selected.hasOwnProperty('id')) {
          this.isShowRob = true;
        }
      },
      //抢名额
      async gotoEbvelop() {
        if (parseInt(this.selected.allow_convert) === 0) {
          showToast('今天的名额已达到上线，请明天再来吧~');
          return;
        }
        let result = await api.postRedPacketForm(this.selected.id);
        if (result.code == 1) {
          this.formData = result.data;
          this.isShowRob = false;
          this.isShowCode = true;
          updateBaseInfo();
        } else {
          this.isShowRob = false;
          this.isShowCode = false;
          showToast(result.msg, 'cancel', 1000);
        }
      },
      descContent(value) {
        return value.replace(/\n/g, '<br />');
      }
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    components: {TitleBar, TransitionScale}
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .put-wrapper {
    &.active {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      .background-url("~img/envelopes/select_bg.png");
    }
    .put-header {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 220px;
      .background-url('~img/envelopes/header_bg.png');
      &.active {
        background-image: none;
      }
      .put-money {
        margin-top: -50px;
        color: @whiteColor;
      }
      .price {
        font-size: 70px;
        font-weight: 600;
      }
      .unit {
        font-size: @maxFontSize;
      }
    }
    .center {
      padding: 30px;
      padding-bottom: 0;
      .sub-title {
        display: inline-block;
        margin-bottom: 40px;
        padding: 10px 18px;
        font-size: @maxFontSize;
        background-color: @mainColor;
        color: @whiteColor;
        -webkit-border-radius: 12px;
        -moz-border-radius: 12px;
        border-radius: 12px;
      }
      .box {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        color: @whiteColor;
      }
      .item-money {
        margin: 16px 10px;
        position: relative;
        .select-icon {
          width: 206px;
          height: 96px;
          .img-spread;
        }
        .wrap {
          position: absolute;
          top: 16px;
          width: 100%;
          height: 30px;
          line-height: 30px;
          text-align: center;
          font-size: @maxFontSize;
          font-weight: 600;
        }
        .text {
          position: absolute;
          top: 22+30px;
          width: 100%;
          text-align: center;
          font-size: @minFontSize;
        }
      }
      .submit-btn {
        margin: 80px auto 40px;
        width: 404px;
        height: 80px;
        .img-spread;
      }
      .desc-test {
        margin: 0 auto;
        width: 660px;
        font-size: @subFontSize;
        line-height: 40px;
        color: @grayColor;
        text-align: center;
        word-break: break-all;
      }
    }
  }

  .rob-wrapper, .code-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: @bgOpacity;
    .close {
      position: absolute;
      top: -40/2px;
      right: -40/2px;
      width: 60px;
      height: 60px;
      .img-spread;
    }
    .orange {
      color: orange;
    }
  }

  .rob-wrapper {
    .center {
      position: relative;
      width: 574px;
      height: 698px;
      .background-url('~img/envelopes/rob-bg.png');
      .title {
        text-align: center;
        line-height: 90px;
        .money {
          color: #F1FE01;
        }
      }
      .qiang-btn {
        margin: 0 auto;
        width: 160px;
        height: 160px;
        .img-spread;
      }
      .limit {
        line-height: 100px;
        text-align: center;
      }
      .rule-box {
        margin-top: 20px;
        line-height: 40px;
      }
    }
  }

  .code-wrapper {
    .center {
      position: relative;
      width: 578px;
      height: 414px;
      .background-url('~img/envelopes/code_bg.png');
      .text {
        font-size: @mainFontSize;
        text-align: center;
      }
      .code {
        margin-top: 60px;
        line-height: 100px;
        .orange {
          font-size: @maxFontSize;
          font-weight: 600;
        }
      }
      .desc {
        line-height: 50px;
      }
    }
  }
</style>
