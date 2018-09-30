<template>
  <div class="home-wrapper">
    <!--首页区域-->
    <keep-alive>
      <router-view @change-tab="changeTab" @changeZIndex="changeZIndex" :tabHeight="tabHeight"></router-view>
    </keep-alive>
    <tabbar class="tab_bar"
            :style="{zIndex: tabZIndex}"
            iconClass="icon_img"
            v-model="tabIndex"
            @on-index-change="onIndexChange">
      <!--首页底部的按钮-->
      <tabbar-item link="/home/index">
        <!--单击前-->
        <img slot="icon" src="../../assets/img/index/index_select_not.png">
        <!--单击后-->
        <img slot="icon-active" src="../../assets/img/index/index_select.png">
      </tabbar-item>
      <!--旋转娃娃的按钮-->
      <tabbar-item link="/home/zxww">
        <!--单击前图片-->
        <img slot="icon" src="../../assets/img/index/xzww_select_not.png">
        <!--单击后图片-->
        <img slot="icon-active" src="../../assets/img/index/xzww_select.png">
      </tabbar-item>
      <!--扭蛋机按钮-->
      <tabbar-item link="/home/niu">
        <!--单击前图片-->
        <img slot="icon" src="../../assets/img/index/niu_select_not.png">
        <!--单击后图片-->
        <img slot="icon-active" src="../../assets/img/index/niu_select.png">
      </tabbar-item>
      <!--积分商城按钮-->
      <tabbar-item link="/home/score">
        <!--单击前图片-->
        <img slot="icon" src="../../assets/img/index/shop_select_not.png">
        <!--单击后图片-->
        <img slot="icon-active" src="../../assets/img/index/shop_select.png">
      </tabbar-item>
      <!--赚金币按钮-->
      <tabbar-item link="/home/earn">
        <!--单击前图片-->
        <img slot="icon" src="../../assets/img/index/earn_select_not.png">
        <!--单击后图片-->
        <img slot="icon-active" src="../../assets/img/index/earn_select.png">
      </tabbar-item>
    </tabbar>
    <SignPopup v-if="isSign" :data="signData" @sign-complete="signComplete"/>
    <SignWeek v-if="isSignCard" :data="signCardInfo" @close-sign-card="closeSignCard"/>
    <public-notice v-if="isPublicNotice" :data="publicNoticeInfo" @close-public="closePublic" @change-tab="changeTab"/>
    <new-bee-room v-if="isNewBee" @close-new-bee="closeNewBee"/>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {Tabbar, TabbarItem} from 'vux';
  import SignPopup from "../../components/SignGater/SignPopup";
  import SignWeek from "../../components/SignGater/SignWeek";
  import PublicNotice from "../../components/SignGater/PublicNotice";
  import NewBeeRoom from "../../components/SignGater/NewBeeRoom";
  import api from "../../api/BaseService";
  import {showToast, updateBaseInfo} from "../../common/util/Utils";

  export default {
    name: "HomeFragment",
    data() {
      return {
        back: false,
        tabIndex: 0,      //默认选中的底部菜单
        tabHeight: 48,
        tabZIndex: 2,
        isSign: false,     //是否签到
        signData: [],     //签到信息
        isSignCard: false, //是否周卡签到
        signCardInfo: [],     //周卡签到
        isPublicNotice: false,  //公告展示
        publicNoticeInfo: [],   //公告展示
        isNewBee: false,        //是否前往新手场房间
        newBeeData: [],         //是否前往新手场房间
      };
    },
    created() {
      console.log("created route:", this.$route);
      let path = this.$route.path;
      switch (path) {
        case '/home/index':
          this.tabIndex = 0;
          break;
        case '/home/zxww':
          this.tabIndex = 1;
          break;
        case '/home/niu':
          this.tabIndex = 2;
          break;
        case '/home/score':
          this.tabIndex = 3;
          break;
        case '/home/earn':
          this.tabIndex = 4;
          break;
        default:
          this.tabIndex = 0;
      }
    },
    watch: {
      $route(to, form) {
        document.title = "掌上抓娃娃-" + this.$route.name;
        let path = to.path;
        console.log("watch route:", to);
        switch (path) {
          case '/home/index':
            this.tabIndex = 0;
            break;
          case '/home/zxww':
            this.tabIndex = 1;
            break;
          case '/home/niu':
            this.tabIndex = 2;
            break;
          case '/home/score':
            this.tabIndex = 3;
            break;
          case '/home/earn':
            this.tabIndex = 4;
            break;
          default:
            this.tabIndex = 0;
        }
      },
      isOneShow() {
        if (this.isOneShow) {
          this._getSignInfo();
        }
      }
    },
    mounted() {
      if (this.isOneShow) {
        this._getSignInfo();
      }
    },
    methods: {
      //签到信息
      async _getSignInfo() {
        let result = await api.getSignInfo();
        if (!result.data.has_sign_in) {
          this.isSign = true;
        } else {
          this._getVipCard();
        }
        this.signData = result.data;
      },
      async _getVipCard() {
        let result = await api.getVipCard();
        if (result.data.vip_card_list.length) {
          let res = result.data.vip_card_list.some((item) => {
            if (!item.accepted) {
              return true;
            }
            return false;
          });
          console.log("res:", res);
          if (res) {
            for (let i = 0; i < result.data.vip_card_list.length; i++) {
              if (!result.data.vip_card_list[i].accepted) {
                this.signCardInfo = result.data.vip_card_list[i];
                break;
              }
            }
            this.isSignCard = true;
          } else {
            this._getPublicNotice();
          }
        } else {
          this.isSignCard = false;
          if (parseInt(this.userInfo.to_newbee_room)) {
            // if (this.isOneShow) {
            this.isNewBee = true;
            // }
          } else {
            this._getPublicNotice();
          }
        }
      },
      async _getPublicNotice() {
        let result = await api.getPublicNotice();
        if (result.data.length) {
          this.isPublicNotice = true;
          this.publicNoticeInfo = result.data;
        } else {
          this.$store.commit('isOneShow');
          this.isPublicNotice = false;
        }
        updateBaseInfo();
      },
      //获取新手场房间信息
      onIndexChange(index) {
        this.tabIndex = index;
      },
      changeTab(index) {
        console.log("index:", index);
        this.tabIndex = index;
        switch (index) {
          case 0:
            this.$router.push({path: '/home/index'});
            break;
          case 1:
            this.$router.push({path: '/home/zxww'});
            break;
          case 2:
            this.$router.push({path: '/home/niu'});
            break;
          case 3:
            this.$router.push({path: '/home/score'});
            break;
          case 4:
            this.$router.push({path: '/home/earn'});
            break;
        }
      },
      changeZIndex(zIndex) {
        this.tabZIndex = zIndex;
      },
      signComplete() {
        this.isSign = false;
        console.log("签到完成");
        setTimeout(() => {
          this._getVipCard();
        }, 500);
      },
      closeSignCard() {
        this.isSignCard = false;
        setTimeout(() => {
          this._getVipCard();
        }, 500)
      },
      closePublic() {
        this.$store.commit('isOneShow', false);
        this.isPublicNotice = false;
      },
      closeNewBee(bool) {
        if (!bool) {
          this.$store.commit('isOneShow', false);
          this.$router.push({path: '/recharge'});
          updateBaseInfo();       //更新个人信息
        }
        this.isNewBee = false;
      }
    },
    computed: {
      ...mapGetters(['isOneShow', 'userInfo'])
    },
    components: {
      Tabbar, TabbarItem, SignPopup, SignWeek, PublicNotice, NewBeeRoom
    }
  };
</script>

<style lang="less">
  .home-wrapper {
    width: 100%;
    height: 100%;
    .weui-tabbar__item {
      padding: 10px 0;
    }
    .tab_bar {
      position: fixed;
    }
    .icon_img {
      width: 100%;
      img {
        width: 100%;
        height: auto;
        -webkit-transform: scale(1.3);
        -moz-transform: scale(1.3);
        -ms-transform: scale(1.3);
        -o-transform: scale(1.3);
        transform: scale(1.3);
      }
    }
  }
</style>
