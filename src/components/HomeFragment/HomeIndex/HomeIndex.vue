<template>
  <div class="home-index">
    <ul class="nav-wrapper" :class="isNavWrapperTop?'nav-wrapper-top':''" v-if="isNavWrapperTop" ref="navWrapper">
      <li class="nav-item" v-for="(nav,index) in navs" :key="nav.id" @click="navItem(index)">
        <img class="nav-icon" :src="Number(nav.is_default)?nav.icon1:nav.icon2" alt="">
      </li>
    </ul>
    <scroll-view
      ref="scrollerIndex"
      :tabHeight="-tabHeight"
      :showBottom="{isShow:true,text:'没有更多娃娃了哟~'}"
      :scrollBottomOffset=4
      @on-pulldown-loading="onPulldownLoading"
      @on-pullup-loading="onPullupLoading"
      @on-scroll="onScroll">
      <div class="home_content">
        <header ref="homeHeader">
          <router-link class="user_info" :to="{path:'/my',query:{}}">
            <div class="avatar">
              <img :src="userInfo.avatar" alt="">
            </div>
            <div class="vip_con">
              <img :src="vipIcon(userInfo.vip_level)" alt="">
            </div>
            <p class="name">{{userInfo.user_nicename}}</p>
          </router-link>
          <router-link class="coin_num" :to="{path:'/recharge',query:{}}">
            <div class="wrapper">
              <p class="num">{{showCoin(userInfo.coin)}}</p>
            </div>
          </router-link>
        </header>
        <div class="btn_wrapper" ref=btnWrapper>
          <div class="btn_item" @click="rechargeBtn">
            <img src="~/img/home/recharge_btn.png" alt="">
          </div>
          <div class="btn_item" @click="sunburnBtn">
            <img src="~/img/home/sunburn_btn.png" alt="">
          </div>
          <div class="btn_item" @click="rankBtn">
            <img src="~/img/home/rank_btn.png" alt="">
          </div>
        </div>
        <swiper-list :data="banners" ref="swiper" @swiper-item="swiperItem"></swiper-list>
        <ul class="nav-wrapper" ref="navWrapper">
          <li class="nav-item" v-for="(nav,index) in navs" :key="nav.id" @click="navItem(index)">
            <img class="nav-icon" :src="Number(nav.is_default)?nav.icon1:nav.icon2" alt="">
          </li>
        </ul>
        <list-home :wawaList="wawaList"/>
      </div>
    </scroll-view>
    <rank-list v-if="isShowRank" :isShow="isShowRank" @closeRank="closeRank" @changeZIndex="changeZIndex"/>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {Swiper, SwiperItem} from "vux";
  import ListHome from "./ListHome";
  import RankList from "./RankList";
  import ScrollView from "@/common/ScrollView";
  import SwiperList from "@/common/SwiperList";
  import api from "api/BaseService";
  import {clickBannerItem} from "../../../common/util/Utils";
  import {baseUrl} from "../../../config/config";

  export default {
    name: "HomeIndex",
    props: ["tabHeight"],
    data() {
      return {
        scrollHeight: "600px",
        scrollStatus: {
          pullupStatus: "default",
          pulldownStatus: "default",
          pullupText: "拼命加载中"
        },
        banners: [], //banner列表
        navs: [], //导航列表
        navIndex: 0, //导航选项
        wawaList: [], //房间列表
        listPage: 1, //显示页码
        isShowRank: false, //是否展示排行榜
        isNavWrapperTop: false //是否吸顶导航
      };
    },
    watch: {
      $route(to, form) {
        let query = to.query;
        let path = to.path;
        if (query.keep) {
          this._getCategory();
          updateBaseInfo();
        }
      },
    },
    created() {
      this.$vux.loading.show({
        text: "加载中.."
      });
    },
    mounted() {
      this.$nextTick(() => {
        this.homeHeight = this.$refs.homeHeader.clientHeight;
        this.swiperHeight = parseInt(this.$refs.swiper.xheight());
        this.btnWrapper = this.$refs.btnWrapper.clientHeight;
        this.navWrapper = this.$refs.navWrapper;
        this.$refs.scrollerIndex.reset({top: 0});
      });
      this._getBanner();
      this._getCategory();
    },
    methods: {
      async _getBanner() {
        let result = await api.getBanner();
        this.banners = result.data.slide;
      },
      async _getCategory() {
        let result = await api.getCategory();
        result = result.data;
        result.forEach((item, index) => {
          if (Number(item.is_default)) {
            this.navIndex = index;
            this._getWawaList(item.id);
          }
        });
        this.navs = result;
      },
      async _getWawaList(type, isRefresh = false, page = 1) {
        let result = await api.getWawaList(type, page);
        if (result.data.length) {
          //上拉刷新更新数据
          if (isRefresh) {
            this.listPage = 1;
            this.$refs.scrollerIndex.reset({top: 0}, 500);
            this.$refs.scrollerIndex.enablePullup();
            this.$refs.scrollerIndex.donePulldown();
          } else {
            this.$refs.scrollerIndex.reset();
          }
          if (page === 1) {
            //当page为1时，数据应该为空
            this.wawaList = result.data;
          } else {
            //当page大于1时，数据应该累加
            this.wawaList = this.wawaList.concat(result.data);
          }
          if (result.data.length < 10) {
            this.$refs.scrollerIndex.disablePullup();
            console.log("只有这么多了");
          } else {
            this.$refs.scrollerIndex.donePullup();
          }
        } else if (page > 1) {
          this.$refs.scrollerIndex.disablePullup();
          console.log("没有更多娃娃了1");
        } else {
          this.wawaList = [];
          this.$refs.scrollerIndex.disablePullup();
          console.log("没有更多娃娃了2");
        }
        this.$vux.loading.hide();
      },
      scrollReset() {
        this.$refs.scrollerIndex.reset();
      },
      onPulldownLoading() {
        this.$vux.loading.show({
          text: "加载中.."
        });
        this._getWawaList(this.navs[this.navIndex].id, true);
      },
      onPullupLoading() {
        this.$vux.loading.show({
          text: "加载中.."
        });
        this.listPage += 1;
        this._getWawaList(this.navs[this.navIndex].id, false, this.listPage);
      },
      onScrollBottom() {
        /*if (!this.onFetching) {
            // do
            console.log("执行到底部刷新");
            this.onFetching = true
          }*/
      },
      onScroll(pos) {
        if (pos.top > this.homeHeight + this.swiperHeight + this.btnWrapper) {
          //添加class
          this.isNavWrapperTop = true;
        } else {
          //删除class
          this.isNavWrapperTop = false;
        }
        return pos;
      },
      /*点击banner*/
      swiperItem(banner) {
        let gotoTab = clickBannerItem(this, banner);
        console.log(gotoTab);
        if (gotoTab != null) {
          this.$emit('change-tab', gotoTab);
        }
      },
      /*Vip等级展示图片*/
      vipIcon(num) {
        let vipLevel = Number(num);
        if (vipLevel) {
          if (vipLevel > 0 && vipLevel < 7) {
            return require(`img/com_img/vip_${vipLevel}.png`);
          } else {
            return require(`img/com_img/vip_7.png`);
          }
        } else {
          return "";
        }
      },
      /*金币展示*/
      showCoin(num) {
        let coinNum = Number(num);
        if (coinNum) {
          if (coinNum < 10000) {
            return coinNum;
          } else {
            return 9999 + "+";
          }
        } else {
          return num;
        }
      },
      /*导航菜单点击*/
      navItem(index) {
        console.log(this.navIndex);
        if (index === this.navIndex) {
          return true;
        } else {
          this.$vux.loading.show({
            text: "加载中.."
          });
          this.navIndex = index;
          this.listPage = 1;
          this.$refs.scrollerIndex.enablePullup();
          this.$refs.scrollerIndex.donePulldown();
          this.$refs.scrollerIndex.reset(
            {top: this.homeHeight + this.btnWrapper + this.swiperHeight},
            500,
            "ease"
          );
          this._getWawaList(this.navs[index].id);
          let arr = this.navs;
          arr.forEach((item, nIndex) => {
            arr[nIndex].is_default = 0;
            arr[index].is_default = 1;
          });
          this.navs = arr;
        }
      },
      /*充值中心*/
      rechargeBtn() {
        this.$router.push({path: "/recharge"});
      },
      /*晒单*/
      sunburnBtn() {
        this.$router.push({
          path: "/details",
          query: {
            title: "晒单",
            url: `${baseUrl}photowall/index.php?base_url=${baseUrl}api/public/&token=${this.token}&uid=${this.uid}`
          }
        });
      },
      /*排行榜*/
      rankBtn() {
        this.isShowRank = true;
        this.$emit("changeZIndex", 0);
      },
      changeZIndex(index) {
        this.$emit("changeZIndex", index);
      },
      closeRank() {
        this.$emit("changeZIndex", 10);
        this.isShowRank = false;
      }
    },
    computed: {
      ...mapGetters(["userInfo", 'token', 'uid'])
    },
    components: {
      ScrollView,
      Swiper,
      SwiperItem,
      ListHome,
      RankList,
      SwiperList,
    }
  };
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .home-index {
    .scroller {
      background-image: url("~img/home/main_bg.png");
      background-size: cover;
    }
    .home_content {
      header {
        display: flex;
        padding: 8px 20px 0;
        align-items: center;
        a {
          flex: 1;
          color: #000;
        }
        .user_info {
          position: relative;
          height: 140px;
          .avatar {
            position: absolute;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            border: 4px solid @auxColor;
            overflow: hidden;
            background-color: #000;
            z-index: 1;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .vip_con {
            position: absolute;
            bottom: 4px;
            left: 10px;
            width: 138*0.8px;
            height: 66*0.8px;
            z-index: 2;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .name {
            padding: 0 20px;
            height: 60px;
            width: 220px;
            line-height: 60px;
            position: absolute;
            left: 120px;
            top: 32px;
            font-size: @mainFontSize;
            background-color: #fff;
            border-top-right-radius: 60px;
            border-bottom-right-radius: 60px;
            .over-ellip;
          }
        }
        .coin_num {
          position: absolute;
          right: 12px;
          .wrapper {
            width: 178px;
            height: 66px;
            background-image: url(../../../assets/img/home/coin_bg.png);
            background-size: 100% 100%;
            .num {
              position: absolute;
              left: 60px;
              top: 16px;
              font-size: @subFontSize;
            }
          }
        }
      }
    }
    .btn_wrapper {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 94px;
      .btn_item {
        width: 214px;
        height: 84px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .nav-wrapper {
      margin-bottom: 8px;
      display: flex;
      justify-content: center;
      height: 130px;
      transition: all 0.3s;
      z-index: 2 !important;
      &.nav-wrapper-top {
        position: absolute;
        top: 0;
        width: 100%;
        z-index: 12;
        background-color: #FFA9B4;
        box-shadow: 4px 4px 12px #888;
      }
      .nav-item {
        width: 130px;
        height: 130px;
        .nav-icon {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>
