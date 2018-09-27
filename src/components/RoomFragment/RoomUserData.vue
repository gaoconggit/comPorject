<!--
    用户资料

-->
<template>
  <div class="User-data">
    <title-bar title="用户资料" class="title" @get-title-height="getTitleHeight" ref="titleHeader"/>
    <div class="User-content">
      <header class="user-header" ref="userHeader">
        <img src="../../assets/img/wawa/header_bg.png" class="img-style" alt="">
        <div class="avatar">
          <img :src="userData.avatar" alt="">
        </div>
        <div class="sex">
          <img :src="sex" alt="">
        </div>
        <div class="mine-floor" ref="mineFloor">
          <div class="mine">
            <p class="name">{{userData.user_nicename}}&nbsp;<span class="id">({{userData.user_id}})</span></p>
            <p class="name">抓中{{userData.total}}次</p>
          </div>
        </div>
      </header>
      <scroll-view :tabHeight="-tabHeight" ref="scrollerName"
                   lock-x
                   scrollbarY
                   bounce
                   use-pulldown
                   use-pullup
                   @on-pulldown-loading="onPulldown"
                   @on-pullup-loading="onPullup"
                   v-model="status">
        <div class="User-Info">
          <div class="wawa" v-for="(item,index) in userDolls">
            <div class="wawaImg">
              <img :src="item.gifticon" class="img-style" alt="">
            </div>
            <p class="wawaName">{{item.giftname}}</p>
            <p class="wawaTiem">{{getTimeDates(item.ctime)}}</p>
          </div>
        </div>
      </scroll-view>
    </div>

  </div>
</template>

<script>
  import TitleBar from "@/common/TitleBar";
  import BaseService from "../../api/BaseService.js";
  import ScrollView from "@/common/ScrollView";
  import {getTimeDate} from "@/common/util/Utils";

  export default {
    name: "RoomUserData",
    components: {TitleBar, ScrollView,},
    data() {
      return {
        tabHeight: '',
        id: this.$route.query.userId,
        userData: {},
        userDolls: [],
        sex: '',
        status: {
          pullupStatus: "default",
          pulldownStatus: "default",
        },
        page: 1,
      }
    },
    methods: {
      getTimeDates: function (time) {
        return getTimeDate(time);
      },
<<<<<<< HEAD
      getTitleHeight:function(data){
        this.tabHeight=this.$refs.userHeader.clientHeight+data;
=======
      getTitleHeight: function (data) {
        this.tabHeight = this.$refs.userHeader.clientHeight + data + 2;
>>>>>>> ebc77d6258dbd693d85e302246aaa79bcb9af00b
      },
      roomUserData: function (r) {
        BaseService.RoomUserData(r)
          .then((result) => {
            this.userData = result.data;
            this.userSex();
          }).catch((err) => {
          console.log(err);
        })
      },
      spectatorDolls: function (r, p = 1, isRefresh = false) {
        BaseService.spectatorDolls(r, p)
          .then((result) => {
            this.$refs.scrollerName.donePulldown();
            if (result.data.length) {
              if (isRefresh) {
                this.page = 1;
                this.$refs.scrollerName.reset({top: 0}, 500);
                this.$refs.scrollerName.enablePullup();
                this.$refs.scrollerName.donePulldown();
              } else {
                this.$refs.scrollerName.reset();
              }
              if (p === 1) {
                //当page为1时，数据应该为空
                this.userDolls = result.data;
              } else {
                //当page大于1时，数据应该累加
                this.userDolls = this.userDolls.concat(result.data);
              }
              if (result.data.length < 10) {
                this.$refs.scrollerName.disablePullup();
                console.log("只有这么多了");
              } else {
                this.$refs.scrollerName.donePullup();
              }
            } else if (p > 1) {
              this.$refs.scrollerName.disablePullup();
              console.log("没有更多娃娃了1");
            } else {
              this.userDolls = [];
              this.$refs.scrollerName.disablePullup();
              console.log("没有更多娃娃了2");
            }
            this.$vux.loading.hide();
          }).catch((err) => {
          console.log(err);
        })
      },
      userSex: function () {
        switch (parseInt(this.userData.sex)) {
          case 0 :
            this.sex = '';
            break;
          case 1 :
            this.sex = require('../../assets/image/home/ic_man.png');
            break;
          case 2 :
            this.sex = require('../../assets/image/home/ic_lady.png');
            break;
        }
      },
      /*刷新*/
      onPulldown: function () {
        this.page = 1;
        this.spectatorDolls(this.id, this.page, true)
      },
      /*页码加一  加载  请求数据*/
      onPullup: function () {
        this.page += 1;
        this.spectatorDolls(this.id, this.page, false);
      },
    },
    mounted() {
      if (!this.$route.query.userId) {
        this.$router.back();
      }
      this.roomUserData(this.id);
      this.spectatorDolls(this.id)
    },
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .User-data {
    /* background: linear-gradient(to bottom, @mainColor 5%, #fff 50%);*/
    .img-style {
      width: 100%;
      height: 100%;
    }
    .User-content {
      position: relative;
      width: 100%;
      .user-header {
        position: relative;
        width: 100%;
        height: 260px;
        .avatar {
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 110px;
          height: 110px;
          border-radius: 50%;
          overflow: hidden;
          .img-spread;
        }
        .sex {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #fff;
          position: absolute;
          top: 90px;
          left: 54%;
          .img-spread;
        }
        .mine-floor {
          position: absolute;
          top: 130px;
          left: 50%;
          transform: translateX(-50%);
          .name {
            height: 40px;
            text-align: center;
            line-height: 40px;
            font-size: 20px;
            .id {
              color: #766168;
              font-size: 10px;
            }
          }
        }
      }
      .User-Info {
        width: 680px;
        margin: 10px auto;
        .clearfix;

        .wawa {
          width: 300px;
          float: left;
          margin-left: 80px;
          &:nth-child(2n-1) {
            margin-left: 0px;
          }
          .wawaImg {
            width: 300px;
            height: 340px;
          }
          .wawaName {
            font-size: 18px;
            text-align: left;
            height: 30px;
            line-height: 30px;
          }
          .wawaTiem {
            font-size: 22px;
            text-align: left;
            height: 35px;
            line-height: 35px;
          }
        }
      }
    }
  }

</style>
