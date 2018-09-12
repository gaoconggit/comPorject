/**
*  扭蛋列表
*
*/
<template>
  <grid :cols="2" :show-lr-borders="false" :show-vertical-dividers="false" class="list-wrapper">
    <grid-item
      class="grid"
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
        this.$router.push({
          path: '/niu',
          query: {
            title: item.name,
            id: item.id,
            // url: `${baseUrl}niudan/index.php?base_url=${baseUrl}api/public/&token=${this.userInfo.token}&uid=${this.userInfo.id}&room_id=${item.id}`
            url: `?base_url=${baseUrl}api/public/&token=${this.token}&uid=${this.uid}&room_id=${item.id}`
          },
          meta: {keepAlive: false}
        })
      }
    },
    computed: {
      ...mapGetters(['token', 'uid'])
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
    .grid {
      padding: 0;
      color: @whiteColor;
      border: none;
      &::after {
        border: none;
      }
      .item-icon {
        margin: auto;
        width: 374px;
        height: 454px;
        .img-spread;
      }
      .header {
        position: absolute;
        top: 6px;
        left: 18px;
        width: 340px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        .background-url("~img/niudan/header_bg.png")
      }
      .price {
        position: absolute;
        bottom: 60px;
        left: 60px;
        background-color: @mainColor;
        padding: 8px 20px;
        -webkit-border-radius: 40px;
        -moz-border-radius: 40px;
        border-radius: 40px;
        display: flex;
        align-items: center;
        font-size: @mainFontSize;
        font-weight: 600;
        .coin {
          margin-right: 12px;
          width: 72/2px;
          height: 72/2px;
          .img-spread;
        }
      }
    }
  }
</style>
