<template>
  <div class="Detailed-data">
    <title-bar title="红包明细" class="title" @get-title-height="getTitleHeight"/>
    <header class="Detailed-header" ref="detailedTitle">
      <img src="../../assets/img/envelopes/header_bg.png" class="img-style" alt="">
      <div class="redNumber">{{parseInt(userInfo.redpacket)/100}}<span>元</span></div>
    </header>
    <scroll-view :tabHeight="-tabHeight" ref="scrollRed"
                 lock-x
                 scrollbarY
                 bounce
                 use-pulldown
                 use-pullup
                 @on-pulldown-loading="onPulldown"
                 @on-pullup-loading="onPullup"
                 v-model="status"
                 :showBottom='{isShow:true,text:"没有更多红包了"}'
    >
      <div class="Detailed-content">
        <div class="content-list" v-for="item in detailed">
          <p class="list-name">{{item.actiontitle}}</p>
          <p class="list-time">{{item.time}}</p>
          <p class="list-yuan" v-bind:class="parseInt(item.redpacket)<0?'one':'tow'">{{parseInt(item.redpacket)/100}}元</p>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import TitleBar from "../../common/TitleBar";
  import BaseService from "../../api/BaseService";
  import ScrollView from "@/common/ScrollView";
  export default {
    components: {TitleBar, ScrollView},
    name: "RedDetailed",
    data(){
      return{
        detailed:{},
        tabHeight: '',
        status: {
          pullupStatus: "default",
          pulldownStatus: "default",
        },
        page: 1,
      }
    },
    methods: {
      getTitleHeight: function (data) {
        this.tabHeight = this.$refs.detailedTitle.clientHeight + data;
      },
      redDetailed: function (p = 1, isRefresh = false) {
        BaseService.redDetailed(p)
          .then((result) => {
            this.$refs.scrollRed.donePulldown();
            if (result.data.length) {
              console.log(result.data.length);
              if (isRefresh) {
                this.page = 1;
                this.$refs.scrollRed.reset({top: 0}, 500);
                this.$refs.scrollRed.enablePullup();
                this.$refs.scrollRed.donePulldown();
              } else {
                this.$refs.scrollRed.reset();
              }
              if (p === 1) {
                //当page为1时，数据应该为空
                this.detailed = result.data;
              } else {
                //当page大于1时，数据应该累加
                this.detailed = this.detailed.concat(result.data);
              }
              if (result.data.length < 10) {
                this.$refs.scrollRed.disablePullup();
                console.log("只有这么多了");
              } else {
                this.$refs.scrollRed.donePullup();
              }
            } else if (p > 1) {
              this.$refs.scrollRed.disablePullup();
              console.log("没有更多红包了1");
            } else {
              this.detailed = [];
              this.$refs.scrollRed.disablePullup();
              console.log("没有更多红包了2");
            }
            this.$vux.loading.hide();
            console.log(result.data);
          }).catch((err) => {
          console.log(err);
        })
      },
      /*刷新*/
      onPulldown: function () {
        this.page = 1;
        this.redDetailed(this.page, true)
      },
      /*页码加一  加载  请求数据*/
      onPullup: function () {
        this.page += 1;
        console.log(this.page);
        this.redDetailed(this.page, false);
      },
    },

    mounted() {
      this.redDetailed();
    },
    computed: {...mapGetters(['userInfo'])}
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";
  .img-style{
    width: 100%;
    height:100%;
  }
  .one {
    color: @mainColor;
  }
  .tow{
    color: @redColor;
  }
  .Detailed-data{
    .Detailed-header {
      width: 100%;
      height: 220px;
      position: relative;
      border-bottom: 1px solid @lightGrayColor;
      .redNumber {
        position: absolute;
        top: 30%;
        left: 50%;
        color: @whiteColor;
        text-align: center;
        line-height: 60px;
        transform: translateX(-50%);
        font-size: 70px;
        font-weight: 600;
        span {
          font-size: 45px;
        }
      }
    }
    .Detailed-content {
      .content-list {
        width: 100%;
        height: 150px;
        border-bottom: 1px solid @lightGrayColor;
        position: relative;
        p {
          margin-left: 20px;
        }
        .list-name {
          height: 90px;
          text-align: left;
          line-height: 80px;
          font-size: @maxFontSize;
        }
        .list-time {
          height: 60px;
          text-align: left;
          line-height: 60px;
          font-size: @subFontSize;
          color: @grayColor;
        }
        .list-yuan{
          height: 100%;
          position: absolute;
          right: 20px;
          top: 0;
          text-align: center;
          line-height: 150px;
          font-size: @maxFontSize;
        }
      }
    }
  }
</style>
