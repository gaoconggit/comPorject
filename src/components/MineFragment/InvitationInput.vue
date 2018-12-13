<!--
** 输入邀请码
-->

<template>
  <div class="invitation-input">
    <title-bar title="输入邀请码"/>
    <div class="content">
      <div class="box">
        <input class="code-input" :class="{'active':isCodeInput}" type="text" v-model="codeInput"
               placeholder="请输入邀请码，领取金币">
        <div class="rule-box">
          <p class="title">奖励规则：</p>
          <p class="desc">{{codeRule.str}}</p>
        </div>
        <div class="confirm" @click="confirmCode">
          <img
            :src="isCodeInput?require('img/invitation/code_received_btn.png'):require('img/invitation/confirm_invite.png')"
            alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import TitleBar from "@/common/TitleBar";
  import {showToast, updateBaseInfo} from "../../common/util/Utils";
  import api from "../../api/BaseService";

  export default {
    name: "InvitationInput",
    data() {
      return {
        codeInput: "",
        isCodeInput: false,   //是否填写过邀请码
        codeRule: [],         //邀请码规则
      }
    },
    mounted() {
      this._getCodeRule();
      if (this.userInfo.input_code.length) {
        this.codeInput = this.userInfo.input_code;
        this.isCodeInput = true;
      }
    },
    watch: {
      userInfo() {
        if (this.userInfo.input_code.length) {
          this.codeInput = this.userInfo.input_code;
          this.isCodeInput = true;
        }
      }
    },
    methods: {
      async _getCodeRule() {
        let result = await api.getCodeRule();
        this.codeRule = result.data;
      },
      confirmCode() {
        let reg = /\d+/;
        let str = this.codeInput.replace(/\s/g, '');
        if (!str.length) {
          showToast('请输入邀请码');
          return false;
        }
        if (reg.test(str)) {
          api.postConvertCode(str)
            .then((res) => {
              if (res.code == 1) {
                updateBaseInfo();
              }
              showToast(res.msg, res.code == 1 ? 'success' : 'cancel');
            })
            .catch((err) => {
              console.log(err);
            })
        } else {
          showToast('请输入合法邀请码');
        }
      }
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    components: {TitleBar}
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .invitation-input {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    .content {
      position: absolute;
      top: @titleBarHeight;
      left: 0;
      bottom: 0;
      right: 0;
      background: linear-gradient(@mainColor, @whiteColor);
      .box {
        margin: 30px auto;
        width: 734px;
        height: 731px;
        .background-url("~img/invitation/invite_input_bg.png")
      }
      .code-input {
        position: absolute;
        top: 260px;
        left: 50%;
        width: 580px;
        height: 100px;
        border: none;
        background-color: @auxColor;
        color: @grayColor;
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
        border-radius: 50px;
        font-size: @subFontSize;
        padding: 0 20px;
        text-align: center;
        -webkit-transform: translateX(-50%);
        -moz-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
        -o-transform: translateX(-50%);
        transform: translateX(-50%);
        &.active {
          background-color: @lightGrayColor;
        }
      }
      .rule-box {
        position: absolute;
        top: 420px;
        left: 50%;
        width: 660px;
        -webkit-transform: translateX(-50%);
        -moz-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
        -o-transform: translateX(-50%);
        transform: translateX(-50%);
        .title {
          font-size: @mainFontSize;
        }
        .desc {
          height: 160px;
          overflow: auto;
          margin-top: 12px;
          padding-left: 50px;
          line-height: @maxFontSize;
          font-size: @subFontSize;
        }
      }
      .confirm {
        position: absolute;
        top: 634px;
        left: 50%;
        width: 642px;
        height: 92px;
        -webkit-transform: translateX(-50%);
        -moz-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
        -o-transform: translateX(-50%);
        transform: translateX(-50%);
        .img-spread;
      }
    }
  }
</style>
