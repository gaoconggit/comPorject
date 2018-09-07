<!--
** 未发货的
-->

<template>
  <div class="un-delivery">
    <scroll-view v-show="unList.length" :tabHeight="unHeight"
                 ref="unDeliveryScroller"
                 :showBottom="{isShow:true,text:'只有这么多娃娃了哟~'}"
                 @on-pulldown-loading="onPullDown"
                 @on-pullup-loading="onPullUp">
      <wawa-list-item :data="unList" @on-item-click="clickItem">
        <div class="select-icon" slot-scope="slot" slot="left"><img
          :src="slot.item.is_select?require('img/wawa/select_yes.png'):require('img/wawa/select_not.png')" alt=""></div>
      </wawa-list-item>
    </scroll-view>
    <div v-if="!unList.length" class="empty-wrapper">
      <div class="empty-icon"><img src="~/img/com_img/not_notice.png" alt=""></div>
      <p>暂无需要邮寄的娃娃，快去抓一个吧~</p>
    </div>
    <div class="bottom-wrapper" ref="wawaBottom">
      <div class="btn deliver"><img src="~/img/wawa/button_deliver.png" alt=""></div>
      <div class="btn exchange">
        <img src="~/img/wawa/button_exchange.png" alt="">
        <p>(可兑换123456)</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from "vuex";
  import ScrollView from "@/common/ScrollView";
  import WawaListItem from "@/common/WawaListItem";
  import api from "../../api/BaseService";

  export default {
    name: "UnDelivery",
    props: ['tabHeight'],
    data() {
      return {
        unHeight: 0,
        unList: [],         //未发货的列表
        page: 1,            //默认页码
        Select: [],         //选中
      }
    },
    mounted() {
      this._getMyWawaList();
    },
    watch: {
      tabHeight() {
        this.unHeight = this.tabHeight - this.$refs.wawaBottom.clientHeight;
        this.$refs.unDeliveryScroller.reset();
      }
    },
    methods: {
      ...mapMutations({set_isSelect: 'SET_IS_SELECT'}),
      ...mapActions(['addSelect', 'deleteSelect']),
      async _getMyWawaList(page = 1, isRefresh = false) {
        let result = await api.getMyWawaList(page);
        if (result.data.length) {
          let arr = result.data;
          arr.forEach((item) => {
            item.is_select = false;
          });
          for (let i = 0; i < this.isSelect.length; i++) {
            let nIndex = arr.findIndex((item) => {
              return item.w_id === this.isSelect[i].id;
            })
            arr[nIndex].is_select = true;
          }
          if (page === 1) {
            console.log("is_select:", arr);
            this.unList = arr;
          } else {

            this.unList = this.unList.concat(arr);
          }
          if (result.data.length < 10) {
            this.$refs.unDeliveryScroller.disablePullup();
          } else {
            this.$refs.unDeliveryScroller.donePullup();
          }
        } else if (page > 1) {
          this.$refs.unDeliveryScroller.disablePullup();
        } else {
          this.unList = [];
          this.$refs.unDeliveryScroller.disablePullup();
        }
        if (isRefresh) {
          this.set_isSelect([]);
          this.$refs.unDeliveryScroller.reset({top: 0}, 500);
          this.$refs.unDeliveryScroller.enablePullup();
          this.$refs.unDeliveryScroller.donePulldown();
        } else {
          this.$refs.unDeliveryScroller.reset();
        }
      },
      onPullDown() {
        this.page = 1;
        this._getMyWawaList(1, true);
      },
      onPullUp() {
        this.page += 1;
        this._getMyWawaList(this.page);
      },
      clickItem(item) {
        let arr = this.unList;
        if (arr.length) {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].w_id === item.w_id) {
              arr[i].is_select = !arr[i].is_select;
            }
          }
        }
        this.unList = arr;

        let sIndex = this.isSelect.findIndex((val) => {
          console.log(item.w_id, val.id);
          return item.w_id === val.id;
        });
        console.log("sIndex", sIndex);
        if (sIndex < 0) {
          this.addSelect({id: item.w_id});
        } else {
          this.deleteSelect({id: item.w_id}, sIndex);
        }
      }
    },
    computed: {
      ...mapGetters(['isSelect'])
    },
    destroyed() {

    },
    components: {ScrollView, WawaListItem}
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .un-delivery {
    .select-icon {
      padding: 0 16px;
      width: 34px;
      height: 34px;
      .img-spread;
    }
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
