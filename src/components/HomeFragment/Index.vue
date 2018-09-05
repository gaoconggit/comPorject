<template>
  <div class="home-wrapper">
    <keep-alive>
      <router-view @changeTab="changeTab" @changeZIndex="changeZIndex" :tabHeight="tabHeight"></router-view>
    </keep-alive>
    <tabbar class="tab_bar"
            :style="{zIndex: tabZIndex}"
            iconClass="icon_img"
            v-model="tabIndex"
            @on-index-change="onIndexChange">
      <tabbar-item link="/home/index">
        <img slot="icon" src="../../assets/img/index/index_select_not.png">
        <img slot="icon-active" src="../../assets/img/index/index_select.png">
      </tabbar-item>
      <tabbar-item link="/home/zxww">
        <img slot="icon" src="../../assets/img/index/xzww_select_not.png">
        <img slot="icon-active" src="../../assets/img/index/xzww_select.png">
      </tabbar-item>
      <tabbar-item link="/home/niu">
        <img slot="icon" src="../../assets/img/index/niu_select_not.png">
        <img slot="icon-active" src="../../assets/img/index/niu_select.png">
      </tabbar-item>
      <tabbar-item link="/home/score">
        <img slot="icon" src="../../assets/img/index/shop_select_not.png">
        <img slot="icon-active" src="../../assets/img/index/shop_select.png">
      </tabbar-item>
      <tabbar-item link="/home/earn">
        <img slot="icon" src="../../assets/img/index/earn_select_not.png">
        <img slot="icon-active" src="../../assets/img/index/earn_select.png">
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
  import {Tabbar, TabbarItem} from 'vux'

  export default {
    name: "HomeFragment",
    data() {
      return {
        back: false,
        tabIndex: 0,      //默认选中的底部菜单
        tabHeight: 48,
        tabZIndex: 10,
      }
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
      }
    },
    methods: {
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
      }
    },

    components: {
      Tabbar, TabbarItem
    }
  }
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
