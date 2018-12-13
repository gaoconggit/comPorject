<!--
** 金币明细
-->

<template>
  <div class="coin-detail">
    <title-bar title="金币明细" @get-title-height="titleHeight"/>
    <div class="center" ref="coinCenter">
      <p class="text">账户金币</p>
      <p class="coin">{{userInfo.coin}}</p>
    </div>
    <scroll-view
      v-show="coinList.length"
      class="list-wrapper"
      :tabHeight="headerHeight"
      ref="coinScroll"
      :showBottom="{isShow:true,text:'没有更多信息了~'}"
      @on-pulldown-loading="onPullDown"
      @on-pullup-loading="onPullUp">
      <li class="list-item" v-for="item in coinList" :key="item.id">
        <div class="item-left">
          <p>{{item.actiontitle}}</p>
          <p class="time">{{formatTime(item.addtime)}}</p>
        </div>
        <p class="type" :class="{'active':item.type ==='income'}">{{item.type ==='income'
          ?'+':'-'}}{{item.totalcoin}}</p>
      </li>
    </scroll-view>
    <div v-if="!coinList.length">
      <p class="empty-text">你暂时没有金币明细哟~</p>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import TitleBar from "@/common/TitleBar"
  import ScrollView from "@/common/ScrollView";
  import api from "../../api/BaseService";
  import {getTimeDate} from "../../common/util/Utils";

  export default {
    name: "CoinDetailed",
    data() {
      return {
        headerHeight: 0,  //header高度
        coinList: [],     //金币明细列表
        page: 1
      };
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.coinScroll.reset();
      })
      this._getCoinDetailed();
    },
    methods: {
      async _getCoinDetailed(page = 1, isRefresh = false) {
        let result = await api.getCoinDetailed(page);
        if (result.data.list.length) {
          if (isRefresh) {
            this.page = 1;
            this.$refs.coinScroll.reset({top: 0}, 500);
            this.$refs.coinScroll.enablePullup();
            this.$refs.coinScroll.donePulldown();
          } else {
            this.$refs.coinScroll.reset();
          }
          if (page === 1) {
            this.coinList = result.data.list;
          } else {
            this.coinList = this.coinList.concat(result.data.list);
          }
          if (result.data.list.length < 10) {
            this.$refs.coinScroll.disablePullup();
          } else {
            this.$refs.coinScroll.donePullup();
          }
        } else if (page > 1) {
          this.$refs.coinScroll.disablePullup();
          console.log("没有更多信息了1");
        } else {
          this.coinList = [];
          this.$refs.coinScroll.disablePullup();
          console.log("没有更多信息了2");
        }
      },
      onPullDown() {
        this.page = 1;
        this._getCoinDetailed(1, true);
      },
      onPullUp() {
        this.page += 1;
        this._getCoinDetailed(this.page);
      },
      titleHeight(height) {
        if (Number(height)) {
          this.headerHeight = -(height + this.$refs.coinCenter.clientHeight);
        }
      },
      formatTime(num) {
        return getTimeDate(num);
      },
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    components: {TitleBar, ScrollView}
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .coin-detail {
    .center {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 300px;
      background-color: @lightGrayColor;
      .text {
        color: @grayColor;
      }
      .coin {
        font-size: @maxFontSize;
        font-weight: 600;
        line-height: 60px;
        color: @mainColor;
      }
    }
    .list-wrapper {
      .list-item {
        padding: 0 20px;
        display: flex;
        align-items: center;
        height: 130px;
        border-bottom: 1px solid @lightGrayColor;
        .item-left {
          flex: 1;
          .over-ellip;
          p {
            line-height: 50px;
            .over-ellip;
          }
          .time {
            font-size: @subFontSize;
            color: @grayColor;
          }
        }
        .type {
          color: blue;
          &.active {
            font-weight: 600;
            color: @mainColor;
          }
        }
      }
    }
    .empty-text{
      text-align: center;
      line-height: 60px;
    }
  }
</style>
