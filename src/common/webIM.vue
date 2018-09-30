<template>
  <div>
    <scroller class="barrage-wrap" lock-x scrollbar-y ref="scrollerChat">
      <div class="chat-box" ref="chatBox">
        <p class="tips">禁止传播违法违规、封建迷行、暴力血腥、低俗色情、招嫖诈骗、违禁品等不良信息，坚决维护青少钱群体精神文明健康。</p>
        <p v-for="(item,index) in msgList" :key="index" class="chat-item" :class="{'active':item.is_mi}">
          {{`${item.name}: ${item.msg}`}}</p>
      </div>
    </scroller>
  </div>
</template>

<script>
  import webim from 'webim';
  import {mapState, mapGetters} from 'vuex'
  import {Scroller} from "vux";
  import {escape2Html, getStore} from "./util/ImUtils";
  import {SDK_APPID, ACCOUNT_TYPE} from "../config/config";

  export default {
    name: "webIMn",
    props: ['roomId', 'gameId', 'tim_sig', 'sendMsgText', 'beginSendMsg', 'msgType'],
    data() {
      return {
        msgList: [],//聊天记录
        selType: null,
        selSess: null,
        selSessHeadUrl: '',
      }
    },
    computed: {...mapGetters(['userInfo'])},
    watch: {
      beginSendMsg() {
        this.sendCommend(this.roomId, JSON.stringify({
          type: this.msgType,
          user_id: this.userInfo.id,
          avatar: this.userInfo.avatar,
          user_nicename: this.userInfo.user_nicename,
          name: this.userInfo.user_nicename,
          message: this.sendMsgText,
          game_id: this.gameId,
          room_id: this.roomId
        }), function (res) {
          console.log("res:", res);
        });
      },
      exitIM() {
        if (this.exitIM) {
          this.exitIMm();
        }
      }
    },
    mounted() {
      this.loginInfo = {
        'sdkAppID': SDK_APPID, //用户所属应用id,必填
        'appIDAt3rd': SDK_APPID, //用户所属应用id，必填
        'accountType': ACCOUNT_TYPE, //用户所属应用帐号类型，必填
        'identifier': "admin", //当前用户ID,必须是否字符串类型，选填
        'identifierNick': "null", //当前用户昵称，选填
        'userSig': getStore('wawaji_tim_sig'), //当前用户身份凭证，必须是字符串类型，选填
      };
      this.webimLogin();//登录IM
    },
    methods: {
      //退出Im
      exitIMm() {
        console.log("退出IM");
        this.quitBigGroup();
        //this.logout();
      },
      webimLogin() {
        function jsonpCallback(rspData) {
          //设置接口返回的数据
          webim.setJsonpLastRspData(rspData);
        }

        const onGroupSystemNotifys = {
          "5": this.onDestoryGroupNotify, //群被解散(全员接收)
          "11": this.onRevokeGroupNotify, //群已被回收(全员接收)
          "255": this.onCustomGroupNotify//用户自定义通知(默认全员接收)
        };

        //监听事件
        let listeners = {
          "onConnNotify": this.onConnNotify, //选填
          "jsonpCallback": jsonpCallback, //IE9(含)以下浏览器用到的jsonp回调函数,移动端可不填，pc端必填
          "onBigGroupMsgNotify": this.onBigGroupMsgNotify, //监听新消息(大群)事件，必填
          "onMsgNotify": this.onMsgNotify,//监听新消息(私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息)事件，必填
          "onGroupSystemNotifys": onGroupSystemNotifys, //监听（多终端同步）群系统消息事件，必填
        };
        let isAccessFormalEnv = true;//是否访问正式环境

        if (webim.Tool.getQueryString("isAccessFormalEnv") == "false") {
          isAccessFormalEnv = false;//访问测试环境
        }

        //其他对象，选填
        const isLogOn = false;//是否在浏览器控制台打印sdk日志
        const options = {
          'isAccessFormalEnv': isAccessFormalEnv,//是否访问正式环境，默认访问正式，选填
          'isLogOn': isLogOn//是否开启控制台打印日志,默认开启，选填
        };

        console.log('loginInfo', this.loginInfo);

        this.selType = webim.SESSION_TYPE.GROUP;
        this.selSess = null;//当前聊天会话
        //登录IM
        webim.login(this.loginInfo, listeners, options, (resp) => {
            console.log('登录成功');
            webim.Log.info('webim登录成功');
            this.applyJoinBigGroup('0');
            this.applyJoinBigGroup(this.roomId); //加入大群
          }, (err) => {
            console.log('登录失败', err);
            this.$emit('webim-init-error');
          }
        );
      },
      //进入群组
      applyJoinBigGroup(groupId) {
        console.log('********************************');
        console.log(groupId);
        var options = {
          'GroupId': groupId//群id
        };
        webim.applyJoinBigGroup(
          options,
          (resp) => {
            //JoinedSuccess:加入成功; WaitAdminApproval:等待管理员审批
            webim.Log.info('进群成功');
            console.log("进群成功:", resp);
            console.log("进群成功:", this.roomId, groupId);
          },
          (err) => {
            console.log('进群失败', err)
          }
        );
      },
      //退出群组
      quitBigGroup() {
        let options = {
          'GroupId': this.roomId //群id
        };
        webim.quitBigGroup(options, (resp) => {
            webim.Log.info('退群成功');
            console.log("退群成功")
          }, (err) => {
            this.$emit('webim-init-error');
            console.log("加群失败", err)
          }
        );
      },
      //退出IM
      logout() {
        //登出
        webim.logout((resp) => {
            webim.Log.info('登出成功');
            console.log("登出成功", resp);
            this.loginInfo.identifier = null;
            this.loginInfo.userSig = null;
            let indexUrl = window.location.href;
            let pos = indexUrl.indexOf('?');
            if (pos >= 0) {
              indexUrl = indexUrl.substring(0, pos);
            }
            window.location.href = indexUrl;
          }
        );
      },
      //发送消息
      sendCommend(groupid, msgtosend, cbfunc) {
        let _selToID = groupid || this.roomId;
        console.log('_selToID', _selToID);
        console.log('selSess', this.selSess);
        if (!this.selSess) {
          console.log('selSess', this.selSess);
          this.selSess = new webim.Session(this.selType, _selToID, _selToID, this.selSessHeadUrl, Math.round(new Date().getTime() / 1000));
        }
        let isSend = true; //是否为自己发送
        let seq = -1; //消息序列，-1表示sdk自动生成，用于去重
        let random = Math.round(Math.random() * 4294967296); //消息随机数，用于去重
        let msgTime = Math.round(new Date().getTime() / 1000); //消息时间戳
        let subType; //消息子类型
        if (this.selType == webim.SESSION_TYPE.GROUP) {
          //群消息子类型如下：
          //webim.GROUP_MSG_SUB_TYPE.COMMON-普通消息,
          //webim.GROUP_MSG_SUB_TYPE.LOVEMSG-点赞消息，优先级最低
          //webim.GROUP_MSG_SUB_TYPE.TIP-提示消息(不支持发送，用于区分群消息子类型)，
          //webim.GROUP_MSG_SUB_TYPE.REDPACKET-红包消息，优先级最高
          subType = webim.GROUP_MSG_SUB_TYPE.COMMON;

        } else {
          //C2C消息子类型如下：
          //webim.C2C_MSG_SUB_TYPE.COMMON-普通消息,
          subType = webim.C2C_MSG_SUB_TYPE.COMMON;
        }
        let msg = new webim.Msg(this.selSess, isSend, seq, random, msgTime, this.loginInfo.identifier, subType, this.loginInfo.identifierNick);
        //解析文本和表情
        let expr = /\[[^[\]]{1,3}\]/mg;
        let emotions = msgtosend.match(expr);
        let text_obj, face_obj, tmsg, emotionIndex, emotion, restMsgIndex;
        if (!emotions || emotions.length < 1) {
          text_obj = new webim.Msg.Elem.Text(msgtosend);
          msg.addText(text_obj);
        } else { //有表情

          for (let i = 0; i < emotions.length; i++) {
            tmsg = msgtosend.substring(0, msgtosend.indexOf(emotions[i]));
            if (tmsg) {
              text_obj = new webim.Msg.Elem.Text(tmsg);
              msg.addText(text_obj);
            }
            emotionIndex = webim.EmotionDataIndexs[emotions[i]];
            emotion = webim.Emotions[emotionIndex];
            if (emotion) {
              face_obj = new webim.Msg.Elem.Face(emotionIndex, emotions[i]);
              msg.addFace(face_obj);
            } else {
              text_obj = new webim.Msg.Elem.Text(emotions[i]);
              msg.addText(text_obj);
            }
            restMsgIndex = msgtosend.indexOf(emotions[i]) + emotions[i].length;
            msgtosend = msgtosend.substring(restMsgIndex);
          }
          if (msgtosend) {
            text_obj = new webim.Msg.Elem.Text(msgtosend);
            msg.addText(text_obj);
          }
        }
        //发送消息
        console.log("发送消息：", msg)
        webim.sendMsg(msg, function (resp) {
          webim.Log.info("发消息成功");
          console.log('发送消息成功', resp);
          if (cbfunc) cbfunc(resp);
        }, function (err) {
          webim.Log.error("发消息失败:" + err.ErrorInfo);
          console.log('发送消息失败', err);
          if (cbfunc) cbfunc(err);
        });
      },
      //监听连接状态回调变化事件
      onConnNotify(resp) {
        switch (resp.ErrorCode) {
          case webim.CONNECTION_STATUS.ON:
            //webim.Log.warn('连接状态正常...');
            break;
          case webim.CONNECTION_STATUS.OFF:
            webim.Log.warn('连接已断开，无法收到新消息，请检查下你的网络是否正常');
            break;
          default:
            webim.Log.error('未知连接状态,status=' + resp.ErrorCode);
            break;
        }
      },
      //监听大群新消息（普通，点赞，提示，红包）
      onBigGroupMsgNotify(msgList) {
        for (let i = msgList.length - 1; i >= 0; i--) { //遍历消息，按照时间从后往前
          const msg = msgList[i];
          //console.warn(msg);
          // this.msgList.push();
          this.WebTimMsgNotify(msg);
          webim.Log.warn('receive a new avchatroom group msg: ' + msg.getFromAccountNick());
          //显示收到的消息
          // showMsg(msg);
        }
      },
      //监听新消息(私聊(包括普通消息、全员推送消息)，普通群(非直播聊天室)消息)事件
      //newMsgList 为新消息数组，结构为[Msg]
      onMsgNotify(newMsgList) {
        console.log(newMsgList);
        let newMsg;
        for (const j in newMsgList) { //遍历新消息
          newMsg = newMsgList[j];
          this.handlderMsg(newMsg); //处理新消息
        }
      },
      //处理消息（私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息）
      handlderMsg(msg) {
        let fromAccount, fromAccountNick, sessType, subType, contentHtml;

        fromAccount = msg.getFromAccount();
        if (!fromAccount) {
          fromAccount = '';
        }
        fromAccountNick = msg.getFromAccountNick();
        if (!fromAccountNick) {
          fromAccountNick = fromAccount;
        }

        //解析消息
        //获取会话类型
        //webim.SESSION_TYPE.GROUP-群聊，
        //webim.SESSION_TYPE.C2C-私聊，
        sessType = msg.getSession().type();
        //获取消息子类型
        //会话类型为群聊时，子类型为：webim.GROUP_MSG_SUB_TYPE
        //会话类型为私聊时，子类型为：webim.C2C_MSG_SUB_TYPE
        subType = msg.getSubType();
        switch (sessType) {
          case webim.SESSION_TYPE.C2C: //私聊消息
            switch (subType) {
              case webim.C2C_MSG_SUB_TYPE.COMMON: //c2c普通消息
                //业务可以根据发送者帐号fromAccount是否为app管理员帐号，来判断c2c消息是否为全员推送消息，还是普通好友消息
                //或者业务在发送全员推送消息时，发送自定义类型(webim.MSG_ELEMENT_TYPE.CUSTOM,即TIMCustomElem)的消息，在里面增加一个字段来标识消息是否为推送消息
                contentHtml = convertMsgtoHtml(msg);
                webim.Log.warn('receive a new c2c msg: fromAccountNick=' + fromAccountNick + ", content=" + contentHtml);
                //c2c消息一定要调用已读上报接口
                const opts = {
                  'To_Account': fromAccount, //好友帐号
                  'LastedMsgTime': msg.getTime() //消息时间戳
                };
                webim.c2CMsgReaded(opts);
                alert('收到一条c2c消息(好友消息或者全员推送消息): 发送人=' + fromAccountNick + ", 内容=" + contentHtml);
                break;
            }
            break;
          case webim.SESSION_TYPE.GROUP: //普通群消息，对于直播聊天室场景，不需要作处理
            break;
        }
      },
      WebTimMsgNotify(msg) {
        console.log('############');
        console.log(msg);
        try {
          if (msg) {
            const bigMsg = msg;
            let _msg = msg.elems[0].content.text || '';
            if (_msg.indexOf('{') == 0) {
              _msg = JSON.parse(escape2Html(_msg));
              console.log("_msg:", _msg);
              console.log("type:", _msg.type);
              switch (_msg.type) {
                case 1://聊天消息
                  if (_msg.user_id == this.userInfo.id) {
                    this.msgList.push({user_id: _msg.user_id, name: '我', msg: _msg.message, is_mi: true});
                  } else {
                    this.msgList.push({user_id: _msg.user_id, name: _msg.name, msg: _msg.message});
                  }
                  this.$nextTick(() => {
                    let chatHeight = this.$refs.scrollerChat.$el.clientHeight;
                    let chatBoxHeight = this.$refs.chatBox.clientHeight;
                    if (chatBoxHeight > chatHeight) {
                      this.$refs.scrollerChat.reset({top: chatBoxHeight - chatHeight}, 200, 'ease')
                    }
                  });
                  break;
                case 2://开始游戏
                  this.$emit('listenToStartGame');
                  break;
                case 3://进入房间
                  console.log("有人进入房间");
                  this.$emit('listenToEnterInRoom', {
                    user_nickname: _msg.user_nicename,
                    avatar: _msg.avatar,
                    user_id: _msg.user_id
                  });
                  break;
                case 4://离开房间
                  this.$emit('listenToLiveOutRoom', _msg.user_id);
                  break;
                case 5://用户预约抓娃娃
                  this.$emit('listenToReservation');
                  break;
                case 6://用户取消预约抓娃娃
                  this.$emit('listenToCancelReservation');
                  break;
                case 10://游戏结果//判断user_id=0只刷新排队//user_id>0才是结果
                  this.$emit("listenGrabResult", _msg);
                  break;
                case 11://预约排队通知
                  if (_msg.user_id != 0 && _msg.user_id == this.userInfo.id) {
                    this.$emit('listenToJoinGame', _msg);
                  }
                  break;
                case 12://滚动公告推送
                  if (_msg.user_id != 0) {
                    this.$emit('listenToNotice', _msg.new_notice);
                  }
                  break;
                case 13://
                  break;
                case 14://
                  break;
                case 15://房间状态
                  this.$emit('listenToRoomStatus', _msg.status);
                  break;
                case 16://
                  break;
                case 17://
                  break;
                case 18://房间排队人数
                  this.$emit('listenToRoomWaitNums', _msg.room_nums);
                  break;
              }
            } else if (bigMsg.elems[0].type == 'TIMTextElem') {//聊天的
              alert('liaotian');
              this.msgList.push(bigMsg.elems[0].content.text);
            } else {
              console.log(bigMsg.elems[0]);
            }
          }
        } catch (e) {
          //处理聊天消息
          console.log('处理聊天消息失败', e);
        }
      },

      //监听 解散群 系统消息
      onDestoryGroupNotify(notify) {
        console.log("执行 解散群 回调：" + JSON.stringify(notify));
        webim.Log.warn("执行 解散群 回调：" + JSON.stringify(notify));
        const reportTypeCh = "[群被解散]";
        const content = "群主" + notify.Operator_Account + "已解散该群";
        this.showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
      },
      //监听 群被回收 系统消息
      onRevokeGroupNotify(notify) {
        console.log("执行 群被回收 回调：" + JSON.stringify(notify));
        webim.Log.warn("执行 群被回收 回调：" + JSON.stringify(notify));
        const reportTypeCh = "[群被回收]";
        const content = "该群已被回收";
        this.showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
      },
      //监听 用户自定义 群系统消息
      onCustomGroupNotify(notify) {
        console.log("执行 用户自定义系统消息 回调：" + JSON.stringify(notify));
        webim.Log.warn("执行 用户自定义系统消息 回调：" + JSON.stringify(notify));
        const reportTypeCh = "[用户自定义系统消息]";
        const content = notify.UserDefinedField; //群自定义消息数据
        this.showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
      },
      //显示一条群组系统消息
      showGroupSystemMsg(type, typeCh, group_id, group_name, msg_content, msg_time) {
        const sysMsgStr = "收到一条群系统消息: type=" + type + ", typeCh=" + typeCh + ",群ID=" + group_id + ", 群名称=" + group_name + ", 内容=" + msg_content + ", 时间=" + webim.Tool.formatTimeStamp(msg_time);
        console.log(sysMsgStr);
        webim.Log.warn(sysMsgStr);
        alert(sysMsgStr);
      },
    },
    destroyed() {
      this.logout();
    },
    components: {Scroller}
  }
</script>

<style lang="less" scoped>
  @import "~assets/style/index.less";

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
      .chat-item {
        color: @whiteColor;
        font-size: @subFontSize;
        line-height: @maxFontSize;
        &.active {
          color: @catchText;
        }
      }
    }
  }
</style>
