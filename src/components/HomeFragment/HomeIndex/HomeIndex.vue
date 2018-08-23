<template>
  <div class="home_index">
    <scroller
      class="scroller" lock-x use-pullup use-pulldown
      v-model="scrollStatus"
      @on-pulldown-loading="onPulldownLoading"
      @on-pullup-loading="onPullupLoading"
      height="-40"
      ref="scrollerEvent">
      <div class="home_content">
        <header>
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
        <swiper loop auto dots-position="center" dots-class="dots_item" index="0">
          <swiper-item v-for="banner in banners" :key="Math.random()" @click.native="swiperItem(banner)">
            <img :src="banner.slide_pic" alt="">
          </swiper-item>
        </swiper>
        <ul class="nav-wrapper">
          <li class="nav-item" v-for="(nav,index) in navs" :key="nav.id" @click="navItem(index)">
            <img class="nav-icon" :src="Number(nav.is_default)?nav.icon1:nav.icon2" alt="">
          </li>
        </ul>
        <list-content :wawaList="wawaList"></list-content>
      </div>
      <!--下拉刷新-->
      <div slot="pulldown"
           class="xs-plugin-pulldown-container xs-plugin-pulldown-down">
        <x-icon v-show="scrollStatus.pulldownStatus!=='loading'" type="ios-arrow-up"
                :class="{'rotate': scrollStatus.pulldownStatus === 'down'}"></x-icon>
        <span v-show="scrollStatus.pulldownStatus === 'loading'">
            <load-more tip="正在刷新" class="loadmore"></load-more>
          </span>
      </div>
      <!--上拉加载更多-->
      <div v-show="scrollStatus.pullupStatus !== 'disabled'" slot="pullup"
           class="xs-plugin-pullup-container xs-plugin-pullup-up">
        <x-icon v-show="scrollStatus.pullupStatus!=='loading'" type="ios-arrow-down"
                :class="{'rotate': scrollStatus.pullupStatus === 'down'}"></x-icon>
        <span v-show="scrollStatus.pullupStatus === 'loading'">
            <load-more :tip="scrollStatus.pullupText" class="loadmore"></load-more>
          </span>
      </div>
    </scroller>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {Scroller, LoadMore, Swiper, SwiperItem} from "vux";
  import ListContent from "./ListContent"
  import api from "api/BaseService";

  export default {
    name: "HomeIndex",
    data() {
      return {
        scrollHeight: '600px',
        scrollStatus: {
          pullupStatus: 'default',
          pulldownStatus: 'default',
          pullupText: '拼命加载中'
        },
        banners: [],              //banner列表
        navs: [],                 //导航列表
        navIndex: 0,              //导航选项
        wawaList: [],             //房间列表
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.scrollerEvent.reset({top: 0})
      });
      this._getBanner();
      this._getCategory();
    },
    methods: {
      async _getBanner() {
        let result = await api.getBanner();
        this.banners = result.slide;
        console.log(result.slide);
      },
      async _getCategory() {
        let result = await api.getCategory();
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
        this.wawaList = result;
        console.log(result);
        if (isRefresh) {
          this.$refs.scrollerEvent.enablePullup();
          this.$refs.scrollerEvent.donePulldown();
        }
      },
      onPulldownLoading() {
        console.log(2)
        this._getWawaList(this.navs[this.navIndex], true);
      },
      onPullupLoading() {
        console.log(3)
        setTimeout(() => {
          console.log("没有更多房间了哟");
          this.$refs.scrollerEvent.disablePullup();
        }, 3000)
      },
      /*点击banner*/
      swiperItem(banner) {
        console.log(banner);
        if (banner.slide_url !== "" || banner.slide_content !== "") {
          window.location.href = slide_url;
        } else {
          switch (banner.jump_target) {
            case "store":
              this.$router.push({path: '/recharge'});
              break;
            case "niudan":
              this.$emit('changeTab', 2);
              break;
          }
        }
      },
      /*Vip等级展示图片*/
      vipIcon(num) {
        let vipLevel = Number(num);
        if (vipLevel) {
          if (vipLevel > 0 && vipLevel < 7) {
            return require(`../../../assets/img/com_img/vip_${vipLevel}.png`);
          } else {
            return require(`../../../assets/img/com_img/vip_7.png`);
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
            return 9999 + '+';
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
          this.navIndex = index;
          this._getWawaList(this.navs[index].id);
          let arr = this.navs;
          arr.forEach((item, nIndex) => {
            arr[nIndex].is_default = 0;
            arr[index].is_default = 1;
          })
          this.navs = arr;
        }
      }
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    components: {
      Scroller, LoadMore, Swiper, SwiperItem, ListContent
    }
  }
</script>

<style lang="less">
  @import "../../../assets/style/index.less";

  .home_index {
    .scroller {
      background-image: url("../../../assets/img/home/main_bg.png");
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
            bottom: 0;
            left: 0;
            width: 138/2px;
            height: 66/2px;
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
            background-color: #FFF;
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
              top: 6px;
            }
          }
        }
      }

    }
    .nav-wrapper {
      display: flex;
      justify-content: center;
      height: 130/2px;
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
      height: 334/2px;
      .vux-swiper {
        height: 100% !important;
        .vux-swiper-item {
          img {
            width: 100%;
          }
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

    .loadmore {
      margin: 0 auto 5px !important;
      span {
        color: #000;
      }
    }

    .rotate {
      transform: rotate(180deg);
      -webkit-transform: rotate(180deg);
    }

    .pullup-arrow {
      display: block;
      transition: all linear 0.2s;
      -webkit-transition: all linear 0.2s;
      color: #666;
      font-size: 25px;
    }

    .xs-plugin-pulldown-down {
      position: absolute;
      width: 100%;
      height: 30px;
      line-height: 30px;
      top: -30px;
      text-align: center;
    }

    .no-more {
      text-align: center;
      line-height: 30px;
      .font-dpr(14px);
    }
  }
</style>
