<!--
** 运单列表
-->

<template>
  <div class="al-delivery">
    <scroll-view v-show="orderList.length" :tabHeight="tabHeight">
      <wawa-list-item :data="orderList"/>
    </scroll-view>
    <div v-if="!orderList.length" class="empty-wrapper">
      <div class="empty-icon"><img src="~/img/com_img/not_notice.png" alt=""></div>
      <p>暂无运单哟~</p>
    </div>
  </div>
</template>

<script>
  import ScrollView from "@/common/ScrollView";
  import WawaListItem from "@/common/WawaListItem";
  import api from "../../api/BaseService";

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
      async _getWaybillList(page = 1) {
        let result = await api.getWaybillList(page);
        console.log(result);
        this.orderList = result.data;
      },
    },
    components: {ScrollView, WawaListItem}
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .al-delivery {
    .empty-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .empty-icon {
        margin-top: 100px;
        margin-bottom: 30px;
        width: 363px;
        height: 363px;
        .img-spread;
      }
    }
  }
</style>
