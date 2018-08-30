<template>
  <div class="room-wrapper">
    <div class="video-wrapper">
      <canvas class="video-wrap-main" ref="videoWrapMain"></canvas>
      <web-i-m @broadcastToAll="broadcastToAll" @listenToCancelReservation="listenToCancelReservation"
               @listenToReservation="listenToReservation" @listenToLiveOutRoom="listenToLiveOutRoom"
               @listenToEnterInRoom="listenToEnterInRoom" @listenToGameOver="listenToGameOver"
               @listenToStartGame="listenToStartGame" :exit-i-m="exitIM"
               @listenToCancelGame="listenToCancelGame" @listenToJoinGame="listenToJoinGame"
               @listenToChildEventSuccess="showMsgFromChildSuccess"
               @listenToChildEventFail="showMsgFromChildFail" commend-user-name="wodeluck" :tim_uid="tim_uid"
               :tim_sig="tim_sig" :send-msg-text="filterMessage" :begin-send-msg="isBeginSendMsg"
               :av-chat-room-id="roomId" :msg-type="msgType" :game-id="gameId"
               :reservation-random-num="reservationRandomNum"
               :room-id="roomId"/>
      <div class="header">
        <div class="back" @click="backRoom"><img src="~/img/room/game_back.png" alt=""></div>
        <div class="now-player">
          <div class="player-wrap" v-if="roomData.now_user!=null">
            <div class="now-avatar"><img :src="roomData.now_user.avatar" alt=""></div>
            <div class="now-user">
              <p class="name">{{roomData.now_user.user_nicename}}</p>
              <p>游戏中</p>
            </div>
          </div>
        </div>
        <div class="now-users">
          <p class="now-total">{{nowUsersLen}}人</p>
          <div class="item-user" :class="{'first':index === 0}" v-for="(user,index) in nowUsers">
            <img :src="user.avatar" alt="">
          </div>
        </div>
        <!--房间上报-->
        <div class="fix" @click="_getRoomServiceList"><img src="~/img/room/game_report.png" alt=""></div>
      </div>
      <div class="baosong-icon" v-if="roomData.baosong_num">
        <div class="icon-wrap">
          <div class="song-icon" v-for="(song,index) in roomData.baosong_num">
            <img v-if="index<roomData.baosong_progress" src="~/img/room/game_baosong_yes.png" alt="">
            <img v-else-if="index===roomData.baosong_num-1" src="~/img/room/game_baosong_give.png" alt="">
            <img v-else src="~/img/room/game_baosong_no.png" alt="">
          </div>
        </div>
        <p class="song-time">{{roomData.baosong_expire_time_str}}</p>
        <p class="song-text">还差{{roomData.baosong_num-roomData.baosong_progress}}局娃娃就送你</p>
      </div>
      <div class="left">
        <div class="icon praise" @click="sayGood(2)"><img src="~/img/room/say_good.png" alt=""></div>
        <div class="icon unpraise" @click="sayGood(1)"><img src="~/img/room/say_good.png" alt=""></div>
      </div>
      <div class="count-down" v-if="countDownNum>0"><span>{{countDownNum}}</span>s</div>
      <div class="score-center"></div>
    </div>
    <div class="opera-wrapper">
      <div v-if="!isGameStart" class="opera-box-no">
        <div class="chart-icon" @click="showChat"><img
          src="~/img/room/game_comments.png" alt=""></div>
        <div v-if="roomData.status" class="game-start-box" @click="()=>{console.log('开始游戏')}">
          <div class="game-start-btn"><img src="~/img/room/game_start.png" alt=""></div>
          <p class="price">{{spendcoin*multipleArray[multipleIndex]}}币/次</p>
        </div>
        <div v-if="!roomData.status&&isRoomWait" class="game-start-box" @click="()=>{console.log('预约抓娃娃')}">
          <div class="game-start-btn"><img src="~/img/room/game_pre.png" alt=""></div>
        </div>
        <div v-else-if="!roomData.status&&!isRoomWait" class="game-start-box" @click="()=>{console.log('取消预约抓娃娃')}">
          <div class="game-start-btn"><img src="~/img/room/game_pre_cancel.png" alt=""></div>
        </div>
        <div class="my-coin"><p class="coin">{{numMax(userInfo.coin)}}</p></div>
      </div>
      <div v-if="isGameStart" class="opera-box-yes">
        <div class="opera-btn">
          <div class="left" @click="roomGameCmd('LEFT')"><img src="~/img/room/game_btn_left.png" alt=""></div>
          <div class="right" @click="roomGameCmd('RIGHT')"><img src="~/img/room/game_btn_right.png" alt=""></div>
          <div class="up" @click="roomGameCmd('UP')"><img src="~/img/room/game_btn_up.png" alt=""></div>
          <div class="down" @click="roomGameCmd('DOWN')"><img src="~/img/room/game_btn_down.png" alt=""></div>
        </div>
        <div class="grab-btn" @click="roomGameCmd('GRAB')"><img src="~/img/room/game_btn_go.png" alt=""></div>
      </div>
    </div>
    <div v-transfer-dom>
      <popup v-model="isShowQuick" position="bottom" class="input-box">
        <ul>
          <li v-if="quickIndex === 1" v-for="item in quickMessage.negative">{{item}}</li>
          <li v-if="quickIndex === 2" v-for="item in quickMessage.positive">{{item}}</li>
        </ul>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="isShowInput" position="bottom" class="input-box">
        <input class="input-content" type="text" v-model="sendMsgText" v-focus="focusState" placeholder="请输入发送内容...">
        <p class="send-text" @click="filterMessage">发送</p>
      </popup>
    </div>
    <actionsheet v-model="isShowFixSheet" :menus="fixList" @on-click-menu="fixItemClick" show-cancel></actionsheet>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {Howl} from "howler";
  import {Actionsheet, Scroller, Popup, TransferDom} from "vux";
  import api from "../../api/BaseService";
  import {showToast, maxNum} from "../../common/util/Utils";
  import WebIM from "@/common/webIM";

  export default {
    name: "RoomIndex",
    directives: {
      TransferDom,
      focus: {
        update(el, value) {
          if (value) {
            el.focus();
          }
        }
      }
    },
    data() {
      return {
        roomId: 0, //房间ID，通过url传输
        roomData: [],       //房间信息
        spendcoin: 0,       //价格
        multipleIndex: 1,   //默认倍数
        multipleArray: [1, 3, 5, 10],  //积分倍数
        nowUsersLen: 0,     //当前房间人数
        nowUsers: [],       //当前房间数组
        isShowInput: false, //是否展示输入框
        focusState: false,  //是否聚焦
        input_text: '',     //输入框
        fixList: [],        //上报信息展示
        isShowFixSheet: false,
        menus2: {
          menu1: 'Share to friends',
          menu2: 'Share to timeline'
        },
        tim_uid: '',        //IM身份
        tim_sig: '',        //IM密钥
        sendMsgText: '',    //发送消息内容
        isShowQuick: false, //是否展示快捷聊天
        quickIndex: 1,      //展示点赞还是坏
        quickMessage: {},   //快捷聊天
        filterMessageSrc: [],//过滤关键字
        gameId: '',         //游戏ID
        msgType: '',        //消息类型
        reservationRandomNum: '',//当前预约用户id
        isBeginSendMsg: '',
        isGameStart: false,      //是否开始
        isRoomWait: false,  //是否预约成功
        exitIM: false,       //是否退出IM
        countDownNum: -1,     //倒计时
      };
    },
    created() {
      if (!this.$route.query.id) {
        this.$router.push({path: "/"});
      } else {
        this.roomId = this.$route.query.id;
        this._getJoinRoom();
        this._getQuickMessage();
        this._getKeyWord();
      }
    },
    mounted() {
      this.tim_sig = this.userInfo.tim_sig;
      this.tim_sig = 'eJx1z09PgzAYx-E7r6LpFaPtKAN22yYq2yB2fxjuQhgt0rgVhJpuGt*7EZeMi8-190m*eb4MAABcL1a3WZ5XH1Kl6lxzCEYADpDnDODNFdS1YGmmUqthHcAEIWS7rot7ip9q0fA0KxRv-pTtDF30ez0lGJdKFOJiMnYUsje37C3tcv93WvHajaH-Mg3ovTmPJpI*klVMcbvQZ42fljMred7uZvFkHeowrz0WbPyHSAflOLpD2yTJ3j99dJDF1K5K097I5c7cHyqNLV7uOaXjMG7np15SiSO-vISJTRwy9KDxbfwApfVXwQ__';
      this.tim_uid = 'wawaji' + this.userInfo.id;
      console.log("tim_sig:", this.tim_sig);
    },
    beforeRouteLeave(to, from, next) {
      this.bgmusic.stop();
      next();
    },
    methods: {
      async _getJoinRoom() {
        this.$vux.loading.show({
          text: "加载中..."
        });
        let result = await api.getJoinRoom(this.roomId);
        console.log(result);
        if (result.code != 1) {
          this.$router.back();
        }
        if (result.code == 1) {
          this.$vux.loading.hide();
          this._getRoomAudience(result.data.id);
          this.roomId = result.data.id;
          this.spendcoin = result.data.needcoin;
          this.roomData = result.data;
          this.bgmusic = new Howl({
            src: [result.data.bgmusic],
            autoplay: true,
            preload: true,
            loop: true
          });
          //按钮音效
          this.yx_anniu = new Howl({
            src: [result.data.yx_anniu],
            preload: true,
          })
          //倒计时音效
          this.yx_daojishi = new Howl({
            src: [result.data.yx_daojishi],
            preload: true,
          })
          //成功音效
          this.yx_chenggong = new Howl({
            src: [result.data.yx_chenggong],
            preload: true
          })
          //失败音效
          this.yx_shibai = new Howl({
            src: [result.data.yx_shibai],
            preload: true,
          })
          //开始音效
          this.yx_kaishi = new Howl({
            src: [result.data.yx_kaishi],
            preload: true,
          })
          //下抓音效
          this.yx_xiazhua = new Howl({
            src: [result.data.yx_xiazhua],
            preload: true,
          });
          /*视频播放*/
          let videoWrapMain = this.$refs.videoWrapMain;
          new JSMpeg.Player('ws://47.105.32.106:8080/room18/channel1', {canvas: videoWrapMain});
        } else {
          showToast(result.msg);
        }
      },
      async _getRoomAudience(roomId) {
        let result = await api.getRoomAudience(roomId);
        console.log(result);
        this.nowUsers = result.data;
        this.nowUsersLen = result.total;
      },
      async _getRoomServiceList() {
        let result = await api.getRoomServiceList();
        let arr = result.data;
        arr.forEach((item, index) => {
          arr[index].label = item.content;
          arr[index].value = item.id;
        });
        this.fixList = result.data;
        this.isShowFixSheet = true;
      },
      async _getQuickMessage() {//获取敏感字
        let result = await api.getQuickMessage();
        console.log("quick:", result);
        this.quickMessage = result.data;
      },
      async _getKeyWord() {//获取敏感字
        let result = await api.getKeyWord();
        this.filterMessageSrc = result.data;
      },
      listenToCancelReservation(data) {//取消预约娃娃机
        console.log("用户取消预约:", data);
        getRoomInfo(this.$route.query.roomId).then(res => {
          if (res && res.code == 1) {
            this.my_wait_rownum = res.data.my_wait_rownum;
            this.front_wait_num = res.data.front_wait_num;
          }
        })
      },
      listenToReservation(data) {//预约娃娃机
        console.log("用户预约娃娃机:", data);
        this._getJoinRoom();
      },
      listenToJoinGame() {   //监听预约到自己确认上机
        console.log("监听预约到自己确认上机")
      },
      listenToEnterInRoom() {//监听到有人进入房间
        console.log("监听到有人进入房间");
        this._getRoomAudience(this.roomId);
      },
      listenToLiveOutRoom() {//监听到有人退出房间
        console.log("监听到有人退出房间");
        this._getRoomAudience(this.roomId);
      },
      listenToGameOver() {//监听到游戏结束
        console.log("监听到游戏结束");
        this._getJoinRoom();
      },
      listenToStartGame() {//监听到游戏开始
        console.log("监听到游戏开始");
        this._getJoinRoom();
      },
      listenToCancelGame() {//监听预约到自己取消上机
        console.log("监听预约到自己取消上机")
      },
      broadcastToAll() {//监听操作结束，且不是本人
        console.log("监听操作结束，且不是本人");
        this._getJoinRoom();
      },
      showMsgFromChildSuccess(data) {//监听抓中了
        console.log("抓中了:", data);
      },
      showMsgFromChildFail(data) {  //监听未抓中
        console.log("未抓中:", data);
      },
      sendMsgToIM(data) {
        console.log(data);
      },
      roomGameCmd(opera) {
        console.log(opera);
        if (opera === 'GRAB') {
          this.yx_xiazhua.play();
        } else {
          this.yx_anniu.play();
        }
      },
      async fixItemClick(id) {
        console.log(id);
        if (id !== 'cancel') {
          this.$vux.loading.show({text: '正在上报中...'});
          let result = await api.getRoomFixReport(this.roomId, id)
          if (result.code == 1) {
            showToast(result.msg, "success", 3000, '300px');
            this.$vux.loading.hide();
          } else {
            setTimeout(() => {
              showToast(result.msg, "warn");
              this.$vux.loading.hide();
            }, 5000)
          }
        }
      },
      backRoom() {
        console.log("退出房间");
      },
      showChat() {
        this.sendMsgText = '';
        this.isShowInput = true;
        this.focusState = true;
      },
      //快捷语言
      sayGood(item) {
        console.log(item);
        this.quickIndex = item;
        this.isShowQuick = true;
      },
      filterMessage() {    //过滤关键字
        let _sendMsgText = '';
        let arrFilter = this.filterMessageSrc.join("|");
        if (this.sendMsgText.length) {
          _sendMsgText = this.sendMsgText.replace(new RegExp(arrFilter, 'ig'), '*');
          this.sendMsgText = '';
          this.isShowInput = false;
          this.sendMsgToIM(1);
        } else {
          showToast("请输入内容！");
        }
      },
      numMax(num) {
        if (Number(num) > 9999) {
          return 9999 + '+';
        } else {
          return num;
        }
      }
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    components: {Actionsheet, Scroller, Popup, WebIM}
  };
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .room-wrapper {
    background-color: @mainColor;
    .video-wrapper {
      position: relative;
      width: 100%;
      height: 1030px;
      z-index: 1;
      overflow: hidden;
      .video-wrap-main {
        position: absolute;
        left: -25%;
        width: 150%;
        height: 100%;
        //background-color: #000;
        z-index: -1;
      }
      .header {
        display: flex;
        align-items: center;
        height: 98px;
        .back, .fix {
          margin: 20px;
          width: 50px;
          height: 50px;
          .img-spread;
        }
        .now-player {
          flex: 1;
          .player-wrap {
            display: flex;
            align-items: center;
            .now-avatar {
              position: relative;
              width: 78px;
              height: 78px;
              -webkit-border-radius: 50%;
              -moz-border-radius: 50%;
              border-radius: 50%;
              overflow: hidden;
              z-index: 1;
              .img-spread;
            }
            .now-user {
              margin-left: -24px;
              padding: 7px 0 7px 60px;
              width: 200px;
              background-color: rgba(0, 0, 0, .4);
              border-top-right-radius: 64px;
              border-bottom-right-radius: 64px;
              p {
                padding-right: 20px;
                color: @whiteColor;
                font-size: @subFontSize;
                width: 100%;
                height: 32px;
                line-height: 32px;
                .over-ellip;
              }
            }
          }
        }
        .now-users {
          display: flex;
          align-items: center;
          .now-total {
            color: @whiteColor;
            margin-right: 16px;
          }
          .item-user {
            margin-left: -20px;
            width: 60px;
            height: 60px;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
            overflow: hidden;
            &.first {
              margin: 0;
            }
            .img-spread;
          }
        }
      }
      .baosong-icon {
        position: absolute;
        margin: 10px 20px;
        .icon-wrap {
          display: flex;
        }
        .song-icon {
          margin: 0 2px;
          width: 56px;
          height: 56px;
          .img-spread;
        }
        .song-text, .song-time {
          margin-top: 10px;
          font-size: @subFontSize;
          color: @catchText;
          font-weight: 600;
        }
      }
      .left {
        position: absolute;
        top: 240px;
        left: 20px;
        .icon {
          margin: 20px 0;
          width: 60px;
          height: 60px;
          .img-spread;
        }
        .unpraise {
          transform: rotate(180deg);
        }
      }
      .count-down {
        position: absolute;
        right: 40px;
        bottom: 40px;
        font-size: @maxFontSize;
        font-weight: 700;
        color: @whiteColor;
        span {
          font-size: 60px;
        }
      }
      .barrage-wrap {
        position: absolute;
        top: 520px;
        left: 20px;
        width: 400px;
        height: 360px !important;
        .chat-box {
          .tips {
            font-size: @minFontSize;
            line-height: 28px;
            color: @catchText;
          }
        }
      }
    }
    .opera-wrapper {
      padding-bottom: 10px;
      margin-top: -4px;
      .opera-box-no {
        display: flex;
        align-items: center;
        margin: 0 auto;
        width: 736px;
        height: 186px;
        .background-url('~img/room/game_op_bg.png');
        .chart-icon {
          margin-left: 35px;
          width: 131px;
          height: 70px;
          .img-spread;
        }
        .game-start-box {
          position: relative;
          flex: 1;
          .game-start-btn {
            margin: 0 auto;
            width: 308px;
            height: 110px;
            .img-spread;
          }
          .price {
            position: absolute;
            bottom: 12px;
            left: 0;
            right: 0;
            color: @whiteColor;
            font-size: @mainFontSize;
            font-weight: 600;
            text-align: center;
          }
        }
        .my-coin {
          margin-right: 35px;
          width: 163px;
          height: 65px;
          .background-url('~img/room/game_recharge.png');
          .coin {
            margin-left: 60px;
            margin-top: 14px;
            font-size: @subFontSize;
            color: @mainColor;
          }
        }
      }
      .opera-box-yes {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin: 0 auto;
        width: 710px;
        height: 315px;
        .background-url('~img/room/game_op_bg1.png');
        .opera-btn {
          position: relative;
          width: 50%;
          div {
            position: absolute;
            width: 140px;
            height: 140px;
            top: 0;
            left: 0;
            .img-spread;
          }
          .left {
            top: -60px;
            left: 10px;
          }
          .right {
            top: -60px;
            left: 200px;
          }
          .up {
            top: -150px;
            left: 100px;
          }
          .down {
            top: 30px;
            left: 100px;
          }
        }
        .grab-btn {
          width: 177px;
          height: 177px;
          .img-spread;
        }
      }
    }
  }

  .input-box {
    padding: 30px;
    display: flex;
    align-items: center;
    height: 100px;
    box-sizing: border-box;
    .input-content {
      flex: 1;
      margin-right: 20px;
      padding: 0 20px;
      height: 60px;
      -webkit-border-radius: 40px;
      -moz-border-radius: 40px;
      border-radius: 40px;
      border: 1px solid @grayColor;
      font-size: @maxFontSize;
    }
    .send-text {
      padding: 20px 40px;
      -webkit-border-radius: 40px;
      -moz-border-radius: 40px;
      border-radius: 40px;
      background-color: #A8DEFF;
    }
  }
</style>


