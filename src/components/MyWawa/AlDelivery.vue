<!--
** 运单列表
-->

<template>
  <div class="al-delivery">
    <scroll-view
      v-show="orderList.length"
      :tabHeight="tabHeight"
      :showBottom="{isShow:true,text:'没有更多订单了'}"
      ref="alScroller"
      @on-pulldown-loading="onPullDown"
      @on-pullup-loading="onPullUp">
      <div class="item-wrap" v-for="item in orderList" :key="item.waybillno" @click="clickItem(item)">
        <div class="icon"><img v-lazy="item.goods[0].icon" alt=""></div>
        <div class="info">
          <p class="name">{{item.goods[0].name}}</p>
          <p class="time">{{formatTime(item.ctime)}}</p>
        </div>
      </div>
    </scroll-view>
    <div v-if="!orderList.length" class="empty-wrapper">
      <div class="empty-icon"><img src="~/img/com_img/not_notice.png" alt=""></div>
      <p>暂无运单哟~</p>
    </div>
  </div>
</template>

<script>
  import {mapMutations} from "vuex";
  import ScrollView from "@/common/ScrollView";
  import WawaListItem from "@/common/WawaListItem";
  import api from "../../api/BaseService";
  import {getTimeDate} from "../../common/util/Utils";

  export default {
    name: "AlDelivery",
    props: ['tabHeight'],
    data() {
      return {
        orderList: [],      //我的订单列表
      }
    },
    mounted() {
      this._getWaybillList();
    },
    methods: {
      ...mapMutations({set_mailDetail: 'SET_MAIL_DETAILS'}),
      async _getWaybillList(page = 1, isRefresh = false) {
        let result = await api.getWaybillList(page);
        console.log(result);
        if (result.data.length) {
          if (page === 1) {
            this.orderList = result.data;
          } else {
            this.orderList = this.orderList.concat(this.orderList);
          }
          if (result.data.length < 10) {
            this.$refs.alScroller.disablePullup();
          } else {
            this.$refs.alScroller.donePullup();
          }
        } else if (page > 1) {
          console.log("没有更多订单");
          this.$refs.alScroller.disablePullup();
        } else {
          console.log("没有更多订单");
          this.orderList = [];
          this.$refs.alScroller.disablePullup();
        }
        if (isRefresh) {
          this.$refs.alScroller.reset({top: 0}, 500);
          this.$refs.alScroller.enablePullup();
          this.$refs.alScroller.donePulldown();
        } else {
          this.$refs.alScroller.reset();
        }
      },
      onPullDown() {
        this.page = 1;
        this._getWaybillList(1, true);
      },
      onPullUp() {
        this.page += 1;
        this._getWaybillList(this.page);
      },
      clickItem(item) {
        this.set_mailDetail(item);
        this.$router.push({path: '/maildetails'})
      },
      formatTime(num) {
        return getTimeDate(num);
      },
    },
    components: {ScrollView, WawaListItem}
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .al-delivery {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    .item-wrap {
      display: flex;
      align-items: center;
      padding: 10px 0;
      .icon {
        margin: 0 20px;
        width: 110px;
        height: 110px;
        border-radius: 20px;
        overflow: hidden;
        .img-spread;
      }
      .info {
        flex: 1;
        line-height: 50px;
        color: #000;
        font-size: @mainFontSize;
        .over-ellip;
        .name {
          .over-ellip;
        }
        .time {
          font-size: @subFontSize;
          color: @grayColor;
        }
      }
    }
    .empty-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .empty-icon {
        margin-bottom: 30px;
        width: 363px;
        height: 363px;
        .img-spread;
      }
    }
  }
</style>
