<template>
  <div class="niu-wrapper">
    <header class="niu-header" ref="niuHeader">
      <img class="img-decorate" src="~/img/niudan/niudan_header.gif" alt="">
      <img class="img-text" src="~/img/niudan/niudan_header_text.png" alt="">
      <img class="img-decorate" src="~/img/niudan/niudan_header.gif" alt="">
    </header>
    <!--<a href="javascript:;" @click="changTab">改变tab</a>
    <router-link :to="{path:'/recharge',query:{}}">我的金币</router-link>-->
    <scorll-view
      ref="scrollerNiu"
      :tabHeight="scrollBottom"
      :showBottom="{isShow:true,text:'没有更多娃娃了哟~'}"
      @on-pulldown-loading="onPulldownLoading"
      @on-pullup-loading="onPullupLoading"
      @on-scroll-bottom="onScrollBottom">
        <div class="niu-content">
          <list-niu-dan :niudanList="listNiuDan"/>
        </div>
    </scorll-view>
  </div>
</template>

<script>
import api from "../../../api/BaseService";
import ScorllView from "@/common/ScrollView";
import ListNiuDan from "./ListNiuDan";

export default {
  name: "Index",
  props: ["tabHeight"],
  data() {
    return {
      scrollBottom: 0,        //header的高度
      listNiuDan: [1,2,3,4,5],         //扭蛋列表
    };
  },
  mounted() {
    this._getBanner();
    console.log(this.tabHeight, this.$refs.niuHeader.clientHeight);
    this.$nextTick(() => {
      this.scrollBottom = -(this.tabHeight + this.$refs.niuHeader.clientHeight);
    });
  },
  methods: {
    async _getBanner() {
      let result = await api.getBanner();
      console.log(result);
    },
    onPulldownLoading() {
      console.log(1);
    },
    onPullupLoading() {
      console.log(2);
    },
    onScrollBottom() {
      console.log(3);
    },
    changTab() {
      this.$emit("changeTab", 0);
    }
  },
  components: {
    ScorllView,
    ListNiuDan
  }
};
</script>

<style lang="less">
@import "~assets/style/index.less";
.niu-wrapper {
  position: fixed;
  width: 100%;
  height: 100%;
  .background-url("~img/home/main_bg.png");
  .niu-header {
    display: flex;
    width: 100%;
    height: 88/2px;
    justify-content: center;
    align-items: center;
    .img-decorate,
    .img-text {
      .img-spread;
    }
    .img-decorate {
      width: 90/2px;
      height: 28/2px;
    }
    .img-text {
      width: 400/2px;
      height: 38/2px;
    }
  }
  .niu-content {
  }
}
</style>
