<template>

</template>

<script>
  import webim from "webim";
  import {SDK_APPID, ACCOUNT_TYPE} from "../config/config";
  import {escape2Html} from "./util/ImUtils";

  export default {
    props: ['tim_sig', 'avChatRoomId'],
    data() {
      return {
        loginInfo: {},          //用户信息
      }
    },
    mounted() {
      this.loginInfo = {
        'sdkAppID': SDK_APPID, //用户所属应用id,必填
        'appIDAt3rd': SDK_APPID, //用户所属应用id，必填
        'accountType': ACCOUNT_TYPE, //用户所属应用帐号类型，必填
        'identifier': "admin", //当前用户ID,必须是否字符串类型，选填
        'identifierNick': "null", //当前用户昵称，选填
        'userSig': this.tim_sig, //当前用户身份凭证，必须是字符串类型，选填
        'headurl': 'img/2016.gif',//当前用户默认头像，选填,
      };
      const onGroupSystemNotifys = {
        "5": this.onDestoryGroupNotify, //群被解散(全员接收)
        "11": this.onRevokeGroupNotify, //群已被回收(全员接收)
        "255": this.onCustomGroupNotify//用户自定义通知(默认全员接收)
      };

      this.listeners = {
        "onConnNotify": this.onConnNotify, //选填
        "jsonpCallback": this.jsonpCallback, //IE9(含)以下浏览器用到的jsonp回调函数,移动端可不填，pc端必填
        "onBigGroupMsgNotify": this.onBigGroupMsgNotify, //监听新消息(大群)事件，必填
        "onMsgNotify": this.onMsgNotify,//监听新消息(私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息)事件，必填
        "onGroupSystemNotifys": onGroupSystemNotifys, //监听（多终端同步）群系统消息事件，必填
      };

      console.log("loginInfo", this.loginInfo);

      this.webimLogin();
    },
    methods: {
      webimLogin() {
        if (!webim.checkLogin()) {
          let isAccessFormalEnv = true;//是否访问正式环境
          if (webim.Tool.getQueryString("isAccessFormalEnv") == "false") {
            isAccessFormalEnv = false;//访问测试环境
          }
          const isLogOn = false;//是否在浏览器控制台打印sdk日志
          //其他对象，选填
          const options = {
            'isAccessFormalEnv': isAccessFormalEnv,//是否访问正式环境，默认访问正式，选填
            'isLogOn': isLogOn//是否开启控制台打印日志,默认开启，选填
          };
          webim.login(this.loginInfo, this.listeners, options, (resp) => {
              console.log('登录成功:', resp);
              this._applyJoinBigGroup(this.avChatRoomId); //加入大群
            }, (err) => {
              alert(err.ErrorInfo);
            }
          );
        } else {
          this._applyJoinBigGroup(this.avChatRoomId); //加入大群
        }
      },

      //加群
      _applyJoinBigGroup(sekToID) {
        let options = {
          GroupId: sekToID,
        };
        webim.applyJoinBigGroup(options, (res) => {
          console.log("加群成功", sekToID, res);
          webim.Log.info('进群成功');
        }, (err) => {
          console.log(this.loginInfo);
          console.log("加群失败", sekToID, err);
          webim.Log.info('进群失败');
        })
      },
      webTimMsgNotify(msg) {
        try {
          if (msg) {
            const bigMsg = msg;
            let _msg = msg.elems[0].content.text;
            if (_msg != null) {
              if (_msg.indexOf('{') == 0) {
                _msg = JSON.parse(escape2Html(_msg));
                console.log("_msg:", _msg);
                console.log("type:", _msg.type);

                /*switch (_msg.type) {
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
                    this.$emit('listenToReservation', [_msg.user_id, this.reservationRandomNum]);
                    break;
                  case 6://用户取消预约抓娃娃
                    this.$emit('listenToCancelReservation', [_msg.user_id, this.reservationRandomNum]);
                    break;
                  case 10:
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

                }*/
              } else if (bigMsg.elems[0].type == 'TIMTextElem') {//聊天的
                alert('liaotian');
                this.msgList.push(bigMsg.elems[0].content.text);
                /*setTimeout(function () {
                  this.$nextTick(() => {
                    this.$refs.scrollerEvent.reset({bottom: 0})
                  })
                }.bind(this), 2000);*/

                // if($('.msg_box').children('li').length>3){
                //   $('.msg_box').children('li').eq(0).remove();
                // }
                // $('.msg_box').append('<li class="font14 colw"><cite class="color1">jerry:</cite>'+bigMsg.elems[0].content.text+'</li>');
              } else {
                console.log(bigMsg.elems[0]);
              }
            }
          }
        } catch (e) {
          console.log("消息发送失败", e)
        }
      },
      //监听连接状态回调变化事件
      onConnNotify(resp) {
        switch (resp.ErrorCode) {
          case webim.CONNECTION_STATUS.ON:
            webim.Log.warn('连接状态正常...');
            break;
          case webim.CONNECTION_STATUS.OFF:
            webim.Log.warn('连接已断开，无法收到新消息，请检查下你的网络是否正常');
            break;
          default:
            webim.Log.error('未知连接状态,status=' + resp.ErrorCode);
            break;
        }
      },
      jsonpCallback(rspData) {
        //设置接口返回的数据
        webim.setJsonpLastRspData(rspData);
      },

      //监听大群新消息（普通，点赞，提示，红包）
      onBigGroupMsgNotify(msgList) {
        for (let i = msgList.length - 1; i >= 0; i--) { //遍历消息，按照时间从后往前
          const msg = msgList[i];
          //console.warn(msg);
          // this.msgList.push();
          this.webTimMsgNotify(msg);
          webim.Log.warn('receive a new avchatroom group msg: ' + msg.getFromAccountNick());
          //显示收到的消息
          // showMsg(msg);
        }
      },
      //监听新消息(私聊(包括普通消息、全员推送消息)，普通群(非直播聊天室)消息)事件
      //newMsgList 为新消息数组，结构为[Msg]
      onMsgNotify(newMsgList) {
        console.log("监听新消息:", newMsgList);
        let newMsg;
        for (const j in newMsgList) { //遍历新消息
          newMsg = newMsgList[j];
          this.handlderMsg(newMsg); //处理新消息
        }
      },

      //处理消息（私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息）
      handlderMsg(msg) {
        console.log("处理消息", msg);
        let fromAccount, fromAccountNick, sessType, subType, contentHtml;

        fromAccount = msg.getFromAccount();
        if (!fromAccount) {
          fromAccount = '';
        }
        fromAccountNick = msg.getFromAccountNick();
        if (!fromAccountNick) {
          fromAccountNick = fromAccount;
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
      //退出
      quitWebIm() {
        if (this.loginInfo.identifier) {
          //sdk登出
          webim.logout((resp) => {
            console.log('退出登录', resp);
            this.loginInfo.identifier = null;
            this.loginInfo.userSig = null;
            /*var indexUrl = window.location.href;
            var pos = indexUrl.indexOf('?');
            if (pos >= 0) {
              indexUrl = indexUrl.substring(0, pos);
            }
            window.location.href = indexUrl;*/
          });
        } else {
          console.log('你未登录');
          alert('未登录');
        }
      },
      //被新实例踢下线的回调处理
      onKickedEventCall() {
        console.log('被新实例踢下线的回调处理');
        webim.Log.error("其他地方登录，被T了");
      },

      //多终端登录被T
      onMultipleDeviceKickedOut() {
        console.log('多终端登录被T');
        webim.Log.error("多终端登录，被T了");
      }
    },
    computed: {},
    beforeDestroy() {
      console.log(45789)
    },
    destroyed() {
      console.log(12345)
    }
  }
</script>
