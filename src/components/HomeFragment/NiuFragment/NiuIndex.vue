<template>
  <div class="niu-wrapper">
    <header class="niu-header" ref="niuHeader">
      <img class="img-decorate" src="~/img/niudan/niudan_header.gif" alt="">
      <img class="img-text" src="~/img/niudan/niudan_header_text.png" alt="">
      <img class="img-decorate" src="~/img/niudan/niudan_header.gif" alt="">
    </header>
    <scorll-view
      ref="scrollerNiu"
      :tabHeight="scrollBottom"
      :showBottom="{isShow:true,text:'没有更多娃娃了哟~'}"
      @on-pulldown-loading="onPulldownLoading"
      @on-pullup-loading="onPullupLoading">
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
    name: "NiuIndex",
    props: ["tabHeight"],
    data() {
      return {
        scrollBottom: 0,        //header的高度
        listNiuDan: [],         //扭蛋列表
        page: 1
      };
    },
    mounted() {
      this._getNiudanList();
      console.log(this.tabHeight, this.$refs.niuHeader.clientHeight);
      this.$nextTick(() => {
        this.scrollBottom = -(this.tabHeight + this.$refs.niuHeader.clientHeight);
      });
    },
    methods: {
      async _getNiudanList(page = 1, isRefresh = false) {
        let result = await api.getNiudanList(page);
        console.log(result);
        if (result.data.length) {
          if (isRefresh) {
            this.$refs.scrollerNiu.reset({top: 0});
            this.$refs.scrollerNiu.enablePullup();
            this.$refs.scrollerNiu.donePulldown();
          } else {
            this.$refs.scrollerNiu.reset();
          }
          if (page === 1) {
            this.listNiuDan = result.data;
          } else {
            this.listNiuDan = this.listNiuDan.concat(result.data);
          }
          if (result.data.length < 10) {
            console.log("只有这么多扭蛋了");
            this.$refs.scrollerNiu.disablePullup();
          } else {
            this.$refs.scrollerNiu.donePullup();
          }
        } else if (page > 1) {
          console.log("没有更多扭蛋1");
          this.$refs.scrollerNiu.disablePullup();
        } else {
          console.log("没有更多扭蛋2");
          this.$refs.scrollerNiu.disablePullup();
        }
        this.$vux.loading.hide();
      },
      onPulldownLoading() {
        this.$vux.loading.show({
          text: "加载中.."
        });
        this._getNiudanList(1, true);
      },
      onPullupLoading() {
        this.$vux.loading.show({
          text: "加载中.."
        });
        this.page += 1;
        this._getNiudanList(this.page);
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
        width: 400px;
        height: 38px;
      }
    }
    .niu-content {
      //height: 1000px;
    }
  }
</style>
