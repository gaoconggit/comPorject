<template>
  <TransitionScale>
    <div class="content-wrapper">
      <div class="box-wrap" v-if="platform===1">
        <div class="header">
          <div class="icon"><img src="~/img/mail/head.png" alt=""></div>
          <div class="sub">
            <p class="title">{{details.title}}</p>
            <p class="desc">发送人：系统</p>
          </div>
        </div>
        <div class="center" :class="{'active':details.type==6}">
          <p v-html="details.content"></p>
        </div>
        <div class="goods" v-if="details.type==6">
          <div v-if="content.coin">
            <div class="icon"><img src="~/img/mail/jb.png" alt=""></div>
            <p class="num">金币*{{content.coin}}</p>
          </div>
          <div v-if="content.score">
            <div class="icon"><img src="~/img/mail/score.png" alt=""></div>
            <p class="num">积分*{{content.score}}</p>
          </div>
        </div>
        <div class="btn-wrap" v-if="details.type==6&&details.status!=2">
          <div class="btn receive" @click="receiveNotice"><img src="~/img/mail/button.png" alt=""></div>
        </div>
        <div class="btn-wrap" v-else>
          <div class="btn delete" @click="deleteNotice"><img src="~/img/mail/delete_btn.png" alt=""></div>
          <div class="btn confirm" @click="confirmNotice"><img src="~/img/mail/confirm_btn.png" alt=""></div>
        </div>
      </div>
      <div class="box-wrap-sys" v-else>
        <h1 class="title">{{sysDetails.title}}</h1>
        <div class="content" v-html="sysDetails.content"></div>
      </div>
      <div class="mask" @click.stop="confirmNotice"></div>
    </div>
  </TransitionScale>
</template>

<script>
  import TransitionScale from "@/common/TransitionScale";
  import api from "../../api/BaseService";
  import {showToast} from "../../common/util/Utils";

  export default {
    name: "MailContent",
    props: ['id', 'platform'],
    data() {
      return {
        details: {},      //内容详情
        content: {},      //消息奖励
        status: 0,
        sysDetails: {},   //系统消息
      }
    },
    mounted() {
      if (!this.id) {
        this.$emit('close-popup', true);
      }
      if (this.platform === 1) {
        this._getNoticeInfo();
      } else {
        this._getSysNoticeInfo();
      }
    },
    methods: {
      async _getNoticeInfo() {
        if (this.id) {
          let result = await api.getNoticeInfo(this.id);
          if (result.data.attachment != "") {
            this.content = JSON.parse(result.data.attachment);
          }
          this.status = result.data.status;
          this.details = result.data;
        }
      },
      async _getSysNoticeInfo() {
        if (this.id) {
          let result = await api.getSysNoticeInfo(this.id);
          this.sysDetails = result.data;
        }
      },
      async deleteNotice() {
        let result = await api.deleteUserNotice(this.details.id);
        if (result.code == 1) {
          showToast(result.msg, 'success');
        } else {
          showToast(result.msg, 'cancel');
        }
        this.$emit('close-popup');
      },
      async receiveNotice() {
        this.$vux.loading.show({
          text: '加载中...'
        });
        let result = await api.getUserNoticeGoods(this.details.id);
        if (result.code == 1) {
          showToast(result.msg, 'success');
        } else {
          showToast(result.msg, 'cancel');
        }
        this.$vux.loading.hide();
        this.$emit('close-popup');
      },
      confirmNotice() {
        if (parseInt(this.status)) {
          this.$emit('close-popup', true);
        } else {
          this.$emit('close-popup');
        }
      },
      filter(value) {
        let reg = /(\<a\>)|(\<\/a\>)/g;
        if (value) {
          return value.replace(reg, "");
        }
        return value;
      }
    },
    components: {TransitionScale}
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .content-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: @bgOpacity;
    display: flex;
    justify-content: center;
    align-items: center;
    .mask {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
    }
    .box-wrap {
      padding: 20px;
      width: 600px;
      height: 600px;
      -webkit-border-radius: 20px;
      -moz-border-radius: 20px;
      border-radius: 20px;
      background-color: @whiteColor;
      overflow: hidden;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      .header {
        display: flex;
        align-items: center;
        .icon {
          margin: 0 20px;
          width: 110px;
          height: 110px;
          .img-spread;
        }
        .sub {
          line-height: 40px;
          flex: 1;
          font-size: @mainFontSize;
          color: #000;
          .over-ellip;
          .title {
            .over-ellip;
          }
          .desc {
            font-size: @subFontSize;
            color: @grayColor;
          }
        }
      }
      .center {
        margin: 10px 0;
        height: 350px;
        color: #000;
        &.active {
          height: 180px;
        }
      }
      .goods {
        margin-bottom: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 150px;
        & > div {
          margin: 0 14px;
        }
        .icon {
          width: 128px;
          height: 128px;
          .img-spread;
        }
        .num {
          font-size: @minFontSize;
          text-align: center;
        }
      }
      .btn-wrap {
        display: flex;
        justify-content: space-around;
        .btn {
          width: 216px;
          height: 92px;
          .img-spread;
          &.receive {
            width: 416px;
            height: 92px;
          }
        }
      }
    }
    .box-wrap-sys {
      padding: 20px;
      width: 600px;
      height: 300px;
      -webkit-border-radius: 20px;
      -moz-border-radius: 20px;
      border-radius: 20px;
      background-color: @whiteColor;
      overflow: hidden;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      .title {
        font-size: @mainFontSize;
        line-height: 40px;
        text-align: center;
        .over-ellip;
      }
      .content {
        padding: 10px 0;
        font-size: @subFontSize;
        line-height: @maxFontSize;
      }
    }
  }
</style>
