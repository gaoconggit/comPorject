<template>
  <div class="room-wrapper">
    <div class="video-wrapper">
      <canvas class="video-wrap-main" ref="videoWrapMain"></canvas>
      <odl-web-i-m @broadcastToAll="broadcastToAll" @listenToCancelReservation="listenToCancelReservation"
                   @listenToReservation="listenToReservation" @listenToLiveOutRoom="listenToLiveOutRoom"
                   @listenToEnterInRoom="listenToEnterInRoom" @listenToGameOver="listenToGameOver"
                   @listenToStartGame="listenToStartGame" :exit-i-m="exitIM"
                   @listenToCancelGame="listenToCancelGame" @listenToJoinGame="listenToJoinGame"
                   @listenGrabResult="showListenGrabResult"
                   @listenToNotice="listenToNotice"
                   commend-user-name="wodeluck" :tim_uid="tim_uid"
                   :tim_sig="tim_sig" :send-msg-text="filterMessage" :begin-send-msg="isBeginSendMsg"
                   :av-chat-room-id="roomId" :msg-type="msgType" :game-id="gameId"
                   :reservation-random-num="reservationRandomNum"
                   :room-id="roomId"/>
      <!--<web-i-m @broadcastToAll="broadcastToAll" @listenToCancelReservation="listenToCancelReservation"
               @listenToReservation="listenToReservation" @listenToLiveOutRoom="listenToLiveOutRoom"
               @listenToEnterInRoom="listenToEnterInRoom" @listenToGameOver="listenToGameOver"
               @listenToStartGame="listenToStartGame" :exit-i-m="exitIM"
               @listenToCancelGame="listenToCancelGame" @listenToJoinGame="listenToJoinGame"
               @listenGrabResult="showListenGrabResult"
               @listenToNotice="listenToNotice"
               :tim_sig="tim_sig" :send-msg-text="filterMessage" :begin-send-msg="isBeginSendMsg"
               :msg-type="msgType" :game-id="gameId"
               :room-id="roomId"/>-->
      <!--返回按钮-->
      <div class="header">
        <div class="back" @click="backRoom"><img src="~/img/room/game_back.png" alt=""></div>
        <div class="now-player" @click="nowUserInfo">
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
      <!--保送场次-->
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
      <!--快捷语言-->
      <div class="left">
        <div class="icon praise" @click="sayGood(2)"><img src="~/img/room/say_good.png" alt=""></div>
        <div class="icon unpraise" @click="sayGood(1)"><img src="~/img/room/say_good.png" alt=""></div>
      </div>
      <!--倒计时-->
      <div class="count-down" v-if="countDownNum>=0"><span>{{countDownNum}}</span>s</div>
      <!--积分加倍-->
      <div class="score-center" v-if="isMultiple">
        <div class="btn-box">
          <div class="reduce" @click="scoreReduce"><img
            :src="multipleReduce?require('img/room/integral_reduce.png'):require('img/room/integral_reduce_not.png')"
            alt=""></div>
          <div class="multiple"><img :src="multipleNum" alt=""></div>
          <div class="add" @click="scoreAdd"><img
            :src="multipleAdd?require('img/room/integral_add.png'):require('img/room/integral_add_not.png')" alt="">
          </div>
        </div>
        <div class="score-text"><img src="~/img/room/integral_text.png" alt=""></div>
      </div>
    </div>
    <!--操作盘-->
    <div class="opera-wrapper">
      <div v-if="!isGameStart" class="opera-box-no">
        <div class="chart-icon" @click="showChat"><img
          src="~/img/room/game_comments.png" alt=""></div>
        <div v-if="roomData.status==1&&!isRoomWait" class="game-start-box" @click="_gameStart">
          <div class="game-start-btn"><img src="~/img/room/game_start.png" alt=""></div>
          <p class="price">{{spendcoin*multipleArray[multipleIndex]}}币/次</p>
        </div>
        <div v-if="roomData.status==2&&!isRoomWait" class="game-start-box" @click="_getRoomWait">
          <div class="game-start-btn"><img src="~/img/room/game_pre.png" alt=""></div>
        </div>
        <div v-else-if="isRoomWait" class="game-start-box" @click="_getRoomWait">
          <div class="game-start-btn"><img src="~/img/room/game_pre_cancel.png" alt=""></div>
        </div>
        <router-link class="my-coin" :to="{path:'/recharge',query:{}}">
          <p class="coin">{{numMax(userInfo.coin)}}</p>
        </router-link>
      </div>
      <div v-if="isGameStart" class="opera-box-yes">
        <div class="opera-btn">
          <div class="left" @click="roomGameCmd('left')"><img src="~/img/room/game_btn_left.png" alt=""></div>
          <div class="right" @click="roomGameCmd('right')"><img src="~/img/room/game_btn_right.png" alt=""></div>
          <div class="up" @click="roomGameCmd('up')"><img src="~/img/room/game_btn_up.png" alt=""></div>
          <div class="down" @click="roomGameCmd('down')"><img src="~/img/room/game_btn_down.png" alt=""></div>
        </div>
        <div class="grab-btn" @click="roomGameCmd('grab')"><img src="~/img/room/game_btn_go.png" alt=""></div>
      </div>
    </div>
    <desc-wrapper :history="roomHistory" :imgs="roomData.img" :addscore="roomData.addscore"/>
    <div v-transfer-dom>
      <popup v-model="isShowQuick" position="bottom" class="quick-wrap">
        <li class="quick-item" v-if="quickIndex === 1" v-for="item in quickMessage.negative" @click="quickItem(item)">
          {{item}}
        </li>
        <li class="quick-item" v-if="quickIndex === 2" v-for="item in quickMessage.positive" @click="quickItem(item)">
          {{item}}
        </li>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="isShowInput" position="bottom" class="input-box">
        <input class="input-content" type="text" v-model="sendMsgText" v-focus="focusState" placeholder="请输入发送内容...">
        <p class="send-text" @click="sendMsg">发送</p>
      </popup>
    </div>
    <actionsheet v-model="isShowFixSheet" :menus="fixList" @on-click-menu="fixItemClick" show-cancel></actionsheet>
    <less-coin v-if="isShowLess" @close-less-coin="closeComp('isShowLess')"/>
    <result-popup
      v-if="resultPopup"
      @close-result-popup="closeComp('resultPopup')"
      @again-game-start="againGameStart"
      @new-room-exit="backRoom"
      :isNewRoom="isNewRoom"
      :isBaosong="Number(roomData.baosong_num)-Number(roomData.baosong_progress)"
      :resultType="isResultSuccess"
      :expireTime="roomData.baosong_expire_time_str"
      :countDownResult="countDownResult"
      :getGiftIcon="roomData.gifticon"/>
    <room-exit
      v-if="isExitRoom"
      :data="exitRoomData"
      :name="roomData.giftname"
      :isNewRoom="isNewRoom"
      @close-exit-popup="closeComp('isExitRoom')"
      @exit-room="sendMsgToIM(4)"/>
    <make-down-dialog
      v-if="isMakeDown"
      :makeCountDown="makeCountDown"
      @mask-cancel="closeComp('isMakeDown')"
      @mask-confirm="confirmGame"/>
    <now-game-back
      v-if="isTrueBack"
      @back-cancel="closeComp('isTrueBack')"
      @back-confirm="backConfirm"
    />
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from "vuex";
  import {Howl} from "howler";
  import md5 from "js-md5";
  import {Actionsheet, Scroller, Popup, TransferDom} from "vux";
  import api from "../../api/BaseService";
  import {showToast, maxNum, updateBaseInfo} from "../../common/util/Utils";
  //import WebIM from "@/common/webIM";
  import odlWebIM from "@/common/oldwebIM";
  import DescWrapper from "./DescWrapper";
  import LessCoin from "./LessCoin"
  import ResultPopup from "./ResultPopup";
  import RoomExit from "./RoomExit";
  import MakeDownDialog from "./MakeDownDialog"
  import NowGameBack from "./NowGameBack"
  import {getStore} from "../../common/util/ImUtils";

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
        roomId: 0,          //房间ID，通过url传输
        wawaId: 0,          //娃娃id
        roomData: [],       //房间信息
        isNewRoom: 0,       //是否是新手场
        roomHistory: [],    //房间历史记录
        spendcoin: 0,       //价格
        isMultiple: false,
        multipleIndex: 0,   //积分场默认倍数
        multipleArray: [1, 2, 3, 5, 10],  //积分倍数
        multipleReduce: false,         //积分倍数减是否能点击
        multipleAdd: false,             //积分倍数加是否能点击
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
        isGameStart: false, //是否开始
        isTrueBack: false,  //正在游戏中是否退出房间
        isRoomWait: false,  //是否预约成功
        exitIM: false,       //是否退出IM
        countDownNum: -1,     //倒计时
        countDownResult: -1,  //结果倒计时
        makeCountDown: -1,    //轮到自己
        isMakeDown: false,    //展示轮到自己
        isShowLess: false,    //是否展示金币不足
        resultPopup: false,   //结果弹窗
        isExitRoom: false,    //退出房间提示
        exitRoomData: {},     //退出房间内容
        isResultSuccess: 1,//抓取结果是否成功
        tcpPort: '',          //WebSocket端口
        tcpIP: '',            //WebSocketIP
        webSocket: '',        //WebSocket连接
        isVideo: true,
        user_setting: {},
        player: null,         //当前视频是否在播放
      };
    },
    created() {
      console.log('---query---', this.$route.query);
      if (!this.$route.query.hasOwnProperty('id')) {
        this.$router.push({path: "/home/index"});
      } else {
        this.wawaId = this.$route.query.id;
        this._getBaseInfo();
        this._getJoinRoom();
        this._getQuickMessage();
        this._getKeyWord();
      }
    },
    mounted() {
      // this.tim_sig = 'eJx1z09PgzAYx-E7r6LpFaPtKAN22yYq2yB2fxjuQhgt0rgVhJpuGt*7EZeMi8-190m*eb4MAABcL1a3WZ5XH1Kl6lxzCEYADpDnDODNFdS1YGmmUqthHcAEIWS7rot7ip9q0fA0KxRv-pTtDF30ez0lGJdKFOJiMnYUsje37C3tcv93WvHajaH-Mg3ovTmPJpI*klVMcbvQZ42fljMred7uZvFkHeowrz0WbPyHSAflOLpD2yTJ3j99dJDF1K5K097I5c7cHyqNLV7uOaXjMG7np15SiSO-vISJTRwy9KDxbfwApfVXwQ__';
      this.tim_sig = getStore('wawaji_tim_sig');
      this.tim_uid = getStore('wawaji_tim_uid');
      this.user_setting = this.userInfo.user_setting;

      //监听物理返回按钮
      window.addEventListener("popstate", () => {
        if (this.isGameStart) {
          this.isTrueBack = true;
        } else {
          this.sendMsgToIM(4);
        }
      }, false)
    },
    watch: {
      isTrueBack(newVal, oldVal) {
        if (newVal === true) {
          //拦截物理返回
          let state = {
            title: "",
            url: this.$router.path // 这个url可以随便填，只是为了不让浏览器显示的url地址发生变化，对页面其实无影响
          };
          window.history.pushState(state, state.title, state.url);
        }
      },
    },
    beforeRouteLeave(to, from, next) {
      if (this.bgmusic) {
        this.bgmusic.stop();
      }
      next();
    },
    methods: {
      ...mapMutations({
        set_userInfo: 'SET_USER_INFO',
        set_nowUserId: 'SET_NOW_USER_ID',
      }),
      sendMsgToIM(data) {
        console.log("data:", data);
        console.log("data:", this.roomId);
        this.isBeginSendMsg = Date.now();//IM需要监听发生变化
        this.msgType = data;
      },
      quitRoomToIM() {
        this.exitIM = Date.now();//IM需要监听发生变化
      },
      async _getBaseInfo() {
        let result = await api.getBaseInfo();
        this.set_userInfo(result.data);
      },
      async _getJoinRoom() {
        let roomId = this.$route.query.roomId;
        this.$vux.loading.show({
          text: "加载中..."
        });
        let result = await api.getJoinRoom(this.wawaId, roomId);
        console.log(result);
        if (result.code != 1) {
          this.$vux.loading.hide();
          this.$router.back();
        }
        if (result.code == 1) {
          if (!this.roomHistory.length) {
            this._getRoomHistory(result.data.id);
          }
          if (!this.nowUsers.length) {
            this._getRoomAudience(result.data.id);
          }
          if (Number(this.userInfo.coin) > Number(result.data.spendcoin) * 2) {
            this.multipleAdd = true;
          }
          this.roomId = result.data.id;
          this.spendcoin = result.data.spendcoin;
          this.isNewRoom = parseInt(result.data.is_newbee);
          this.isMultiple = !!Number(result.data.result_type);
          /*if (result.data.now_user != null) {//再次进入时，判断是否为自己
            if (result.data.now_user.id == this.userInfo.id) {
              this.isGameStart = true;
              //this._gameStart();
            }
          }*/
          this.roomData = result.data;
          if (this.user_setting != null) {
            if (this.user_setting.bgmusic == 1) {
              //背景音乐
              if (!this.bgmusic) {
                this.bgmusic = new Howl({
                  src: [result.data.bgmusic],
                  autoplay: true,
                  preload: true,
                  loop: true
                });
              }
              //游戏中背景音乐
              this.game_bgmusic = new Howl({
                src: [result.game_bgmusic],
                preload: true,
                loop: true
              });
            }
            if (this.user_setting.yx == 1) {
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
            }
          }
          /*视频播放*/
          let videoWrapMain = this.$refs.videoWrapMain;
          if (!this.player) {
            console.log('视频是否在播放');
            this.player = new JSMpeg.Player(this.roomData.video1_h5, {canvas: videoWrapMain});
          }
          setTimeout(() => {
            this.sendMsgToIM(3);
          }, 300);
          this.$vux.loading.hide();
        } else {
          showToast(result.msg);
        }
      },
      //开始游戏
      async _gameStart() {
        console.log("开始游戏");
        if (Number(this.userInfo.coin) > this.multipleArray[this.multipleIndex] * Number(this.roomData.spendcoin)) {
          this.$vux.loading.show({
            text: "连接中..."
          });
          let result = await api.getGameStart(this.roomId, this.multipleArray[this.multipleIndex]);
          console.log(result);
          if (result.code == 1) {
            showToast("游戏开始", 'success', 1000);
            if (this.bgmusic) {
              this.bgmusic.stop();
            }
            if (this.yx_kaishi) {
              this.yx_kaishi.stop();
            }
            if (this.game_bgmusic) {
              this.game_bgmusic.stop();
            }
            this.sendMsgToIM(2);
            this.isGameStart = true;
            this.tcpIP = result.data.tcpIP;
            this.webPort = result.data.webPort;
            this.macno = result.data.fac_id;
            this.sysnum = result.data.ctime;
            this.move_time = result.data.move_time;
            this.top_time = result.data.top_time;
            this.mactype = result.data.mactype;
            this.webSocket = new WebSocket(`wss://${this.tcpIP}:${this.webPort}`);
            console.log("+++++++++", this.webSocket, "++++++");
            this.countDown('countDownNum', 30);
            this._getBaseInfo();
          } else {
            if (this.yx_shibai) {
              this.yx_shibai.play();
            }
            showToast(result.msg, 'cancel');
          }
          this.$vux.loading.hide();
        } else {
          this.isShowLess = true;
        }
      },
      //再来一局
      againGameStart() {
        console.log("4,", this.countDownNum);
        clearInterval(this.resultTimer);
        this.resultTimer = null;
        this.countDownResult = -1;
        this.resultPopup = false;
        this._gameStart();
      },
      //预约/取消抓娃娃
      async _getRoomWait() {
        let result = await api.getRoomWait(this.roomId);
        showToast(result.msg, 'success');
        this.isRoomWait = !this.isRoomWait;
      },
      async _getRoomAudience(roomId) {//获取房间当前玩家
        let result = await api.getRoomAudience(roomId);
        this.nowUsers = result.data;
        this.nowUsersLen = result.total;
      },
      async _getRoomHistory(roomId) {//获取房间历史记录
        let result = await api.getRoomHistory(roomId);
        this.roomHistory = result.data;
      },
      async _getRoomServiceList() {//获取房间上报列表
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
        this.quickMessage = result.data;
      },
      async _getKeyWord() {//获取敏感字
        let result = await api.getKeyWord();
        this.filterMessageSrc = result.data;
      },
      listenToCancelReservation(data) {//取消预约娃娃机
        console.log("用户取消预约:", data);
      },
      listenToReservation(data) {//预约娃娃机
        console.log("用户预约娃娃机:", data);
        this._getJoinRoom();
      },
      listenToJoinGame(data) {   //监听预约到自己确认上机
        console.log("监听预约到自己确认上机")
        if (data.user_id == this.userInfo.id) {
          this.countDown("makeCountDown", 5, "makeCountTimer");
          this.isMakeDown = true;
        } else {
          this._getJoinRoom();
        }
      },
      listenToEnterInRoom() {//监听到有人进入房间
        console.log("监听到有人进入房间");
        this._getRoomAudience(this.roomId);
      },
      listenToLiveOutRoom(data) {//监听到有人退出房间
        console.log("监听到有人退出房间", data === this.userInfo.id);
        if (this.userInfo.id === data) {
          if (this.bgmusic) {
            this.bgmusic.stop();
          }
          if (this.yx_anniu) {
            this.yx_anniu.stop();
          }
          if (this.yx_shibai) {
            this.yx_shibai.stop();
          }
          if (this.yx_xiazhua) {
            this.yx_xiazhua.stop();
          }
          if (this.yx_daojishi) {
            this.yx_daojishi.stop();
          }
          if (this.yx_chenggong) {
            this.yx_chenggong.stop();
          }
          this.$vux.loading.hide();
          this.quitRoomToIM();
          // this.$router.back(-1);
          this.$router.push('/home/index');
        } else {
          this._getRoomAudience(this.roomId);
        }
      },
      listenToGameOver() {//监听到游戏结束
        console.log("监听到游戏结束");
        this.countDownNum = -1;
        this.isGameStart = false;
        this._getBaseInfo();
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
      listenToNotice(data) {
        console.log("监听有人抓中了娃娃");
        this._getRoomHistory(this.roomData.id);
      },
      showListenGrabResult(data) {//监听抓取结果
        console.log("监听抓取结果:", data);
        if (data.user_id === this.userInfo.id) {
          if (parseInt(data.success)) {
            if (this.isNewRoom) {
              this.$store.commit('isOneShow', true);
            }
            this.sendMsgText = "抓中了一个娃娃";
            this.sendMsgToIM(1);
          } else {
            this.sendMsgText = "没有夹中娃娃，怪我喽~~";
            this.sendMsgToIM(1);
          }
        }
        if (data.user_id === this.userInfo.id) {
          if (parseInt(data.success)) {
            if (this.yx_chenggong) {
              if (!this.isNewRoom) {
                this.countDown('countDownResult', 6, "resultTimer");
              }
              this.yx_chenggong.play();
            }
          } else {
            if (this.yx_shibai) {
              this.countDown('countDownResult', 6, "resultTimer");
              this.yx_shibai.play();
            }
          }

          //this.countDown('countDownResult', 6, "resultTimer");
          //this.soundPool.pause();
          if (this.game_bgmusic) {
            this.game_bgmusic.stop();
          }
          if (this.bgmusic) {
            this.bgmusic.play();
          }
          this.isResultSuccess = parseInt(data.success);
          this.isGameStart = false;
          this.resultPopup = true;
          updateBaseInfo();
          this.webSocket.close(1000);
          this.webSocket = null;
        }
        this._getJoinRoom();
      },
      roomGameCmd(opera) {
        console.log(opera);
        this.sign = md5(this.macno + "DLCwawa" + opera);
        const sendObj = {};
        sendObj.macno = this.macno;
        sendObj.sysnum = this.sysnum;
        sendObj.type = opera;
        sendObj.move_time = this.move_time;
        sendObj.top_time = this.top_time;
        sendObj.mactype = this.mactype;
        sendObj.sign = this.sign;
        console.log("sendObj", sendObj);
        this.webSocket.send(JSON.stringify(sendObj));
        if (opera === 'grab') {
          console.log("5,", this.countDownNum);
          clearInterval(this.timer);
          this.timer = null;
          this.countDownNum = -1;
          if (this.yx_xiazhua) {
            this.yx_xiazhua.play();
          }
        } else {
          if (this.yx_anniu) {
            this.yx_anniu.play();
          }
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
      //前往充值中心
      gotoRecharge() {
        this.$router.push({path: '/recharge'})
      },
      //正在游戏中退出房间
      backConfirm() {

        this.exitIM = Date.now();
        this.webSocket.close(1000);
        this.webSocket = null;
        this.sendMsgToIM(4);
      },
      //退出房间
      backRoom(a, bool = false) {
        if (bool) {
          console.log(a, bool);
        } else {
          if (this.isGameStart) {
            this.isTrueBack = true;
            console.log('开始游戏是否退出');
          } else {
            this.backRoomFunc();
          }
        }
      },
      backRoomFunc() {
        if (Number(this.roomData.baosong_num) || this.isNewRoom) {
          api.getRoomExit(this.roomId)
            .then((result) => {
              if (result.code == 1) {
                console.log("getRoomExit:", result);
                console.log("getRoomExit:", this.roomData.baosong_num);
                console.log("getRoomExit:", result.data.baosong_remain_count);
                if (this.roomData.baosong_num > result.data.baosong_remain_count && result.data.baosong_remain_count) {
                  this.isExitRoom = true;
                  this.isBoolBack = true;
                  this.exitRoomData = result.data;
                } else {
                  this.vidoe = null;
                  this.sendMsgToIM(4);
                }
              } else {
                this.vidoe = null;
                this.sendMsgToIM(4);
              }
            })
            .catch(() => {
              this.sendMsgToIM(4);
            })
        } else {
          this.sendMsgToIM(4);
        }
      },
      //减积分
      scoreReduce() {
        if (this.multipleReduce) {
          this.multipleIndex--;
          if (this.multipleIndex <= 0) {
            this.multipleReduce = false
          } else {
            this.multipleAdd = true;
          }
        }
      },
      scoreAdd() {
        if (this.multipleAdd) {
          this.multipleIndex++;
          if (this.multipleIndex >= this.multipleArray.length - 1) {
            this.multipleAdd = false;
          } else {
            if (this.multipleArray[this.multipleIndex + 1] * this.roomData.spendcoin > this.userInfo.coin) {
              this.multipleAdd = false;
            } else {
              this.multipleReduce = true;
            }
          }
        }
      },
      showChat() {
        this.sendMsgText = '';
        this.isShowInput = true;
        this.focusState = true;
      },
      //快捷语言
      sayGood(item) {
        this.quickIndex = item;
        this.isShowQuick = true;
      },
      //发送快捷语言
      quickItem(value) {
        this.sendMsgText = value;
        this.isShowQuick = false;
        this.sendMsgToIM(1);
      },
      //发送消息
      sendMsg() {
        if (this.sendMsgText.length <= 0) {
          showToast('请输入内容')
        } else {
          this.isShowInput = false;
          this.sendMsgToIM(1);
        }
      },
      //关闭组件
      closeComp(name) {
        if (name === 'resultPopup' || name === 'isMakeDown') {
          this.isRoomWait = false;
          api.getRoomGameCancel(this.roomId);
        }
        this[name] = false;
      },
      //
      confirmGame() {
        this.isMakeDown = false;
        this.isRoomWait = false;
        this._gameStart();
      },
      //查看当前玩家个人信息
      nowUserInfo() {
        if (this.roomData.now_user.id != this.userInfo.id) {
          this.$router.push({path: "/user"});
          this.set_nowUserId(this.roomData.now_user.id)
        }
      },
      numMax(num) {
        if (Number(num) > 9999) {
          return 9999 + '+';
        } else {
          return num;
        }
      },
      //倒计时
      countDown(val, time, timer = "timer") {
        let num = time;
        let _this = this;

        function count() {
          if (num >= 0) {
            num--;
            console.log("-----", val, num);
            _this[timer] = setTimeout(count, 1000);
            _this[val] = num;
          }
        }

        count();
      }
    },
    computed: {
      ...mapGetters(['userInfo']),
      initWebSocket() {
        console.log(this.tcpIP, this.webPort);
        return new WebSocket(`ws://${this.tcpIP}:${this.webPort}`);
      },
      filterMessage() {//过滤关键字
        let filter = this.filterMessageSrc;
        let arrFilter = filter.join('|');
        const _sendMsgText = this.sendMsgText.replace(new RegExp(arrFilter, 'ig'), '*');
        return _sendMsgText;
      },
      /*积分场展示*/
      multipleNum() {
        let imageUri = "";
        switch (this.multipleIndex) {
          case 0:
            imageUri = require("img/room/integral_1.png");
            break;
          case 1:
            imageUri = require("img/room/integral_2.png");
            break;
          case 2:
            imageUri = require("img/room/integral_3.png");
            break;
          case 3:
            imageUri = require("img/room/integral_5.png");
            break;
          case 4:
            imageUri = require("img/room/integral_10.png");
            break;
          default:
            imageUri = "";
        }
        return imageUri;
      }
    },
    components: {
      Actionsheet,
      Scroller,
      Popup,
      //WebIM,
      odlWebIM,
      DescWrapper,
      LessCoin,
      ResultPopup,
      RoomExit,
      MakeDownDialog,
      NowGameBack
    },
    updated() {
      if (this.countDownNum < 0) {
        clearInterval(this.timer);
        this.timer = null;
        this.countDownNum = -1;
      }
      if (this.countDownNum > 0 && this.countDownNum < 10) {
        if (this.yx_daojishi) {
          this.yx_daojishi.play();
        }
      }
      if (!this.countDownNum) {
        this.roomGameCmd('grab');
        clearInterval(this.timer);
        this.timer = null;
        this.countDownNum = -1;
      }
      if (!this.countDownResult) {
        api.getRoomGameCancel(this.roomId);
        this.resultPopup = false;
        clearInterval(this.resultTimer);
        this.resultTimer = null;
        this.countDownResult = -1;
      }
      if (!this.makeCountDown) {
        api.getRoomGameCancel(this.roomId);
        this.isMakeDown = false;
        clearInterval(this.makeCountTimer);
        this.makeCountTimer = null;
        this.makeCountDown = -1;
      }
    },
    beforeDestroyed() {
      //this.sendMsgToIM(4);
      //this.backRoom();
      if (this.bgmusic) {
        this.bgmusic.stop();
      }
      if (this.yx_anniu) {
        this.yx_anniu.stop();
      }
      if (this.yx_shibai) {
        this.yx_shibai.stop();
      }
      if (this.yx_xiazhua) {
        this.yx_xiazhua.stop();
      }
      if (this.yx_daojishi) {
        this.yx_daojishi.stop();
      }
      if (this.yx_chenggong) {
        this.yx_chenggong.stop();
      }
      this.player.destroy();
      this.player = null;
    },
    destroyed() {
      this.player.destroy();
      this.player = null;
      clearInterval(this.timer);
      this.timer = null;
      this.countDownNum = -1;
      clearInterval(this.resultTimer);
      this.resultTimer = null;
      this.countDownResult = -1;
      clearInterval(this.makeCountTimer);
      this.makeCountTimer = null;
      this.makeCountDown = -1;
    }
  };
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .room-wrapper {
    padding-bottom: 50px;
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
        top: 300px;
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
      .score-center {
        position: absolute;
        bottom: 30px;
        left: 177px;
        .btn-box {
          margin-bottom: 20px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          height: 110px;
          .reduce, .add {
            width: 80px;
            height: 88px;
            .img-spread;
          }
          .multiple {
            width: 110px;
            height: 110px;
            .img-spread;
          }
        }
        .score-text {
          width: 396px;
          height: 30px;
          .img-spread;
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

  .quick-wrap {
    padding: 30px 14px;
    .quick-item {
      display: inline-block;
      margin: 6px 16px;
      padding: 6px 16px;
      border: 1px solid #000;
      -webkit-border-radius: 30px;
      -moz-border-radius: 30px;
      border-radius: 30px;
      font-size: @subFontSize;
    }
  }
</style>


