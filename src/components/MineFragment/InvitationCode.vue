<!--
** 我的邀请码
-->

<template>
  <div class="invitation-code">
    <title-bar title="我的邀请码"/>
    <div class="content">
      <div class="header">
        <div class="invite_icon"><img src="~/img/invitation/invite_icon.png" alt=""></div>
        <div class="title">
          <h1>已经邀请了{{myCodeData?myCodeData.invite_cnt:0}}位好友</h1>
        </div>
      </div>
      <div class="center">
        <qrcode class="qrcode" :size="120" :value="myCodeData.download_url" type="img"></qrcode>
        <div class="my-code">
          <p class="text">我的邀请码</p>
          <p class="code">{{myCodeData.user_activation_key}}</p>
        </div>
      </div>
      <div class="code-rule">
        <p>{{codeRule.str}}</p>
      </div>
    </div>
    <div class="bottom-img">
      <div class="icon" @click="shareGoto"><img src="~/img/invitation/share_weixin.png" alt=""></div>
      <div class="icon" @click="shareGoto"><img src="~/img/invitation/share_ic_friend.png" alt=""></div>
      <div class="icon" @click="shareGoto"><img src="~/img/invitation/share_qq.png" alt=""></div>
      <div class="icon" @click="shareGoto"><img src="~/img/invitation/share_qqkongjian.png" alt=""></div>
    </div>
    <share-dialog v-if="isShowHideDialog" @on-hide="onHide"/>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {Qrcode} from "vux";
  import TitleBar from "@/common/TitleBar";
  import ShareDialog from "@/common/ShareDialog";
  import api from "../../api/BaseService";

  const crypto = require("crypto");

  export default {
    name: "InvitationCode",
    data() {
      return {
        myCodeData: [],         //我的邀请码
        codeRule: [],           //邀请码规则
        isShowHideDialog: false,
      }
    },
    watch: {
      showHideDialog() {
        this.isShowHideDialog = this.showHideDialog;
      }
    },
    mounted() {
      this._getMyCode();
      this._getCodeRule();
      this.isShowHideDialog = this.showHideDialog;
    },
    methods: {
      async _getMyCode() {
        let result = await api.getMyCode();
        this.myCodeData = result.data;
      },
      async _getCodeRule() {
        let result = await api.getCodeRule();
        this.codeRule = result.data;
      },
      shareGoto() {
        this.$store.commit('SET_SHOW_HIDE_DIALOG', true);
      },
      onHide() {
        this.$store.commit('SET_SHOW_HIDE_DIALOG', false);
      },
    },
    computed: {
      ...mapGetters(['showHideDialog'])
    },
    components: {Qrcode, TitleBar, ShareDialog}
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .invitation-code {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: @mainColor;
    .content {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: @titleBarHeight;
      left: 0;
      right: 0;
      bottom: 180px;
      min-height: 1334-180-@titleBarHeight;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      .header {
        position: relative;
        height: 200px;
        width: 100%;
        overflow: hidden;
        .invite_icon {
          position: absolute;
          top: -8px;
          right: -10px;
          width: 196px;
          height: 200px;
          .img-spread;
        }
        .title {
          position: absolute;
          left: 0;
          right: 0;
          z-index: 1;
          text-align: center;
          color: @whiteColor;
          font-size: 54px;
          line-height: 200px;
        }
      }
      .center {
        margin: 0 auto;
        position: relative;
        width: 734px;
        height: 562px;
        .background-url('~img/invitation/invite_er_code_bg.png');
        .qrcode {
          position: absolute;
          top: 90px;
          left: 50%;
          width: 240px;
          transform: translateX(-50%);
        }
        .my-code {
          position: absolute;
          left: 0;
          bottom: 60px;
          right: 0;
          text-align: center;
          line-height: 50px;
          .text {
            font-size: @subFontSize;
            color: @grayColor;
          }
          .code {
            font-size: 50px;
            color: #000;
          }
        }
      }
      .code-rule {
        margin: 0 auto 20px;
        flex: 1;
        width: 670px;
        overflow-y: auto;
        p {
          color: @whiteColor;
          font-size: @subFontSize;
          line-height: @maxFontSize;
        }
      }
    }
    .bottom-img {
      padding-bottom: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 160px;
      background-color: @whiteColor;
      .icon {
        width: 188px;
        height: 170px;
        .img-spread;
      }
    }
  }
</style>
