<!--
** 游戏历史
-->

<template>
  <div class="history-wrapper">
    <title-bar class="title-bar" title="游戏历史" @get-title-height="titleHeight"></title-bar>
    <scroll-view
      class="list-content"
      ref="hsitoryScroll"
      :tabHeight="tabHeight"
      :showBottom="{isShow:true,text:'没有跟多历史记录了哟~'}"
      @on-pulldown-loading="onPullDown"
      @on-pullup-loading="onPullUp">
      <wawa-list-item :data="historyList" @on-item-click="clickItem">
        <p slot="right" slot-scope="slot" class="status" :class="{'active':parseInt(slot.item.success)}">
          {{parseInt(slot.item.success)?'抓取成功':'抓取失败'}}
        </p>
      </wawa-list-item>
    </scroll-view>
  </div>
</template>

<script>
  import {mapMutations} from "vuex";
  import TitleBar from "@/common/TitleBar";
  import WawaListItem from "@/common/WawaListItem";
  import ScrollView from "@/common/ScrollView";
  import api from "../../api/BaseService";

  export default {
    name: "HistoryIndex",
    data() {
      return {
        historyList: [],
        page: 1,
        tabHeight: 0,
      }
    },
    mounted() {
      this._getHistoryList();
    },
    methods: {
      ...mapMutations({set_history: "SET_HISTORY"}),
      async _getHistoryList(page = 1, isRefresh = false) {
        let result = await api.getHistoryList(page);
        if (result.data.length) {
          if (isRefresh) {
            this.page = 1;
            this.$refs.hsitoryScroll.reset({top: 0}, 500);
            this.$refs.hsitoryScroll.enablePullup();
            this.$refs.hsitoryScroll.donePulldown();
          } else {
            this.$refs.hsitoryScroll.reset();
          }
          if (page === 1) {
            this.historyList = result.data;
          } else {
            this.historyList = this.historyList.concat(result.data);
          }
          if (result.data.length < 10) {
            this.$refs.hsitoryScroll.disablePullup();
          } else {
            this.$refs.hsitoryScroll.donePullup();
          }
        } else if (page > 1) {
          console.log("已经没有数据了");
          this.$refs.hsitoryScroll.disablePullup();
        } else {
          this.historyList = [];
          this.$refs.hsitoryScroll.disablePullup();
          console.log("已经没有数据了");
        }
      },
      clickItem(item) {
        this.set_history(item);
        this.$router.push({path: `/history/${item.hid}`})
      },
      onPullDown() {
        this.page = 1;
        this._getHistoryList(this.page, true);
      },
      onPullUp() {
        this.page += 1;
        this._getHistoryList(this.page);
      },
      titleHeight(height) {
        if (Number(height)) {
          this.tabHeight = -height;
        }
      }
    },
    components: {TitleBar, WawaListItem, ScrollView},
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .history-wrapper {
    .title-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 10;
    }
    .list-content {
      position: relative;
      top: @titleBarHeight;
      .status {
        width: 180px;
        text-align: center;
        font-size: @subFontSize;
        color: @grayColor;
        &.active {
          color: @mainColor;
        }
      }
    }
  }
</style>
