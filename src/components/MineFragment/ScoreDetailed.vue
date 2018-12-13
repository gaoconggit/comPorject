<!--
** 积分明细
-->

<template>
  <div class="coin-detail">
    <title-bar title="积分明细" @get-title-height="titleHeight"/>
    <div class="center" ref="coinCenter">
      <p class="text">账户积分</p>
      <p class="coin">{{userInfo.score}}</p>
    </div>
    <scroll-view
      v-show="scoreList.length"
      class="list-wrapper"
      :tabHeight="headerHeight"
      ref="scoreScroll"
      :showBottom="{isShow:true,text:'没有更多信息了~'}"
      @on-pulldown-loading="onPullDown"
      @on-pullup-loading="onPullUp">
      <li class="list-item" v-for="item in scoreList" :key="item.id">
        <div class="item-left">
          <p>{{item.title}}</p>
          <p class="time">{{formatTime(item.ctime)}}</p>
        </div>
        <p class="type" :class="{'active':addClass(item.change)}">{{addClass(item.change)?"+":""}}{{item.change}}</p>
      </li>
    </scroll-view>
    <div v-if="!scoreList.length">
      <p class="empty-text">你暂时没有积分明细哟~</p>
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
    name: "ScoreDetailed",
    data() {
      return {
        headerHeight: 0,  //header高度
        scoreList: [],     //金币明细列表
        page: 1
      };
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.scoreScroll.reset();
      })
      this._getScoreDetailed();
    },
    methods: {
      async _getScoreDetailed(page = 1, isRefresh = false) {
        let result = await api.getScoreDetailed(page);
        console.log(result);
        if (result.data.history.length) {
          if (isRefresh) {
            this.listPage = 1;
            this.$refs.scoreScroll.reset({top: 0}, 500);
            this.$refs.scoreScroll.enablePullup();
            this.$refs.scoreScroll.donePulldown();
          } else {
            this.$refs.scoreScroll.reset();
          }
          if (page === 1) {
            this.scoreList = result.data.history;
          } else {
            this.scoreList = this.scoreList.concat(result.data.history);
          }
          if (result.data.history.length < 10) {
            this.$refs.scoreScroll.disablePullup();
          } else {
            this.$refs.scoreScroll.donePullup();
          }
        } else if (page > 1) {
          this.$refs.scoreScroll.disablePullup();
          console.log("没有更多信息了1");
        } else {
          this.scoreList = [];
          this.$refs.scoreScroll.disablePullup();
          console.log("没有更多信息了2");
        }
      },
      onPullDown() {
        console.log(1234);
        this.page = 1;
        this._getScoreDetailed(1, true);
      },
      onPullUp() {
        console.log(4567);
        this.page += 1;
        this._getScoreDetailed(this.page);
      },
      titleHeight(height) {
        if (Number(height)) {
          this.headerHeight = -(height + this.$refs.coinCenter.clientHeight);
        }
      },
      formatTime(num) {
        return getTimeDate(num);
      },
      addClass(type) {
        let reg = /\-/;
        if (reg.test(type)) {
          return false
        }
        return true
      }
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
    .empty-text {
      text-align: center;
      line-height: 60px;
    }
  }
</style>
