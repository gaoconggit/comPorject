<!--
** 未发货的
-->

<template>
  <div class="un-delivery">
    <scroll-view v-show="unList.length" :tabHeight="tabHeight">
      <wawa-list-item :data="unList"/>
    </scroll-view>
    <div v-if="!unList.length">1234</div>
  </div>
</template>

<script>
  import ScrollView from "@/common/ScrollView";
  import WawaListItem from "@/common/WawaListItem";
  import api from "../../api/BaseService";

  export default {
    name: "UnDelivery",
    props: ['tabHeight'],
    data() {
      return {
        unList: [],         //未发货的列表
      }
    },
    mounted() {
      this._getMyWawaList();
    },
    methods: {
      async _getMyWawaList(page = 1) {
        let result = await api.getMyWawaList(page);
        console.log(result);
        this.unList = result.data;
      },
    },
    components: {ScrollView, WawaListItem}
  }
</script>

<style scoped lang="less">
  .un-delivery {

  }
</style>
