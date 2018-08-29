<template>
  <div class="room-wrapper">
    <div class="video-wrapper">
      <canvas class="video-wrap-main" ref="videoWrapMain"></canvas>
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
      <div class="left"></div>
      <div class="right"></div>
      <div class="score-center"></div>
    </div>
    <actionsheet v-model="isShowFixSheet" :menus="fixList" @on-click-menu="fixItemClick" show-cancel></actionsheet>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {Howl} from "howler";
  import {Actionsheet} from "vux";
  import api from "../../api/BaseService";
  import {showToast} from "../../common/util/Utils";

  export default {
    name: "RoomIndex",
    data() {
      return {
        roomId: 0, //房间ID，通过url传输
        roomData: [],       //房间信息
        nowUsersLen: 0,     //当前房间人数
        nowUsers: [],       //当前房间数组
        fixList: [],        //上报信息展示
        isShowFixSheet: false,
        menus2: {
          menu1: 'Share to friends',
          menu2: 'Share to timeline'
        },
        tim_uid: '',        //IM身份
        tim_sig: '',        //IM密钥
      };
    },
    created() {
      this.sig = this.userInfo.tim_sig;
      this.sig = 'wawaji' + this.userInfo.id;
      if (!this.$route.query.id) {
        this.$router.push({path: "/"});
      } else {
        this.roomId = this.$route.query.id;
        this._getJoinRoom();
      }
      showToast("123456", "success", 20000);
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
      async fixItemClick(id) {
        this.$vux.loading.show({text: '正在上报中...'});
        console.log(id);
        let result = await api.getRoomFixReport(this.roomId, id)
        if (result.code == 1) {
          showToast(result.msg, "success");
          this.$vux.loading.hide();
        } else {
          setTimeout(() => {
            showToast(result.msg, "warn");
            this.$vux.loading.hide();
          }, 5000)
        }
      },
      backRoom() {
        console.log("退出房间");
      },
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    components: {Actionsheet}
  };
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .room-wrapper {
    .video-wrapper {
      position: relative;
      width: 100%;
      height: 1030/2px;
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
        height: 98/2px;
        .back, .fix {
          margin: 10px;
          width: 50/2px;
          height: 50/2px;
          .img-spread;
        }
        .now-player {
          flex: 1;
          .player-wrap {
            display: flex;
            align-items: center;
            .now-avatar {
              position: relative;
              width: 78/2px;
              height: 78/2px;
              -webkit-border-radius: 50%;
              -moz-border-radius: 50%;
              border-radius: 50%;
              overflow: hidden;
              z-index: 1;
              .img-spread;
            }
            .now-user {
              margin-left: -24px;
              padding: 3.5px 0 3.5px 30px;
              width: 100px;
              background-color: rgba(0, 0, 0, .4);
              border-top-right-radius: 32px;
              border-bottom-right-radius: 32px;
              p {
                padding-right: 10px;
                color: @whiteColor;
                font-size: 14px;
                width: 100%;
                height: 16px;
                line-height: 16px;
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
            margin-right: 8px;
          }
          .item-user {
            margin-left: -10px;
            width: 60/2px;
            height: 60/2px;
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
    }
  }
</style>


