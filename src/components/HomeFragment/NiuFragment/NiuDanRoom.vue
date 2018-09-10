<!--
** 扭蛋房间
-->

<template>
  <div class="niu-room">
    <title-bar class="title-bar" :title="$route.query.title" left="left" :style="'background-color:#07040D'"/>
    <div class="niu-desc">
      <div class="need-coin">
        <div class="icon"><img src="~/img/com_img/icon_coin.png" alt=""></div>
        <p class="num">20/次</p>
      </div>
      <div class="my-coin">
        <p class="coin">{{showCoin(userInfo.coin)}}</p>
      </div>
    </div>
    <frameset>
      <frame :src="'../../../../static/dist/index.html' + $route.query.url" ref="iframe"/>
    </frameset>
    <div class="history-wrapper">
      <div class="niu-history">
        <p class="title">最近抓中记录</p>
        <ul class="niu-list">
          <li class="niu-item" v-for="item in historyList">
            <div class="icon"><img :src="item.avatar_thumb" alt=""></div>
            <div class="info">
              <p class="name">{{item.user_nicename}} 扭到了 ({{item.giftname}})</p>
              <p class="time">{{formatTime(item.ctime)}}</p>
            </div>
            <div class="get-icon"><img :src="item.gifticon" alt=""></div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {Howl} from "howler";
  import TitleBar from "@/common/TitleBar";
  import {getTimeDate, showToast, updateBaseInfo} from "../../../common/util/Utils";
  import api from "../../../api/BaseService";

  export default {
    name: "NiuDanRoom",
    data() {
      return {
        roomId: this.$route.query.id,
        historyList: [],                //扭蛋房间历史记录
      }
    },
    mounted() {
      if (!this.$route.query.id) {
        this.$router.back();
      }
      window.postMessage = (data) => {
        console.log(data);
        if (data === "Niudan") {
          console.log("扭到了");
          //this._getNiuRoomInfo(this.props.room_id);
          //DeviceEventEmitter.emit("mEventCoinChange", "扭中更新金币");
          updateBaseInfo();
        } else if (data === "NiudanSuccess") {
          //DeviceEventEmitter.emit("NiudanHistory", "扭中更新历史记录");
        } else if (data === "NiudanError") {
          showToast("数据获取失败", 'cancel');
        } else if (data == "-100") {
          //this.setState({noCoinWin: true});
          console.log("金币不足")
        } else if (data === "NiudanImage") {
          console.log("跳转到指定地方");
          //this.scrollView.scrollTo({y: scaleSize(1234), animated: true})
        } else if (data === "NiudanVoice") {
          /*if (this.state.isSound) {
            this.playSound(soundStart);
          }*/
          this.niuClick.play();
          console.log("播放声音");
        } else if (data === "NiudanSuccessVoice") {
          /*if (this.state.isSound) {
            this.playSound(soundSuccess);
          }*/
          this.niuSuccess.play();
          console.log("播放扭到的声音");
        } else {
          //showToast(data, 'cancel');
        }
      }
      this.niuClick = new Howl({
        src: [require('@/assets/video/niudan_click.mp3')],
        preload: true,
      });
      this.niuSuccess = new Howl({
        src: [require('@/assets/video/niudan_success.mp3')],
        preload: true,
      });
      this._getNiuDanHistory();
    },
    methods: {
      async _getNiuDanHistory() {
        let result = await api.getNiuDanHistory(this.roomId);
        console.log(result);
        this.historyList = result.data;
      },
      /*金币展示*/
      showCoin(num) {
        let coinNum = Number(num);
        if (coinNum) {
          if (coinNum < 10000) {
            return coinNum;
          } else {
            return 9999 + "+";
          }
        } else {
          return num;
        }
      },
      //格式化时间
      formatTime(num) {
        return getTimeDate(num);
      },
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    components: {TitleBar}
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  @titleBackgroundColor: #07040D;
  @titleHeight: 60px;

  .niu-room {
    margin-bottom: -@titleBarHeight;;
    background-color: @titleBackgroundColor;
    .title-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 10;
    }
    .niu-desc {
      padding: 0 50px;
      position: relative;
      top: @titleBarHeight;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: @titleBackgroundColor;
      .need-coin {
        display: flex;
        align-items: center;
        height: 62px;
        .icon {
          width: 62px;
          height: 62px;
          .img-spread;
        }
        .num {
          margin-left: 20px;
          color: @whiteColor;
        }
      }
      .my-coin {
        width: 178px;
        height: 65px;
        .background-url("~img/home/coin_bg.png");
        .coin {
          padding-left: 58px;
          width: 100px;
          line-height: 58px;
          font-size: @subFontSize;
          .over-ellip;
        }
      }
    }
    .history-wrapper {
      padding: 20px;
      background-color: @titleBackgroundColor;
      .niu-history {
        background-color: @whiteColor;
        border-radius: 40px;
        .title {
          padding: 0 40px;
          height: @titleHeight;
          line-height: @titleHeight;
          border-bottom: 2px solid #000;
        }
        .niu-list {
          padding: 20px 30px;
        }
        .niu-item {
          display: flex;
          align-items: center;
          .icon {
            margin-right: 20px;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            overflow: hidden;
            .img-spread;
          }
          .info {
            flex: 1;
            .over-ellip;
          }
          .get-icon {
            width: 90px;
            height: 90px;
            .img-spread;
          }
        }
      }
    }
  }
</style>
