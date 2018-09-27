<!--template是声明模板元素，可以使html标签在js中使用，可以在任意位置上使用。
childNodes无效性如果非得获取“伪子元素”，要使用content属性
-->
<template>
  <div>
    <div class="root-notice" v-if="isNotice" style="z-index: 10000">
      <div class="avatar"><img :src="noticeCenter.avatar" alt=""></div>
      <p class="text">{{noticeCenter.title}}</p>
    </div>
    <!--使用transition完成任何元素进入/离开的过渡组件-->
    <transition name="router-fade" mode="out-in">
      <!--vue实例 组件-->
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition :name="$route.meta.anima?'':'router-fade'" mode="out-in">
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from "vuex";
  import api from "api/BaseService";
  import {delCookie, escape2Html, getCookie, getStore, removeStore, setStore} from "./common/util/ImUtils";
  import {SDK_APPID, ACCOUNT_TYPE} from "./config/config";
  import {updateBaseInfo} from "./common/util/Utils";

  export default {
    name: "App",
    data() {
      return {
        roomId: '',
        gameId: '',
        tim_sig: getStore('wawaji_tim_sig'),
        tim_uid: getStore('wawaji_tim_sig'),
        msgType: '',
        isBeginSendMsg: false,
        isNotice: false,
        isAgainLogin: false,
      }
    },
    created() {
      this._getToken();
      this.wxShare();
    },
    mounted() {
      //this.isBeginSendMsg = new Date().getTime();//IM需要监听发生变化
      console.log('APP Page');
      this.roomId = 0;
      this.$nextTick(() => {
        this._initIM();
      })
    },
    watch: {
      noticeCenter() {
        this.isNotice = this.noticeCenter.show;
      },
      $route(to, from) {
        console.log(to, from);
        if (from.path === '/room') {
          console.log("从房间中退出来");
          setTimeout(() => {
            this._initIM();
          }, 1000);
        }
      }
    },
    methods: {
      ...mapMutations({
        set_token: "SET_TOKEN",
        set_uid: "SET_UID",
        set_userInfo: "SET_USER_INFO",
        set_noticeCenter: "SET_NOTICE_CENTER",
      }),
      _getToken() {
        let token = getCookie('wawaji_token') || "05045c4b1cc059fcdd284a0eec5acafe";
        let uid = getStore("wawaji_uid") || "100191";
        this.set_uid(uid);
        this.set_token(token);
        this._getBaseInfo();
        setInterval(() => {
          this._postOnline();
        }, 60000)
      },
      async _getBaseInfo() {
        let result = await api.getBaseInfo(true);
        if (result.code == 1) {
          this.set_userInfo(result.data);
        } else {
          console.log("获取个人信息", result);
          delCookie('wawaji_code');
          delCookie('wawaji_token');
          removeStore('wawaji_userInfo')
        }
      },
      _initIM() {
        let loginInfo = {
          'sdkAppID': SDK_APPID, //用户所属应用id,必填
          'appIDAt3rd': SDK_APPID, //用户所属应用id，必填
          'accountType': ACCOUNT_TYPE, //用户所属应用帐号类型，必填
          'identifier': "admin", //当前用户ID,必须是否字符串类型，选填
          'identifierNick': "null", //当前用户昵称，选填
          'userSig': this.tim_sig, //当前用户身份凭证，必须是字符串类型，选填
        };
        //监听事件
        const listeners = {
          "jsonpCallback": () => {
          }, //IE9(含)以下浏览器用到的jsonp回调函数,移动端可不填，pc端必填
          "onBigGroupMsgNotify": this.onBigGroupMsgNotify, //监听新消息(大群)事件，必填
          "onMsgNotify": () => {
          },//监听新消息(私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息)事件，必填
          "onGroupSystemNotifys": () => {
          }, //监听（多终端同步）群系统消息事件，必填
        };
        webim.login(loginInfo, listeners, {'isLogOn': false},
          function (identifierNick) {
            console.log('登录成功');
            webim.Log.info('webim登录成功');
            applyJoinBigGroup('0');
          },
          function (err) {
            console.log("error:", err.ErrorInfo);
          }
        );

        function applyJoinBigGroup(groupId) {
          var options = {
            'GroupId': groupId//群id
          };
          webim.applyJoinBigGroup(options, (resp) => {
              webim.Log.info('进群成功');
              console.log("进群成功:", groupId, resp);
            }, (err) => {
              alert(err.ErrorInfo);
            }
          );
        }
      },
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
      webTimMsgNotify(msg) {
        try {
          if (msg) {
            console.log(msg);
            const bigMsg = msg;
            let _msg = msg.elems[0].content.text ? msg.elems[0].content.text : '';
            if (_msg.indexOf('{') == 0) {
              _msg = JSON.parse(escape2Html(_msg));
              switch (_msg.type) {
                case 12://滚动公告推送
                  if (_msg.user_id != 0) {
                    this.listenToNotice(_msg.new_notice);
                  }
                  break;
                case 20://监听支付成功
                  updateBaseInfo();
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
          console.log("消息处理失败", e)
        }
      },
      //发送心跳
      _postOnline() {
        api.postOnline();
      },
      listenToNotice(data) {
        console.log(data);
        this.set_noticeCenter({
          show: true,
          title: data.title,
          avatar: data.avatar_thumb
        });
        setTimeout(() => {
          this.set_noticeCenter({
            show: false,
            title: '',
            avatar: ''
          });
        }, 3000)
      }
    },
    computed: {...mapGetters(['noticeCenter'])},
    destroyed() {

    }
  };
</script>

<style lang="less">
  .root-notice {
    padding: 10px 20px;
    position: absolute;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, .4);
    border-radius: 50px;
    z-index: 10000;
    .avatar {
      float: left;
      width: 70px;
      height: 70px;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
      overflow: hidden;
      vertical-align: middle;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .text {
      margin-left: 10px;
      color: #FFF;
      font-size: 30px;
      font-weight: 600;
    }
  }

  .router-fade-enter-active,
  .router-fade-leave-active {
    transition: all 0.3s;
  }

  .router-fade-enter,
  .router-fade-leave-active {
    opacity: 0;
  }
</style>
