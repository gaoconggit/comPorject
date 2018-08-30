<template>
  <div>
    <scroller class="barrage-wrap" lock-x scrollbar-y>
      <div class="chat-box">
        <p class="tips">禁止传播违法违规、封建迷行、暴力血腥、低俗色情、招嫖诈骗、违禁品等不良信息，坚决维护青少钱群体精神文明健康。</p>
        <p v-for="(item,index) in msgList2" :key="index">{{`${item.name}: ${item.msg}`}}</p>
      </div>
    </scroller>
  </div>
</template>

<script>
  import webim from 'webim';
  import {mapState, mapGetters} from 'vuex'
  import {Scroller} from "vux";
  import {getStore, escape2Html} from "./util/ImUtils";
  import {SDK_APPID, ACCOUNT_TYPE} from "../config/config";

  export default {
    components: {Scroller},
    created() {
      // this.initIM();
    },
    data() {
      return {
        accountMode: 0,
        sdkAppID: SDK_APPID,
        accountType: ACCOUNT_TYPE,
        msgList2: [],
        loginInfo: '',
        selType: null,
        selSess: null,
        selToID: '',
        selSessHeadUrl: '',
        toastContent: '',
        confirmTitle: '',
      }
    },
    computed: {
      ...mapGetters(['userInfo']),
    },
    watch: {
      beginSendMsg: function () {
        this.sendCommend(this.avChatRoomId, JSON.stringify({
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
      avChatRoomId: function () {
        this.initIM();
      },
      exitIM: function () {
        if (this.exitIM) {
          this.exitIMm();
        }
      }
    },
    props: ['tim_uid', 'tim_sig', 'sendMsgText', 'beginSendMsg', 'avChatRoomId', 'commendUserName', 'exitIM', 'msgType', 'roomId', 'gameId', 'notice', 'reservationRandomNum'],
    mounted(){
      console.log("props tim_uid",this.tim_uid);
    },
    beforeRouteLeave(to, from, next) {
    },
    methods: {
      exitIMm() {
        this.quitBigGroup();
        this.logout();
      },
      showConfirm() {
        const _this = this; // 需要注意 onCancel 和 onConfirm 的 this 指向
        this.$vux.confirm.show({
          title: this.confirmTitle,
          // 组件除show外的属性
          onCancel() {
            _this.$emit('listenToCancelGame');
            console.log(this); // 非当前 vm
            console.log(_this) // 当前 vm
          },
          onConfirm() {
            _this.$emit('listenToJoinGame');
          }
        });

        setTimeout(function () {
          this.$vux.confirm.hide();
          _this.$emit('listenToCancelGame');
        }.bind(this), 5000);
      },
      initIM() {
        this.selType = webim.SESSION_TYPE.GROUP;
        let selToID = this.avChatRoomId;//当前选中聊天id（当聊天类型为私聊时，该值为好友帐号，否则为群号）
        this.selToID = this.avChatRoomId;
        this.selSess = null;//当前聊天会话
        let _this = this;

        //监听连接状态回调变化事件
        const onConnNotify = function (resp) {
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
        };

        function jsonpCallback(rspData) {
          //设置接口返回的数据
          webim.setJsonpLastRspData(rspData);
        }

        //监听大群新消息（普通，点赞，提示，红包）

        function onBigGroupMsgNotify(msgList) {
          for (let i = msgList.length - 1; i >= 0; i--) { //遍历消息，按照时间从后往前
            const msg = msgList[i];
            //console.warn(msg);
            // this.msgList.push();
            _this.WebTimMsgNotify(msg);
            webim.Log.warn('receive a new avchatroom group msg: ' + msg.getFromAccountNick());
            //显示收到的消息
            // showMsg(msg);
          }
        }

        //显示消息（群普通+点赞+提示+红包）

        // function showMsg(msg) {
        //   let isSelfSend, fromAccount, fromAccountNick, sessType, subType;
        //   let ul, li, paneDiv, textDiv, nickNameSpan, contentSpan;
        //
        //   fromAccount = msg.getFromAccount();
        //   if (!fromAccount) {
        //     fromAccount = '';
        //   }
        //   fromAccountNick = msg.getFromAccountNick();
        //   if (!fromAccountNick) {
        //     fromAccountNick = '未知用户';
        //   }
        //   ul = document.getElementById("video_sms_list");
        //   var maxDisplayMsgCount = 4;
        //   //var opacityStep=(1.0/4).toFixed(2);
        //   var opacityStep = 0.2;
        //   var opacity;
        //   var childrenLiList = $("#video_sms_list").children();
        //   if (childrenLiList.length == maxDisplayMsgCount) {
        //     $("#video_sms_list").children(":first").remove();
        //     for (var i = 0; i < maxDisplayMsgCount; i++) {
        //       opacity = opacityStep * (i + 1) + 0.2;
        //       $('#video_sms_list').children().eq(i).style("opacity", opacity);
        //     }
        //   }
        //   li = document.createElement("li");
        //   paneDiv = document.createElement("div");
        //   paneDiv.setAttribute('class', 'video-sms-pane');
        //   textDiv = document.createElement("div");
        //   textDiv.setAttribute('class', 'video-sms-text');
        //   nickNameSpan = document.createElement("span");
        //
        //   var colorList = ['red', 'green', 'blue', 'org'];
        //   var index = Math.round(fromAccount.length % colorList.length);
        //   var color = colorList[index];
        //   nickNameSpan.setAttribute('class', 'user-name-' + color);
        //   nickNameSpan.innerHTML = webim.Tool.formatText2Html("" + fromAccountNick + "");
        //   contentSpan = document.createElement("span");
        //
        //   //解析消息
        //   //获取会话类型，目前只支持群聊
        //   //webim.SESSION_TYPE.GROUP-群聊，
        //   //webim.SESSION_TYPE.C2C-私聊，
        //   sessType = msg.getSession().type();
        //   //获取消息子类型
        //   //会话类型为群聊时，子类型为：webim.GROUP_MSG_SUB_TYPE
        //   //会话类型为私聊时，子类型为：webim.C2C_MSG_SUB_TYPE
        //   subType = msg.getSubType();
        //
        //   isSelfSend = msg.getIsSend(); //消息是否为自己发的
        //
        //   switch (subType) {
        //
        //     case webim.GROUP_MSG_SUB_TYPE.COMMON: //群普通消息
        //       contentSpan.innerHTML = convertMsgtoHtml(msg);
        //       break;
        //     case webim.GROUP_MSG_SUB_TYPE.REDPACKET: //群红包消息
        //       contentSpan.innerHTML = "[群红包消息]" + convertMsgtoHtml(msg);
        //       break;
        //     case webim.GROUP_MSG_SUB_TYPE.LOVEMSG: //群点赞消息
        //       //业务自己可以增加逻辑，比如展示点赞动画效果
        //       contentSpan.innerHTML = "[群点赞消息]" + convertMsgtoHtml(msg);
        //       //展示点赞动画
        //       showLoveMsgAnimation();
        //       break;
        //     case webim.GROUP_MSG_SUB_TYPE.TIP: //群提示消息
        //       contentSpan.innerHTML = "[群提示消息]" + convertMsgtoHtml(msg);
        //       break;
        //     default:
        //       contentSpan.innerHTML = msg.tipText;
        //       break;
        //   }
        //   textDiv.appendChild(nickNameSpan);
        //   textDiv.appendChild(contentSpan);
        //
        //   paneDiv.appendChild(textDiv);
        //   li.appendChild(paneDiv);
        //   ul.appendChild(li);
        // }


        //监听新消息(私聊(包括普通消息、全员推送消息)，普通群(非直播聊天室)消息)事件
//newMsgList 为新消息数组，结构为[Msg]

        function onMsgNotify(newMsgList) {
          console.log(newMsgList);
          let newMsg;
          for (const j in newMsgList) { //遍历新消息
            newMsg = newMsgList[j];
            handlderMsg(newMsg); //处理新消息
          }
        }

//处理消息（私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息）

        function handlderMsg(msg) {
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
        }

        //监听 群资料变化 群提示消息

        function onGroupInfoChangeNotify(groupInfo) {
          webim.Log.warn("执行 群资料变化 回调： " + JSON.stringify(groupInfo));
          const groupId = groupInfo.GroupId;
          const newFaceUrl = groupInfo.GroupFaceUrl; //新群组图标, 为空，则表示没有变化
          const newName = groupInfo.GroupName; //新群名称, 为空，则表示没有变化
          const newOwner = groupInfo.OwnerAccount; //新的群主id, 为空，则表示没有变化
          const newNotification = groupInfo.GroupNotification; //新的群公告, 为空，则表示没有变化
          const newIntroduction = groupInfo.GroupIntroduction; //新的群简介, 为空，则表示没有变化

          if (newName) {
            //更新群组列表的群名称
            //To do
            webim.Log.warn("群id=" + groupId + "的新名称为：" + newName);
          }
        }


        //监听 解散群 系统消息

        function onDestoryGroupNotify(notify) {
          webim.Log.warn("执行 解散群 回调：" + JSON.stringify(notify));
          const reportTypeCh = "[群被解散]";
          const content = "群主" + notify.Operator_Account + "已解散该群";
          showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
        }

        //显示一条群组系统消息

        function showGroupSystemMsg(type, typeCh, group_id, group_name, msg_content, msg_time) {
          const sysMsgStr = "收到一条群系统消息: type=" + type + ", typeCh=" + typeCh + ",群ID=" + group_id + ", 群名称=" + group_name + ", 内容=" + msg_content + ", 时间=" + webim.Tool.formatTimeStamp(msg_time);
          webim.Log.warn(sysMsgStr);
          alert(sysMsgStr);
        }

        //监听 群被回收 系统消息

        function onRevokeGroupNotify(notify) {
          webim.Log.warn("执行 群被回收 回调：" + JSON.stringify(notify));
          const reportTypeCh = "[群被回收]";
          const content = "该群已被回收";
          showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
        }

        //监听 用户自定义 群系统消息

        function onCustomGroupNotify(notify) {
          webim.Log.warn("执行 用户自定义系统消息 回调：" + JSON.stringify(notify));
          const reportTypeCh = "[用户自定义系统消息]";
          const content = notify.UserDefinedField; //群自定义消息数据
          showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
        }

        //进入大群

        function applyJoinBigGroup(groupId) {
          console.log('********************************');
          console.log(groupId);
          var options = {
            'GroupId': groupId//群id
          };
          webim.applyJoinBigGroup(
            options,
            function (resp) {
              //JoinedSuccess:加入成功; WaitAdminApproval:等待管理员审批
              if (resp.JoinedStatus && resp.JoinedStatus == 'JoinedSuccess') {
                webim.Log.info('进群成功');
                selToID = groupId;
                console.log("进群成功:", _this.selToID, groupId);
                _this.selToID = groupId;
              } else {
                alert('进群失败');
              }
            },
            function (err) {
              alert(err.ErrorInfo);
            }
          );
        }

        function sdkLogin() {
          //web sdk 登录
          webim.login(loginInfo, listeners, options,
            function (identifierNick) {
              //identifierNick为登录用户昵称(没有设置时，为帐号)，无登录态时为空
              webim.Log.info('webim登录成功');
              applyJoinBigGroup('0');
              applyJoinBigGroup(selToID); //加入大群
              // hideDiscussForm(); //隐藏评论表单
              // initEmotionUL(); //初始化表情
            },
            function (err) {
              console.log("error:", err.ErrorInfo);
            }
          ); //
        }


        if (webim.Tool.getQueryString("groupid")) {
          this.avChatRoomId = webim.Tool.getQueryString("groupid");//用户自定义房间群id
        }
        //当前用户身份
        console.log("this:", _this.tim_sig);
        console.log("this:", this.tim_sig);
        let loginInfo = {
          'sdkAppID': _this.sdkAppID, //用户所属应用id,必填
          'appIDAt3rd': _this.sdkAppID, //用户所属应用id，必填
          'accountType': _this.accountType, //用户所属应用帐号类型，必填
          'identifier': "admin", //当前用户ID,必须是否字符串类型，选填
          'identifierNick': "null", //当前用户昵称，选填
          'userSig': _this.tim_sig, //当前用户身份凭证，必须是字符串类型，选填
          'headurl': 'img/2016.gif',//当前用户默认头像，选填,
        };
        console.log("--loginInfo--:", loginInfo);

        this.loginInfo = loginInfo;
        const onGroupSystemNotifys = {
          //"1": onApplyJoinGroupRequestNotify, //申请加群请求（只有管理员会收到,暂不支持）
          //"2": onApplyJoinGroupAcceptNotify, //申请加群被同意（只有申请人能够收到,暂不支持）
          //"3": onApplyJoinGroupRefuseNotify, //申请加群被拒绝（只有申请人能够收到,暂不支持）
          //"4": onKickedGroupNotify, //被管理员踢出群(只有被踢者接收到,暂不支持)
          "5": onDestoryGroupNotify, //群被解散(全员接收)
          //"6": onCreateGroupNotify, //创建群(创建者接收,暂不支持)
          //"7": onInvitedJoinGroupNotify, //邀请加群(被邀请者接收,暂不支持)
          //"8": onQuitGroupNotify, //主动退群(主动退出者接收,暂不支持)
          //"9": onSetedGroupAdminNotify, //设置管理员(被设置者接收,暂不支持)
          //"10": onCanceledGroupAdminNotify, //取消管理员(被取消者接收,暂不支持)
          "11": onRevokeGroupNotify, //群已被回收(全员接收)
          "255": onCustomGroupNotify//用户自定义通知(默认全员接收)
        };

        //监听事件
        const listeners = {
          "onConnNotify": onConnNotify, //选填
          "jsonpCallback": jsonpCallback, //IE9(含)以下浏览器用到的jsonp回调函数,移动端可不填，pc端必填
          "onBigGroupMsgNotify": onBigGroupMsgNotify, //监听新消息(大群)事件，必填
          "onMsgNotify": onMsgNotify,//监听新消息(私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息)事件，必填
          "onGroupSystemNotifys": onGroupSystemNotifys, //监听（多终端同步）群系统消息事件，必填
          "onGroupInfoChangeNotify": onGroupInfoChangeNotify//监听群资料变化事件，选填
        };
        let isAccessFormalEnv = true;//是否访问正式环境

        if (webim.Tool.getQueryString("isAccessFormalEnv") == "false") {
          isAccessFormalEnv = false;//访问测试环境
        }

        const isLogOn = true;//是否在浏览器控制台打印sdk日志

        //其他对象，选填
        const options = {
          'isAccessFormalEnv': isAccessFormalEnv,//是否访问正式环境，默认访问正式，选填
          'isLogOn': isLogOn//是否开启控制台打印日志,默认开启，选填
        };

        const curPlayAudio = null;//当前正在播放的audio对象

        const openEmotionFlag = false;//是否打开过表

        console.log("loginInfo:", loginInfo);

        if (this.accountMode == 1) {//托管模式
          //判断是否已经拿到临时身份凭证
          if (webim.Tool.getQueryString('tmpsig')) {
            if (loginInfo.identifier == null) {
              webim.Log.info('start fetchUserSig');
              //获取正式身份凭证，成功后会回调tlsGetUserSig(res)函数
              TLSHelper.fetchUserSig();
            }
          } else {//未登录,无登录态模式
            //sdk登录
            sdkLogin();
          }
        } else {//独立模式
          sdkLogin();
        }
        if (/debug/gi.test(location.hash)) {
          // document.write('<script src="http://sdklog.isd.com/js/vconsole.min.js"></scr' + 'ipt>');
        }
      },
      quitBigGroup() {
        var options = {
          'GroupId': this.avChatRoomId //群id
        };
        webim.quitBigGroup(
          options,
          function (resp) {
            webim.Log.info('退群成功');
            // $("#video_sms_list").find("li").remove();
            //webim.Log.error('进入另一个大群:'+avChatRoomId2);
            //applyJoinBigGroup(avChatRoomId2);//加入大群
          },
          function (err) {
            // alert(err.ErrorInfo);
          }
        );
      },
      //登出

      logout() {
        //登出
        webim.logout(
          function (resp) {
            webim.Log.info('登出成功');
            loginInfo.identifier = null;
            loginInfo.userSig = null;
            $("#video_sms_list").find("li").remove();
            var indexUrl = window.location.href;
            var pos = indexUrl.indexOf('?');
            if (pos >= 0) {
              indexUrl = indexUrl.substring(0, pos);
            }
            window.location.href = indexUrl;
          }
        );
      },
      WebTimMsgNotify(msg) {
        console.log('############');
        console.log(msg);
        try {
          if (msg) {
            const bigMsg = msg;
            let _msg = msg.elems[0].content.text;
            console.log("_msg:", _msg);
            if (_msg.indexOf('{') == 0) {
              _msg = JSON.parse(escape2Html(_msg));
              console.log("type:", _msg);
              switch (_msg.type) {
                case 1://聊天消息
                  this.msgList2.push({user_id: _msg.user_id, name: _msg.name, msg: _msg.message});
                  console.log(this.msgList2);
                  /*setTimeout(function () {
                    this.$nextTick(() => {
                      this.$refs.scrollerEvent.reset({bottom: 0})
                    })
                  }.bind(this), 2000);*/
                  break;
                case 2://开始游戏
                  this.$emit('listenToStartGame');
                  break;
                case 3://进入房间
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
                case 10://游戏结果//判断user_id=0只刷新排队//user_id>0才是结果

                  if (_msg.success == 0) {//抓不中
                    if (_msg.user_id != 0 && (_msg.user_id == this.userInfo.id)) {
                      this.$emit('listenToChildEventFail', [true, false]);
                      this.$emit('listenToGameOver');
                    } else {
                      this.$emit('broadcastToAll');
                    }
                  } else if (_msg.success == 1) {//抓中了
                    if (_msg.user_id != 0 && (_msg.user_id == this.userInfo.id)) {
                      this.$emit('listenToChildEventSuccess', [true, false]);
                      this.$emit('listenToGameOver');
                    } else {
                      this.$emit('broadcastToAll');
                    }
                  }
                  break;
                case 11://预约排队通知
                  if (_msg.user_id != 0 && _msg.user_id == this.userInfo.id) {
                    this.confirmTitle = '准备到你抓娃娃了,5s自动取消...';
                    this.showConfirm();
                  }

                  break;
                case 12://滚动公告推送
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
              this.msgList2.push(bigMsg.elems[0].content.text);
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
        } catch (e) {
          //处理聊天消息
          // console.log(e);
          // if(msg.elems[0].type == 'TIMTextElem'){//聊天的
          //   console.log(msg.elems[0].content.text);
          //   if($('.msg_box').children('li').length>3){
          //     $('.msg_box').children('li').eq(0).remove();
          //   }
          //   $('.msg_box').append('<li class="font14 colw"><cite class="color1">jerry:</cite>'+bigMsg.elems[0].content.text+'</li>');
          // }else{
          //   console.log(msg.elems[0]);
          // }
        }
      },
      sendCommend(groupid, msgtosend, cbfunc) {
        console.log("发送消息之前：", msgtosend);
        let _selToID = groupid || this.selToID;
        if (!this.selSess) {
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
        console.log("identifierNick:", this.loginInfo.identifierNick);
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
        console.log("发送消息：", msg)
        webim.sendMsg(msg, function (resp) {
          // if (this.selType == webim.SESSION_TYPE.C2C) { //私聊时，在聊天窗口手动添加一条发的消息，群聊时，长轮询接口会返回自己发的消息
          //   showMsg(msg);
          // }
          webim.Log.info("发消息成功");

          if (cbfunc) cbfunc(resp);

          // hideDiscussForm(); //隐藏评论表单
          // showDiscussTool(); //显示评论工具栏
          // hideDiscussEmotion(); //隐藏表情
        }, function (err) {
          webim.Log.error("发消息失败:" + err.ErrorInfo);
          if (cbfunc) cbfunc(err);
          //alert("发消息失败:" + err.ErrorInfo);
        });
      },


      // sendCommend() {//发送消息
      //   let msgtosend = this.sendMsgText;
      //   const msgLen = webim.Tool.getStrBytes(msgtosend);
      //
      //   if (msgtosend.length < 1) {
      //     alert("发送的消息不能为空!");
      //     return;
      //   }
      //
      //   let maxLen, errInfo;
      //   if (this.selType == webim.SESSION_TYPE.GROUP) {
      //     maxLen = webim.MSG_MAX_LENGTH.GROUP;
      //     errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
      //   } else {
      //     maxLen = webim.MSG_MAX_LENGTH.C2C;
      //     errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
      //   }
      //   if (msgLen > maxLen) {
      //     alert(errInfo);
      //     return;
      //   }
      //
      //   if (!this.selSess) {
      //     this.selSess = new webim.Session(this.selType, this.selToID, this.selToID, this.selSessHeadUrl, Math.round(new Date().getTime() / 1000));
      //   }
      //   const isSend = true; //是否为自己发送
      //   const seq = -1; //消息序列，-1表示sdk自动生成，用于去重
      //   const random = Math.round(Math.random() * 4294967296); //消息随机数，用于去重
      //   const msgTime = Math.round(new Date().getTime() / 1000); //消息时间戳
      //   let subType; //消息子类型
      //   if (this.selType == webim.SESSION_TYPE.GROUP) {
      //     //群消息子类型如下：
      //     //webim.GROUP_MSG_SUB_TYPE.COMMON-普通消息,
      //     //webim.GROUP_MSG_SUB_TYPE.LOVEMSG-点赞消息，优先级最低
      //     //webim.GROUP_MSG_SUB_TYPE.TIP-提示消息(不支持发送，用于区分群消息子类型)，
      //     //webim.GROUP_MSG_SUB_TYPE.REDPACKET-红包消息，优先级最高
      //     subType = webim.GROUP_MSG_SUB_TYPE.COMMON;
      //
      //   } else {
      //     //C2C消息子类型如下：
      //     //webim.C2C_MSG_SUB_TYPE.COMMON-普通消息,
      //     subType = webim.C2C_MSG_SUB_TYPE.COMMON;
      //   }
      //   let msg = new webim.Msg(this.selSess, isSend, seq, random, msgTime, this.loginInfo.identifier, subType, this.loginInfo.identifierNick);
      //   //解析文本和表情
      //   const expr = /\[[^[\]]{1,3}\]/mg;
      //   const emotions = msgtosend.match(expr);
      //   let text_obj, face_obj, tmsg, emotionIndex, emotion, restMsgIndex;
      //   if (!emotions || emotions.length < 1) {
      //     text_obj = new webim.Msg.Elem.Text(msgtosend);
      //     msg.addText(text_obj);
      //   } else { //有表情
      //
      //     for (var i = 0; i < emotions.length; i++) {
      //       tmsg = msgtosend.substring(0, msgtosend.indexOf(emotions[i]));
      //       if (tmsg) {
      //         text_obj = new webim.Msg.Elem.Text(tmsg);
      //         msg.addText(text_obj);
      //       }
      //       emotionIndex = webim.EmotionDataIndexs[emotions[i]];
      //       emotion = webim.Emotions[emotionIndex];
      //       if (emotion) {
      //         face_obj = new webim.Msg.Elem.Face(emotionIndex, emotions[i]);
      //         msg.addFace(face_obj);
      //       } else {
      //         text_obj = new webim.Msg.Elem.Text(emotions[i]);
      //         msg.addText(text_obj);
      //       }
      //       restMsgIndex = msgtosend.indexOf(emotions[i]) + emotions[i].length;
      //       msgtosend = msgtosend.substring(restMsgIndex);
      //     }
      //     if (msgtosend) {
      //       text_obj = new webim.Msg.Elem.Text(msgtosend);
      //       msg.addText(text_obj);
      //     }
      //   }
      //   webim.sendMsg(msg, function (resp) {
      //     if (this.selType == webim.SESSION_TYPE.C2C) { //私聊时，在聊天窗口手动添加一条发的消息，群聊时，长轮询接口会返回自己发的消息
      //       showMsg(msg);
      //     }
      //     webim.Log.info("发消息成功");
      //     $("#send_msg_text").val('');
      //
      //     hideDiscussForm(); //隐藏评论表单
      //     showDiscussTool(); //显示评论工具栏
      //     hideDiscussEmotion(); //隐藏表情
      //   }, function (err) {
      //     webim.Log.error("发消息失败:" + err.ErrorInfo);
      //     alert("发消息失败:" + err.ErrorInfo);
      //   });
      // },
      showToastPlugin() {
        this.$vux.toast.show({
          text: this.toastContent,
          width: '20em',
          type: 'text',
          position: 'middle',
          onShow() {
          },
          onHide() {
          }
        })
      },
    }
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
    }
  }
</style>
