<template>
  <div class="home-index">
    <!--导航置顶-->
    <ul class="nav-wrapper" :class="isNavWrapperTop?'nav-wrapper-top':''" v-if="isNavWrapperTop" ref="navWrapper">
      <li class="nav-item" v-for="(nav,index) in navs" :key="nav.id" @click="navItem(index)">
        <img :src="Number(nav.is_default)?nav.icon1:nav.icon2" alt="">
      </li>
    </ul>

    <!--scroll-view 是滚动条-->
    <scroll-view
      ref="scrollerIndex"
      :tabHeight="-tabHeight"
      :showBottom="{isShow:true,text:'没有更多娃娃了哟~'}"
      :scrollBottomOffset=4
      @on-pulldown-loading="onPulldownLoading"
      @on-pullup-loading="onPullupLoading"
      @on-scroll="onScroll">
      <!--首页-->
      <div class="home_content">
        <!--头部
          vue2 ref是用来给元素或子组件注册引用信息。引用信息将会注册在父组件$regs对象上。
         -->
        <header ref="homeHeader">
          <!--显示用户信息组件-->
          <router-link class="user_info" :to="{path:'/my',query:{}}">
            <!--用户头像-->
            <div class="avatar">
              <img :src="userInfo.avatar" alt="">
            </div>
            <!--用户等级-->
            <div class="vip_con">
              <img :src="vipIcon(userInfo.vip_level)" alt="">
            </div>
            <!--用户名称-->
            <p class="name">{{userInfo.user_nicename}}</p>
          </router-link>
          <!--显示我的红包组件-->
          <router-link class="redpacket" :to="{path:'/envelopes'}">
            <div class="wrapper">
              <p class="num">{{parseInt(userInfo.redpacket)/100}}<span> 元</span></p>
            </div>
          </router-link>
          <!--显示金币组件-->
          <router-link class="coin_num" :to="{path:'/recharge',query:{}}">
            <div class="wrapper">
              <p class="num">{{showCoin(userInfo.coin)}}</p>
            </div>
          </router-link>
        </header>
        <!--充值奖励 娃娃晒单 排行榜-->
        <div class="btn_wrapper" ref=btnWrapper>
          <!--充值奖励-->
          <div class="btn_item" @click="rechargeBtn">
            <img src="~/img/home/recharge_btn.png" alt="">
          </div>
          <!--娃娃晒单-->
          <div class="btn_item" @click="sunburnBtn">
            <img src="~/img/home/sunburn_btn.png" alt="">
          </div>
          <!--排行榜-->
          <div class="btn_item" @click="rankBtn">
            <img src="~/img/home/rank_btn.png" alt="">
          </div>
        </div>
        <!--点击banner时出现的链接  相当于轮播-->
        <swiper-list :data="banners" ref="swiper" @swiper-item="swiperItem"></swiper-list>
        <!--首页的抓娃娃列表  全部。。。-->
        <ul class="nav-wrapper" ref="navWrapper" v-if="navlength != 1">
          <li class="nav-item" v-for="(nav,index) in navs" :key="nav.id" @click="navItem(index)">
            <img class="nav-icon" :src="Number(nav.is_default)?nav.icon1:nav.icon2" alt="">
          </li>
        </ul>
        <!--抓娃娃的列表-->
        <list-home :wawaList="wawaList"/>
      </div>
    </scroll-view>
    <!-- 排行榜点击页面 -->
    <rank-list v-if="isShowRank" :isShow="isShowRank" @closeRank="closeRank" @changeZIndex="changeZIndex"/>
  </div>
</template>

<script>
  /*用于导入由另一个模块导出的绑定。无论是否声明了 strict mode ，导入的模块都运行在严格模式下。import语句不能在嵌入式脚本中使用。*/
  import {mapGetters} from "vuex";
  import {Swiper, SwiperItem} from "vux";
  import ListHome from "./ListHome";
  import RankList from "./RankList";
  import ScrollView from "@/common/ScrollView";
  import SwiperList from "@/common/SwiperList";
  import api from "api/BaseService";
  import {clickBannerItem, updateBaseInfo} from "../../../common/util/Utils";
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
        isNavWrapperTop: false, //是否吸顶导航
        navlength:0,
      };
    },
    watch: {
      $route(to, from) {
        let query = to.query;
        let path = to.path;
        if (query.keep) {
          this._getCategory();
          updateBaseInfo();
        }

        if (from.path === '/room') {
          this.$refs.scrollerIndex.reset();
        }
      },
      isOneShow(bool) {
        if (bool) {
          this._getCategory();
          updateBaseInfo();
        }
      },
      roomListStatus(data) {
        let arr = this.wawaList;
        for (let len = arr.length, i = 0; i < len; i++) {
          if (arr[i].giftid == data.gift_id) {
            arr[i].status = parseInt(data.status);
          }
        }
        this.wawaList = arr;
      }
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
        console.log('111111111111111111111111111',result.length);
        if(result.length===1){
          this.navlength=result.length;
        }else{
          this.navlength=0;
        }
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
            updateBaseInfo();
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
          if(this.navlength==1){
            this.isNavWrapperTop = false;
          }else{
            this.isNavWrapperTop = true;
          }
        } else {
          //删除class
          this.isNavWrapperTop = false;
        }
        return pos;
      },
      /*点击banner*/
      swiperItem(banner) {
        let gotoTab = clickBannerItem.call(this, banner);
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
      ...mapGetters(["userInfo", 'token', 'uid', 'isOneShow', 'roomListStatus'])
    },
    components: {
      ScrollView,
      Swiper,
      SwiperItem,
      ListHome,
      RankList,
      SwiperList,
    },
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
          //flex: 1;
          color: #000;
        }
        .user_info {
          position: relative;
          width: 300px;
          height: 120px;
          .avatar {
            position: absolute;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 4px solid @auxColor;
            overflow: hidden;
            background-color: #000;
            z-index: 1;
            .img-spread;
          }
          .vip_con {
            position: absolute;
            bottom: 4px;
            left: 6px;
            width: 138*0.7px;
            height: 66*0.7px;
            z-index: 2;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .name {
            padding: 0 20px;
            height: 50px;
            width: 160px;
            line-height: 50px;
            position: absolute;
            left: 100px;
            top: 32px;
            font-size: @mainFontSize;
            background-color: #fff;
            border-top-right-radius: 60px;
            border-bottom-right-radius: 60px;
            .over-ellip;
          }
        }
        .redpacket {
          position: absolute;
          right: 200px;
          width: 200px;
          display: flex;
          align-items: center;
          .wrapper {
            width: 178px;
            height: 65px;
            .background-url('~img/home/red_bg.png');
          }
          .num {
            margin-left: 64px;
            line-height: 50px;
            .over-ellip;
            span {
              font-size: @minFontSize;
            }
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
      height: 80px;
      .btn_item {
        width: 210px;
        height: 78px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .nav-wrapper {
      margin-top: -6px;
      display: flex;
      justify-content: center;
      height: 120px;
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
        width: 120px;
        height: 120px;
        .img-spread;
      }
    }
  }
</style>
