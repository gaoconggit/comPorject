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
        <swiper :aspect-ratio="300/668" ref="swiper" loop auto dots-position="center" dots-class="dots_item" index="0">
          <swiper-item v-for="banner in banners" :key="Math.random()" @click.native="swiperItem(banner)">
            <img :src="banner.slide_pic" alt="">
          </swiper-item>
        </swiper>
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
import { mapGetters } from "vuex";
import { Swiper, SwiperItem } from "vux";
import ListHome from "./ListHome";
import RankList from "./RankList";
import ScrollView from "@/common/ScrollView";
import api from "api/BaseService";
import { baseUrl } from "../../../config/config";

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
      onFetching: false, //距离底部时是否加载数据
      listPage: 1, //显示页码
      isShowRank: false, //是否展示排行榜
      isNavWrapperTop: false //是否吸顶导航
    };
  },
  created() {
    this.$vux.loading.show({
      text: "加载中.."
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.homeHeight = this.$refs.homeHeader.clientHeight;
      this.swiperHeight = parseInt(this.$refs.swiper.xheight);
      this.btnWrapper = this.$refs.btnWrapper.clientHeight;
      this.navWrapper = this.$refs.navWrapper;
      this.$refs.scrollerIndex.reset({ top: 0 });
    });
    this._getBanner();
    this._getCategory();
  },
  methods: {
    async _getBanner() {
      let result = await api.getBanner();
      this.banners = result.data.slide;
      console.log(result.data.slide);
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
      console.log(result);
    },
    async _getWawaList(type, isRefresh = false, page = 1) {
      let result = await api.getWawaList(type, page);
      console.log(result);
      if (result.data.length) {
        if (page === 1) {
          this.wawaList = result.data;
        } else {
          this.wawaList = this.wawaList.concat(result.data);
        }
        this.$refs.scrollerIndex.donePullup();
      } else if (page > 1) {
        console.log(1);
        this.onFetching = false;
        this.$refs.scrollerIndex.disablePullup();
        console.log("没有更多娃娃了1");
      } else {
        console.log(2);
        this.wawaList = [];
        this.onFetching = false;
        this.$refs.scrollerIndex.disablePullup();
        console.log("没有更多娃娃了2");
      }
      this.$vux.loading.hide();
      this.$nextTick(() => {
        //上拉刷新更新数据
        if (isRefresh) {
          this.listPage = 1;
          this.$refs.scrollerIndex.reset({ top: 0 }, 500);
          this.$refs.scrollerIndex.enablePullup();
          this.$refs.scrollerIndex.donePulldown();
        } else {
          this.$refs.scrollerIndex.reset();
        }
      });
    },
    scrollReset(){
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
      console.log(banner);
      if (banner.slide_url !== "" || banner.slide_content !== "") {
        window.location.href = slide_url;
      } else {
        switch (banner.jump_target) {
          case "store":
            this.$router.push({ path: "/recharge" });
            break;
          case "niudan":
            this.$emit("changeTab", 2);
            break;
        }
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
          { top: this.homeHeight + this.btnWrapper + this.swiperHeight },
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
      this.$router.push({ path: "/recharge" });
      console.log("充值中心");
    },
    /*晒单*/
    sunburnBtn() {
      this.$router.push({
        path: "/details",
        query: {
          title: "晒单",
          url: "https://www.baidu.com" //`${baseUrl}photowall/index.php?base_url=${baseUrl}api/public/&token=${this.userInfo.token}&uid=${this.userInfo.id}`
        }
      });
    },
    /*排行榜*/
    rankBtn() {
      this.isShowRank = true;
      this.$emit("changeZIndex", 0);
      console.log("排行榜");
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
    ...mapGetters(["userInfo"])
  },
  components: {
    ScrollView,
    Swiper,
    SwiperItem,
    ListHome,
    RankList
  }
};
</script>

<style lang="less">
@import "~assets/style/index.less";

.home-index {
  .scroller {
    background-image: url("~img/home/main_bg.png");
    background-size: cover;
  }
  .home_content {
    header {
      display: flex;
      padding: 4px 10px 0;
      align-items: center;
      a {
        flex: 1;
        color: #000;
      }
      .user_info {
        position: relative;
        height: 70px;
        .avatar {
          position: absolute;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 2px solid @auxColor;
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
          bottom: 2px;
          left: 6px;
          width: 138/2.5px;
          height: 66/2.5px;
          z-index: 2;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .name {
          padding: 0 10px;
          height: 30px;
          width: 110px;
          line-height: 30px;
          position: absolute;
          left: 60px;
          top: 16px;
          font-size: 16px;
          background-color: #fff;
          border-top-right-radius: 30px;
          border-bottom-right-radius: 30px;
          .over-ellip;
        }
      }
      .coin_num {
        position: absolute;
        right: 6px;
        .wrapper {
          width: 178/2px;
          height: 66/2px;
          background-image: url(../../../assets/img/home/coin_bg.png);
          background-size: 100% 100%;
          .num {
            position: absolute;
            left: 30px;
            top: 8px;
            font-size: 14px;
          }
        }
      }
    }
  }
  .btn_wrapper {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 94/2px;
    .btn_item {
      width: 214/2px;
      height: 84/2px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .nav-wrapper {
    margin-bottom: 4px;
    display: flex;
    justify-content: center;
    height: 130/2px;
    transition: all 0.3s;
    &.nav-wrapper-top {
      position: absolute;
      top: 0;
      width: 100%;
      z-index: 12;
      background-color: #FFA9B4;
      box-shadow: 2px 2px 6px #888;
    }
    .nav-item {
      width: 130/2px;
      height: 130/2;
      .nav-icon {
        width: 100%;
        height: 100%;
      }
    }
  }

  .vux-slider {
    // height: 334/2px;
    .vux-swiper {
      // height: 100% !important;
      .vux-swiper-item {
        .img-spread;
      }
    }
    .dots_item {
      .vux-icon-dot {
        width: 10px !important;
        height: 10px !important;
        border-radius: 20px !important;
        &.active {
          width: 20px !important;
          background-color: #ff8dac !important;
        }
      }
    }
  }
}
</style>
