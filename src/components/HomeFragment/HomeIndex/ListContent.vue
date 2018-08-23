<template>
  <div class="list-wrapper">
    <grid :cols="2">
      <grid-item v-for="item in wawaList" :key="item.giftid" @click="abc(item)">
        <img slot="icon" :src="item.gifticon" alt="">
        <div class="tag_left">
          <img src="~/img/home/tag_1.png" alt="">
        </div>
        <div class="tag_right">
          <img src="~/img/home/tag_free.png" alt="">
        </div>
        <div class="name">
          <p class="item_name">{{item.giftname}}</p>
        </div>
        <div class="price">
          <div class="icon">
            <img src="~/img/home/coin_icon.png" alt="">
          </div>
          <p class="item_price">{{item.spendcoin}}</p>
        </div>
      </grid-item>
    </grid>
  </div>
</template>

<script>
  import {Grid, GridItem} from "vux";

  export default {
    name: "ListContent",
    props: ['wawaList'],
    data() {
      return {
        data: [
          {
            gifticon: 'http://p2y1tzpyq.bkt.clouddn.com/20180131_5a7160dd4427a.png',
            giftid: '8',
            giftname: 'YBL',
            is_baosong: '0',
            is_promotion: '0',
            is_strong: '1',
            is_vip_only: '0',
            spendcoin: '20',
            status: '0',
            vip_level: '0'
          },
          {
            gifticon: 'http://p2y1tzpyq.bkt.clouddn.com/20180131_5a7160dd4427a.png',
            giftid: '9',
            giftname: 'YBL',
            is_baosong: '0',
            is_promotion: '0',
            is_strong: '1',
            is_vip_only: '0',
            spendcoin: '20',
            status: '0',
            vip_level: '0'
          },
          {
            gifticon: 'http://p2y1tzpyq.bkt.clouddn.com/20180131_5a7160dd4427a.png',
            giftid: '10',
            giftname: 'YBL',
            is_baosong: '0',
            is_promotion: '0',
            is_strong: '1',
            is_vip_only: '0',
            spendcoin: '20',
            status: '0',
            vip_level: '0'
          },
        ]
      }
    },
    methods: {
      abc(item) {
        console.log(item);
      }
    },
    components: {
      Grid, GridItem
    }
  }
</script>

<style lang="less">
  @import "~assets/style/index.less";

  .list-wrapper {
    .weui-grid {
      padding: 0;
      color: #FFF;
      .weui-grid__icon {
        width: 356/2px !important;
        height: 436/2px !important;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .tag_left, .tag_right {
        position: absolute;
        top: 3/2px;
        height: 60/2px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .tag_left {
        width: 180/2px;
        left: 9px;
      }
      .tag_right {
        width: 160/2px;
        right: 9px;
      }
      .name, .price {
        position: absolute;
        bottom: 38px;
        background-color: @mainColor;
        padding: 4px 6px;
        -webkit-border-radius: 20px;
        -moz-border-radius: 20px;
        border-radius: 20px;
      }
      .name {
        left: 16px;
        width: 84px;
        .item_name {
          font-size: 14px;
          line-height: 16px;
        }
      }
      .price {
        display: flex;
        align-items: center;
        right: 16px;
        .icon {
          margin-right: 2px;
          width: 36/2px;
          height: 36/2px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
</style>
