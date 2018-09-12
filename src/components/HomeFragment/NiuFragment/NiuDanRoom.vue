<!--
** 扭蛋房间
-->

<template>
  <div class="niu-room">
    <title-bar class="title-bar" :title="$route.query.title" left="left" :style="'background-color:#07040D'"
               @get-title-height="titleHeight"/>
    <div class="niu-desc" ref="niuDesc">
      <div class="need-coin">
        <div class="icon"><img src="~/img/com_img/icon_coin.png" alt=""></div>
        <p class="num">{{niudanInfo.price}}/次</p>
      </div>
      <div class="my-coin">
        <p class="coin">{{showCoin(userInfo.coin)}}</p>
      </div>
    </div>
    <iframe v-if="production" :src="'../../../../static/dist/index.html' + $route.query.url"
            ref="iframe" class="iframe"></iframe>
    <iframe v-else :src="'./static/dist/index.html' + $route.query.url" ref="iframe" class="iframe"></iframe>
    <p class="down-icon"></p>
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
    <div class="img-wrapper">
      <div class="niu-history img-desc">
        <p class="title">扭蛋详情</p>
        <img class="desc-img" v-for="(item,index) in niudanInfo.img" :key="index" :src="item" alt="">
      </div>
    </div>
    <less-coin v-if="isLessCoin" @close-less-coin="closeLessCoin"/>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {Howl} from "howler";
  import TitleBar from "@/common/TitleBar";
  import LessCoin from "../../RoomFragment/LessCoin";
  import {getTimeDate, showToast, updateBaseInfo} from "../../../common/util/Utils";
  import api from "../../../api/BaseService";

  export default {
    name: "NiuDanRoom",
    data() {
      return {
        roomId: this.$route.query.id,
        niudanInfo: [],
        historyList: [],                //扭蛋房间历史记录
        topHeight: 0,                   //历史记录到顶部的高度
        isLessCoin: false,              //金币不足
        production: process.env.NODE === 'production' ? true : false,
      };
    },
    mounted() {
      if (!this.$route.query.id) {
        this.$router.back();
      }
      window.postMessage = (data) => {
        if (data === "Niudan") {
          this._getNiudanRoomInfo();
          updateBaseInfo();
        } else if (data === "NiudanSuccess") {
          this._getNiuDanHistory();
        } else if (data === "NiudanError") {
          showToast("数据获取失败", 'cancel');
        } else if (data == "-100") {
          this.isLessCoin = true;
        } else if (data === "NiudanImage") {
          window.scrollTo(0, this.topHeight);
        } else if (data === "NiudanVoice") {
          if (this.userInfo.user_setting.yx == 1) {
            this.niuClick.play();
          }
        } else if (data === "NiudanSuccessVoice") {
          if (this.userInfo.user_setting.yx == 1) {
            this.niuSuccess.play();
          }
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
      this._getNiudanRoomInfo();
      this._getNiuDanHistory();
    },
    methods: {
      //获取扭蛋房间信息
      async _getNiudanRoomInfo() {
        let result = await api.getNiudanRoomInfo(this.roomId);
        this.niudanInfo = result.data;
      },
      //获取扭蛋房间历史图
      async _getNiuDanHistory() {
        let result = await api.getNiuDanHistory(this.roomId);
        this.historyList = result.data;
      },
      closeLessCoin() {
        this.isLessCoin = false;
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
      titleHeight(height) {
        this.topHeight = this.$refs.iframe.clientHeight + this.$refs.niuDesc.clientHeight - height;
      },
      //格式化时间
      formatTime(num) {
        return getTimeDate(num);
      },
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    components: {TitleBar, LessCoin}
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
    .iframe {
      margin-top: 20px;
      width: 100%;
      height: 1200px;
    }
    .down-icon {
      margin: -20px auto 0;
      width: 60px;
      height: 60px;
      transform: rotate(-90deg);
      .background-url("~img/com_img/icon_bakc.png");
    }
    .history-wrapper, .img-wrapper {
      padding: 20px;
      background-color: @titleBackgroundColor;
      .niu-history {
        background-color: @whiteColor;
        border-radius: 40px;
        .title {
          padding: 20px 40px;
          height: @titleHeight;
          line-height: @titleHeight;
          border-bottom: 2px solid #000;
        }
        .niu-list {
          padding: 20px 30px;
        }
        .niu-item {
          margin: 6px 0;
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
            p {
              line-height: 44px;
            }
            .name {
              .over-ellip;
            }
            .time {
              font-size: @subFontSize;
              color: @grayColor;
            }
          }
          .get-icon {
            width: 90px;
            height: 90px;
            .img-spread;
          }
        }
      }
      .img-desc {
        overflow: hidden;
      }
      .desc-img {
        width: 100%;
      }
    }
  }
</style>
