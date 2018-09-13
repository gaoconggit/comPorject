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
      <div class="icon" @click="shareGoto('wechat')"><img src="~/img/invitation/share_weixin.png" alt=""></div>
      <div class="icon" @click="shareGoto('friend')"><img src="~/img/invitation/share_ic_friend.png" alt=""></div>
      <div class="icon" @click="shareGoto('qq')"><img src="~/img/invitation/share_qq.png" alt=""></div>
      <div class="icon" @click="shareGoto('qqkong')"><img src="~/img/invitation/share_qqkongjian.png" alt=""></div>
    </div>
  </div>
</template>

<script>
  import {Qrcode} from "vux";
  import TitleBar from "@/common/TitleBar";
  import api from "../../api/BaseService";
  import {APPID, URL} from "../../config/config";

  const crypto = require("crypto");

  export default {
    name: "InvitationCode",
    data() {
      return {
        myCodeData: [],         //我的邀请码
        codeRule: [],           //邀请码规则
      }
    },
    created() {
      api.getSignature(decodeURIComponent(location.href.split('#')[0]))
        .then((res) => {
          console.log("分享获取签名", res);
          if (res.code == 1) {
            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: res.data.appId, // 必填，公众号的唯一标识
              timestamp: res.data.timestamp, // 必填，生成签名的时间戳
              nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
              signature: res.data.signature,// 必填，签名
              jsApiList: res.data.jsApiList// 必填，需要使用的JS接口列表
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    mounted() {
      this._getMyCode();
      this._getCodeRule();
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
      shareGoto(val) {
        if (val === 'wechat') {
          console.log(1234)
          wx.onMenuShareAppMessage({
            title: '我是分享微信好友标题', // 分享标题
            desc: '我是分享微信好友描述', // 分享描述
            link: URL, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://wawa.app.xiaozhuschool.com/default.jpg', // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            success: function (res) {
// 用户点击了分享后执行的回调函数
              console.log('我是分享微信好友，QQ好友成功的回调:', res)
            }
          });
        }
        if (val === 'friend') {
          console.log(4567)
          wx.onMenuShareTimeline({
            title: '我是分享微信好友标题', // 分享标题
            link: URL, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://wawa.app.xiaozhuschool.com/default.jpg', // 分享图标
            success: function (res) {
              // 用户点击了分享后执行的回调函数
              console.log('我是分享朋友圈成功的回调:', res)
            }
          })
        }
        if (val === 'qqkong') {
          console.log(4567)
          wx.onMenuShareQZone({
            title: '我是分享QQ空间标题', // 分享标题
            desc: '我是分享QQ空间标题', // 分享描述
            link: URL, // 分享链接
            imgUrl: 'http://wawa.app.xiaozhuschool.com/default.jpg', // 分享图标
            success: function (res) {
              // 用户确认分享后执行的回调函数
              console.log('我是分享QQ空间成功的回调:', res)
            },
            cancel: function (res) {
              // 用户取消分享后执行的回调函数
              console.log('我是分享QQ空间失败的回调:', res)
            }
          });
        }
      },
    },
    components: {Qrcode, TitleBar}
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
