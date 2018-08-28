/**
*  扭蛋列表
*
*/
<template>
  <grid :cols="2" :show-lr-borders="false" :show-vertical-dividers="false" class="list-wrapper">
    <grid-item
      v-for="item in niudanList"
      :key="item.id"
      @on-item-click="joinNiuDan(item)"
    >
      <div class="item-icon">
        <img :src="item.icon" alt="">
      </div>
      <div class="header">
        <p class="name">{{item.name}}</p>
      </div>
      <div class="price">
        <div class="coin">
          <img src="~/img/com_img/coin_icon.png" alt="">
        </div>
        <p class="name">{{item.coin}}</p>
      </div>
    </grid-item>
  </grid>
</template>

<script>
  import {mapGetters} from "vuex";
  import {Grid, GridItem} from "vux";
  import {baseUrl} from "../../../config/config";

  export default {
    name: "ListNiuDan",
    props: ["niudanList"],
    methods: {
      joinNiuDan(item) {
        console.log(item.name);
        this.$router.push({
          path: '/details',
          query: {
            title: item.name,
            url: `${baseUrl}/niudan/index.php?base_url=${baseUrl}api/public/&token=${this.userInfo.token}&uid=${this.userInfo.id}&room_id=${item.id}`
          }
        })
      }
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    components: {
      Grid,
      GridItem
    }
  };
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .list-wrapper {
    &::before {
      border: none;
    }
    .weui-grid {
      padding: 0;
      color: @whiteColor;
      border: none;
      &::after {
        border: none;
      }
      .item-icon {
        margin: auto;
        width: 374/2px;
        height: 454/2px;
        .img-spread;
      }
      .header {
        position: absolute;
        top: 3px;
        left: 9px;
        width: 340/2px;
        height: 60/2px;
        line-height: 60/2px;
        text-align: center;
        .background-url("~img/niudan/header_bg.png")
      }
      .price {
        position: absolute;
        bottom: 30px;
        left: 30px;
        background-color: @mainColor;
        padding: 4px 10px;
        -webkit-border-radius: 20px;
        -moz-border-radius: 20px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 600;
        .coin {
          margin-right: 6px;
          width: 36/2px;
          height: 36/2px;
          .img-spread;
        }
      }
    }
  }
</style>
