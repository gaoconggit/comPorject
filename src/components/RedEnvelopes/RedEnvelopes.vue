<template>
  <div class="Red-data">
    <title-bar title="我的红包" class="title"/>
    <div class="Red-content">
      <header class="Red-header">
        <img src="../../assets/img/envelopes/header_bg.png" class="img-style" alt="">
        <p class="p_left" @click="envelopesBtn">红包兑换</p>
        <p class="p_right">红包明细</p>
        <div class="redNumber">{{parseInt(userInfo.redpacket)/100}}<span>元</span></div>
      </header>
      <div class="red_anniu" @click="invitationBtn">
        <img src="../../assets/img/envelopes/yaoqhy.png" class="img-style" alt="">
      </div>
      <div class="red_list">
        <dl v-for="(rule,index) in redPacketInfo.rules">
          <dt>
            <div class="list_img">{{index+1}}</div>
            {{rule.title}}
          </dt>
          <dd>{{rule.content}}</dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import TitleBar from "../../common/TitleBar";
  import api from "../../api/BaseService";

  export default {
    components: {TitleBar},
    name: "RedEnvelopes",
    data() {
      return {
        redPacketInfo: [],        //红包规则
      }
    },
    mounted() {
      this._getRedPacketHome();
    },
    methods: {
      async _getRedPacketHome() {
        let result = await api.getRedPacketHome();
        this.redPacketInfo = result.data;
      },
      envelopesBtn() {
        this.$router.push('/putforward');
      },
      invitationBtn() {
        this.$router.push('/invitation');
      }
    },
    computed: {
      ...mapGetters(['userInfo'])
    }
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .Red-data {
    .img-style {
      width: 100%;
      height: 100%;
    }
    .Red-content {
      width: 100%;
      .Red-header {
        width: 100%;
        height: 220px;
        position: relative;
        p {
          color: #fff;
          font-size: 30px;
          height: 40px;
          line-height: 40px;
          border-bottom: 1px solid #fff;
        }
        .p_left {
          position: absolute;
          top: 30px;
          left: 20px;
        }
        .p_right {
          position: absolute;
          top: 30px;
          right: 20px;
        }
        .redNumber {
          color: #fff;
          text-align: center;
          line-height: 60px;
          position: absolute;
          top: 30%;
          left: 50%;
          transform: translateX(-50%);
          font-size: 70px;
          font-weight: 600;
          span {
            font-size: 45px;
          }
        }
      }
    }
    .red_anniu {
      margin: 50px auto;
      width: 460px;
      height: 91px;
    }
    .red_list {
      width: 600px;
      margin: auto;
      dl {
        width: 100%;
        color: #656565;
        font-weight: bold;

        dt {
          font-size: 30px;
          height: 50px;
          line-height: 50px;
          margin: 10px 0px;
          .list_img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #ffb482;
            color: #fff;
            text-align: center;
            line-height: 50px;
            display: inline-block;
            margin-right: 10px;
          }
        }
        dd {
          font-size: 24px;
          height: 35px;
          line-height: 35px;
          display: inline-block;
          word-wrap: break-word;
          span {
            color: #fc8eab;
          }
        }
      }
    }
  }
</style>
