/**
*  首页列表
*/
<template>
  <div class="list-wrapper">
    <grid :cols="2" :show-lr-borders="false" :show-vertical-dividers="false">
      <grid-item
        v-for="item in wawaList"
        :key="item.giftid"
        @on-item-click="joinRoom(item)">
        <div class="item-icon">
          <img v-lazy="item.gifticon">
        </div>
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
            <img src="~/img/com_img/coin_icon.png" alt="">
          </div>
          <p class="item_price">{{item.spendcoin}}</p>
        </div>
      </grid-item>
    </grid>
  </div>
</template>

<script>
  import {Grid, GridItem, XImg} from "vux";
  import {showToast} from "../../../common/util/Utils"

  export default {
    name: "ListContent",
    props: ['wawaList'],
    methods: {
      joinRoom(item) {
        if (!Number(item.status)) {
          showToast("房间补货中，去其他的房间玩玩吧~", 'text', 2000, '300px');
        } else {
          // window.localStorage.setItem("wawaji_room_id", item.giftid);
          this.$router.push({path: '/room', query: {id: item.giftid}});
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
      Grid, GridItem, XImg
    }
  }
</script>

<style scoped lang="less">
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
        width: 356px !important;
        height: 436px !important;
        .img-spread;
      }
      .item-icon {
        margin: auto;
        width: 356px !important;
        height: 436px !important;
        .img-spread;
      }
      .tag_left, .tag_right {
        position: absolute;
        top: 3px;
        height: 60px;
        .img-spread;
      }
      .tag_left {
        width: 180px;
        left: 18px;
      }
      .tag_right {
        width: 160px;
        right: 18px;
      }
      .name, .price {
        position: absolute;
        bottom: 67px;
        background-color: @mainColor;
        padding: 8px 12px;
        -webkit-border-radius: 40px;
        -moz-border-radius: 40px;
        border-radius: 40px;
      }
      .name {
        left: 32px;
        width: 168px;
        .item_name {
          font-size: @minFontSize;
          line-height: 36px;
        }
      }
      .price {
        display: flex;
        align-items: center;
        right: 32px;
        font-size: @minFontSize;
        .icon {
          margin-right: 4px;
          width: 36px;
          height: 36px;
          .img-spread;
        }
      }
    }
  }
</style>
