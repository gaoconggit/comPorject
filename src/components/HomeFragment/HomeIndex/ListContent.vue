<template>
  <div class="list-wrapper">
    <grid :cols="2" :show-lr-borders="false" :show-vertical-dividers="false">
      <grid-item
        v-for="item in wawaList"
        :key="item.giftid"
        @on-item-click="joinRoom(item)">
        <img slot="icon" :src="item.gifticon" alt="">
        <div class="tag_left">
          <img :src="roomType(item)" alt="">
        </div>
        <div class="tag_right">
          <img :src="roomStatus(Number(item.status))" alt="">
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
  import {showToast} from "../../../common/util/Utils"

  export default {
    name: "ListContent",
    props: ['wawaList'],
    data() {
      return {}
    },
    methods: {
      joinRoom(item) {
        if (!Number(item.status)) {
          showToast("房间补货中，去其他的房间玩玩吧~", 'text', 2000, '300px');
        } else {
          this.$router.push({path: '/recharge', query: {id: item.giftid}});
        }
      },
      roomType(item) {
        if (Number(item.is_strong) && Number(item.is_baosong)) {
          return require('img/home/tag_4.png');
        } else if (Number(item.is_strong) && Number(item.is_vip)) {
          return require('img/home/tag_6.png')
        } else if (Number(item.is_baosong) && Number(item.is_vip)) {
          return require('img/home/tag_5.png')
        } else if (Number(item.is_strong)) {
          return require('img/home/tag_1.png');
        } else if (Number(item.is_baosong)) {
          return require('img/home/tag_2.png');
        } else if (Number(item.is_vip)) {
          return require('img/home/tag_3.png');
        } else {
          return '';
        }
      },
      roomStatus(status) {
        let img = '';
        switch (status) {
          case 1:
            img = require('img/home/tag_free.png');
            break;
          case 2:
            img = require('img/home/tag_play.png');
            break;
          case 3:
            img = require('img/home/tag_wrong.png');
            break;
          default:
            img = require('img/home/tag_wrong.png');
            break;
        }
        return img;
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
    .weui-grids {
      &::before {
        border: none !important;
      }
    }
    .weui-grid {
      padding: 0;
      color: #FFF;
      border: none;
      &::after {
        border: none;
      }
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
        .img-spread;
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
          .img-spread;
        }
      }
    }
  }
</style>
