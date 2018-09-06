<!--
** 运单列表
-->

<template>
  <div class="al-delivery">
    <scroll-view v-show="orderList.length" :tabHeight="tabHeight">
      <wawa-list-item :data="orderList"/>
    </scroll-view>
    <div v-if="!orderList.length" ref="emptyOrder">
      <p>n内容为空</p>
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
.al-delivery{

}
</style>
