<template>
  <div class="earn-wrapper">
    <header class="niu-header" ref="niuHeader">
      <img class="img-decorate" src="~/img/niudan/niudan_header.gif" alt="">
      <img class="img-text" src="~/img/niudan/earn_header_text.png" alt="">
      <img class="img-decorate" src="~/img/niudan/niudan_header.gif" alt="">
    </header>
    <scorll-view
      ref="scrollerEarn"
      :tabHeight="scrollBottom"
      :showBottom="{isShow:true,text:'没有更多娃娃了哟~'}"
      @on-pulldown-loading="onPulldownLoading"
      @on-pullup-loading="onPullupLoading">
      <div class="earn-content">
        <swiper-list :data="gameCenterBanners"/>
        <earn-list class="list-wrapper" :data="gameCenterList"/>
      </div>
    </scorll-view>
  </div>
</template>

<script>
  import api from "../../../api/BaseService";
  import ScorllView from "@/common/ScrollView";
  import SwiperList from "@/common/SwiperList"
  import EarnList from "./EarnList";

  export default {
    name: "NiuIndex",
    props: ["tabHeight"],
    data() {
      return {
        scrollBottom: 0,            //header的高度
        gameCenterBanners: [],      //扭蛋列表
        gameCenterList: [],         //扭蛋列表
        page: 1,                    //访问到第几页
      };
    },
    mounted() {
      this._getGameCenterList();
      console.log(this.tabHeight, this.$refs.niuHeader.clientHeight);
      this.$nextTick(() => {
        this.scrollBottom = -(this.tabHeight + this.$refs.niuHeader.clientHeight);
      });
    },
    methods: {
      async _getGameCenterList(page = 1, isRefresh = false) {
        let result = await api.getGameCenterList(page);
        result = result.data;
        console.log(result);
        if (!this.gameCenterBanners.length) {
          this.gameCenterBanners = result.banner;
        }
        if (result.list.length) {
          //上拉刷新更新数据
          if (isRefresh) {
            this.listPage = 1;
            this.$refs.scrollerEarn.reset({top: 0}, 500);
            this.$refs.scrollerEarn.enablePullup();
            this.$refs.scrollerEarn.donePulldown();
          } else {
            this.$refs.scrollerEarn.reset();
          }
          if (page === 1) {
            this.gameCenterList = result.list;
          } else {
            this.gameCenterList = this.gameCenterList.concat(result.list);
          }
          if (result.list.length < 10) {
            this.$refs.scrollerEarn.disablePullup();
          } else {
            this.$refs.scrollerEarn.donePullup();
          }
        } else if (page > 1) {
          console.log(1);
          this.$refs.scrollerEarn.disablePullup();
          console.log("没有更多娃娃了1");
        } else {
          console.log(2);
          this.gameCenterList = [];
          this.$refs.scrollerEarn.disablePullup();
          console.log("没有更多娃娃了2");
        }
        this.$vux.loading.hide();
      },
      onPulldownLoading() {
        this.$vux.loading.show({
          text: "加载中.."
        });
        this.page = 1;
        this._getGameCenterList(1, true);
      },
      onPullupLoading() {
        this.$vux.loading.show({
          text: "加载中.."
        });
        this.page += 1;
        this._getGameCenterList(this.page);
      },
      changTab() {
        this.$emit("changeTab", 0);
      }
    },
    components: {
      ScorllView, SwiperList, EarnList
    }
  };
</script>

<style lang="less">
  @import "~assets/style/index.less";

  .earn-wrapper {
    position: fixed;
    width: 100%;
    height: 100%;
    .background-url("~img/home/main_bg.png");
    .niu-header {
      display: flex;
      width: 100%;
      height: 88px;
      justify-content: center;
      align-items: center;
      .img-decorate,
      .img-text {
        .img-spread;
      }
      .img-decorate {
        width: 90px;
        height: 28px;
      }
      .img-text {
        margin: 0 50px;
        width: 193px;
        height: 34px;
      }
    }
    .earn-content {
      //height: 1000px;
      .list-wrapper {
        margin-top: 20px;
      }
    }
  }
</style>
