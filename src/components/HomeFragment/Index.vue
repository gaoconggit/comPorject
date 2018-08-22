<template>
  <div class="home-wrapper">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <tabbar class="tab_bar"
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
  import {Tabbar, TabbarItem, Group, Cell} from 'vux'

  export default {
    name: "HomeFragment",
    data() {
      return {
        back: false,
        tabIndex: 0,      //默认选中的底部菜单
      }
    },
    methods: {
      onIndexChange(index) {
        this.tabIndex = index;
      },
    },
    computed: {
    },
    components: {
      Tabbar, TabbarItem, Group, Cell
    }
  }
</script>

<style lang="less">
  .home-wrapper {
    width: 100%;
    height: 100%;
    .weui-tabbar__item {
      padding: 5px 0;
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
