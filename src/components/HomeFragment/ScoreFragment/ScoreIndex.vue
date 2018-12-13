<template>
  <!--积分商城嵌套页面-->
  <div class="score-wrapper" ref="scoreWrapper">
    <iframe v-if="production"
            :src="'../../../../static/web/score/index.html' + `?base_url=${baseUrl}&token=${token}&uid=${uid}`"
            width="100%" height="100%"></iframe>
    <iframe v-else
            :src="'./static/web/score/index.html' + `?base_url=${baseUrl}&token=${token}&uid=${uid}`"
            width="100%" height="100%"></iframe>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {baseUrl} from "../../../config/config";
  import api from "../../../api/BaseService";

  export default {
    name: "Index",
    data() {
      return {
        scoreURL: '',
        baseUrl: baseUrl,
        production: process.env.NODE === 'production' ? true : false,
      }
    },
    mounted() {
      window.pay = (data) => {
        data = JSON.parse(data);
        this.$wechat.chooseWXPay({
          timestamp: data.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
          package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
          signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: data.paySign, // 支付签名
          success: function (res) {
            // 支付成功后的回调函数
            console.log("支付成功的回调", res)
            api.postReportPayResult(data.oid, 3);
            showToast('支付成功', 'text', 500);
          },
          cancel: function (res) {
            console.log("支付取消的回调", res)
            api.postReportPayResult(data.oid, 4);
            showToast('支付取消', 'text', 500);
          },
          error: function (err) {
            console.log("支付失败的回调", err)
            api.postReportPayResult(data.oid, 5);
            showToast('支付失败', 'text', 500);
          }
        })
      }
    },
    methods: {
      async _getScoreUrl() {
        let result = await api.getScoreUrl();
        console.log(result, "------------");
        console.log(`?base_url=${this.baseUrl}&token=${this.token}&uid=${this.uid}`);
        this.scoreURL = result.data.url;
      }
    },
    computed: {
      ...mapGetters(['token', 'uid'])
    }
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .score-wrapper {
    position: absolute;
    width: 100%;
    top: 0;
    bottom: @tabBarHeight;
  }
</style>
